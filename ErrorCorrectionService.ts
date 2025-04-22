import AgentModel from '../models/AgentModel';
import AgentLogModel from '../models/AgentLogModel';
import TestCaseModel from '../models/TestCaseModel';
import AgentOrchestrationService from './AgentOrchestrationService';

class ErrorCorrectionService {
  // Error thresholds for intervention
  private readonly CONSECUTIVE_ERROR_THRESHOLD = 3;
  private readonly ERROR_PATTERN_THRESHOLD = 0.7; // 70% similarity
  
  async detectErrors(agentId: string, input: string, output: string, expectedOutput?: string): Promise<any> {
    try {
      // Get the agent
      const agent = await AgentModel.findById(agentId);
      if (!agent) {
        throw new Error(`Agent with ID ${agentId} not found`);
      }
      
      // Check for obvious errors in the output
      const obviousErrors = this.checkForObviousErrors(output);
      
      // If we have an expected output, compare with actual output
      let comparisonErrors = [];
      if (expectedOutput) {
        comparisonErrors = this.compareOutputs(output, expectedOutput);
      }
      
      // Check for consecutive errors
      const consecutiveErrors = await this.checkConsecutiveErrors(agentId);
      
      // Combine all detected errors
      const allErrors = [
        ...obviousErrors.map(e => ({ type: 'obvious', ...e })),
        ...comparisonErrors.map(e => ({ type: 'comparison', ...e })),
        ...(consecutiveErrors ? [{ type: 'consecutive', message: `${consecutiveErrors} consecutive errors detected` }] : [])
      ];
      
      // Log the errors if any were found
      if (allErrors.length > 0) {
        await AgentLogModel.create({
          agentId,
          level: 'error',
          message: `Errors detected in agent response: ${allErrors.map(e => e.message).join('; ')}`,
          metadata: { 
            input,
            output,
            expectedOutput,
            errors: allErrors
          }
        });
      }
      
      return {
        hasErrors: allErrors.length > 0,
        errors: allErrors,
        needsIntervention: consecutiveErrors >= this.CONSECUTIVE_ERROR_THRESHOLD || allErrors.length > 2
      };
    } catch (error) {
      console.error('Error detecting errors:', error);
      throw error;
    }
  }
  
  private checkForObviousErrors(output: string): any[] {
    const errors = [];
    
    // Check for empty or extremely short responses
    if (!output || output.trim().length < 5) {
      errors.push({
        message: 'Empty or extremely short response',
        severity: 'high'
      });
    }
    
    // Check for error messages in the output
    const errorPatterns = [
      'error',
      'exception',
      'failed',
      'unable to',
      'cannot',
      'invalid'
    ];
    
    const lowercaseOutput = output.toLowerCase();
    for (const pattern of errorPatterns) {
      if (lowercaseOutput.includes(pattern)) {
        // Check if it's actually an error message and not just using the word
        const context = this.getErrorContext(lowercaseOutput, pattern);
        if (this.isLikelyErrorMessage(context)) {
          errors.push({
            message: `Potential error message detected: "${context}"`,
            severity: 'medium',
            context
          });
        }
      }
    }
    
    // Check for incomplete responses
    if (output.endsWith('...') || 
        output.includes('I'll continue') || 
        output.includes('to be continued')) {
      errors.push({
        message: 'Incomplete response detected',
        severity: 'low'
      });
    }
    
    return errors;
  }
  
  private getErrorContext(text: string, errorWord: string): string {
    const index = text.indexOf(errorWord);
    if (index === -1) return '';
    
    // Get 50 characters before and after the error word
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + errorWord.length + 50);
    
    return text.substring(start, end);
  }
  
  private isLikelyErrorMessage(context: string): boolean {
    // This is a simplified heuristic - in a real implementation, 
    // this would use more sophisticated NLP techniques
    const errorPhrases = [
      'an error occurred',
      'error:',
      'failed to',
      'exception:',
      'unable to process',
      'cannot complete',
      'invalid input'
    ];
    
    return errorPhrases.some(phrase => context.includes(phrase));
  }
  
  private compareOutputs(actual: string, expected: string): any[] {
    const errors = [];
    
    // Simple string similarity check
    const similarity = this.calculateStringSimilarity(actual, expected);
    
    if (similarity < 0.3) { // Less than 30% similar
      errors.push({
        message: 'Output significantly different from expected',
        severity: 'high',
        similarity: similarity
      });
    } else if (similarity < 0.7) { // Between 30% and 70% similar
      errors.push({
        message: 'Output partially different from expected',
        severity: 'medium',
        similarity: similarity
      });
    }
    
    // Check for missing key information
    // This is a simplified approach - a real implementation would use 
    // more sophisticated NLP techniques to identify key information
    const expectedWords = new Set(expected.toLowerCase().split(/\s+/));
    const actualWords = new Set(actual.toLowerCase().split(/\s+/));
    
    const missingWords = [...expectedWords].filter(word => 
      word.length > 5 && !actualWords.has(word) // Only consider "significant" words
    );
    
    if (missingWords.length > 5) {
      errors.push({
        message: 'Key information missing from output',
        severity: 'medium',
        missingWords: missingWords.slice(0, 10) // Limit to 10 examples
      });
    }
    
    return errors;
  }
  
  private calculateStringSimilarity(s1: string, s2: string): number {
    // Simplified Jaccard similarity for strings
    const set1 = new Set(s1.toLowerCase().split(/\s+/));
    const set2 = new Set(s2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }
  
  private async checkConsecutiveErrors(agentId: string): Promise<number> {
    // Get recent logs for this agent
    const recentLogs = await AgentLogModel.find({ 
      agentId, 
      level: 'error',
      timestamp: { $gte: new Date(Date.now() - 1 * 60 * 60 * 1000) } // Last hour
    })
    .sort({ timestamp: -1 })
    .limit(10);
    
    // Count consecutive errors
    let consecutiveCount = 0;
    for (const log of recentLogs) {
      if (log.level === 'error') {
        consecutiveCount++;
      } else {
        break; // Stop counting when we hit a non-error log
      }
    }
    
    return consecutiveCount;
  }
  
  async correctErrors(agentId: string, input: string, errorOutput: string, errorInfo: any): Promise<string> {
    try {
      // Get the agent
      const agent = await AgentModel.findById(agentId);
      if (!agent) {
        throw new Error(`Agent with ID ${agentId} not found`);
      }
      
      // Log the correction attempt
      await AgentLogModel.create({
        agentId,
        level: 'info',
        message: `Attempting to correct errors in agent response`,
        metadata: { 
          input,
          errorOutput,
          errorInfo
        }
      });
      
      // Create a modified prompt that includes error information
      const correctionPrompt = this.createCorrectionPrompt(input, errorOutput, errorInfo);
      
      // Use the agent orchestration service to process the corrected request
      // We're using a modified agent config with lower temperature for more reliable output
      const modifiedConfig = {
        ...agent.toObject(),
        properties: agent.properties.map((p: any) => {
          if (p.id === 'temperature') {
            return { ...p, value: Math.max(0.1, (p.value as number) - 0.3) };
          }
          return p;
        })
      };
      
      const correctedOutput = await AgentOrchestrationService.processAgentRequest(
        agentId, 
        correctionPrompt,
        modifiedConfig
      );
      
      // Log the successful correction
      await AgentLogModel.create({
        agentId,
        level: 'info',
        message: `Successfully corrected errors in agent response`,
        metadata: { 
          input,
          errorOutput,
          correctedOutput
        }
      });
      
      return correctedOutput;
    } catch (error) {
      console.error('Error correcting errors:', error);
      
      // Log the failed correction attempt
      await AgentLogModel.create({
        agentId,
        level: 'error',
        message: `Failed to correct errors in agent response: ${error.message}`,
        metadata: { 
          input,
          errorOutput,
          errorInfo
        }
      });
      
      // Return a fallback response
      return `I apologize, but I encountered an issue while processing your request. Please try again or rephrase your question.`;
    }
  }
  
  private createCorrectionPrompt(input: string, errorOutput: string, errorInfo: any): string {
    return `The following is a user request that resulted in an error or inadequate response.
    
User request: "${input}"

Previous response (with issues): "${errorOutput}"

Issues detected: ${errorInfo.errors.map((e: any) => e.message).join('; ')}

Please provide a corrected and improved response to the user's original request. Ensure your response is complete, accurate, and addresses all aspects of the request.`;
  }
  
  async runTestCases(agentId: string): Promise<any> {
    try {
      // Get all test cases for this agent
      const testCases = await TestCaseModel.find({ agentId });
      
      const results = [];
      let passCount = 0;
      
      // Run each test case
      for (const testCase of testCases) {
        // Update test case status to running
        testCase.status = 'running';
        await testCase.save();
        
        try {
          // Get the agent
          const agent = await AgentModel.findById(agentId);
          if (!agent) {
            throw new Error(`Agent with ID ${agentId} not found`);
          }
          
          // Process the test input
          const output = await AgentOrchestrationService.processAgentRequest(
            agentId,
            testCase.input,
            agent
          );
          
          // Check for errors
          const errorCheck = await this.detectErrors(agentId, testCase.input, output, testCase.expectedOutput);
          
          // Update test case with results
          testCase.actualOutput = output;
          testCase.status = errorCheck.hasErrors ? 'failure' : 'success';
          await testCase.save();
          
          // Track results
          if (!errorCheck.hasErrors) {
            passCount++;
          }
          
          results.push({
            testCaseId: testCase.id,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: output,
            success: !errorCheck.hasErrors,
            errors: errorCheck.errors
          });
        } catch (error) {
          console.error(`Error running test case ${testCase.id}:`, error);
          
          // Update test case as failed
          testCase.status = 'failure';
          testCase.actualOutput = `Error: ${error.message}`;
          await testCase.save();
          
          results.push({
            testCaseId: testCase.id,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: `Error: ${error.message}`,
            success: false,
            errors: [{ type: 'execution', message: error.message }]
          });
        }
      }
      
      // Calculate error rate
      const errorRate = testCases.length > 0 
        ? ((testCases.length - passCount) / testCases.length) * 100 
        : 0;
      
      // Update agent error rate
      if (testCases.length > 0) {
        await AgentModel.findByIdAndUpdate(agentId, { errorRate });
      }
      
      return {
        totalTests: testCases.length,
        passCount,
        failCount: testCases.length - passCount,
        errorRate,
        results
      };
    } catch (error) {
      console.error('Error running test cases:', error);
      throw error;
    }
  }
}

export default new ErrorCorrectionService();
