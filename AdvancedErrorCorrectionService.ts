import AgentModel from '../models/AgentModel';
import AgentLogModel from '../models/AgentLogModel';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';
import FailsafeControllerService from './FailsafeControllerService';

class AdvancedErrorCorrectionService {
  private model: OpenAI;
  
  constructor() {
    this.model = new OpenAI({ 
      modelName: 'gpt-4', 
      temperature: 0.2,
      openAIApiKey: process.env.OPENAI_API_KEY
    });
  }
  
  async detectHallucinations(agentId: string, input: string, output: string): Promise<any> {
    try {
      // Use LLM to detect potential hallucinations in the output
      const template = `You are an AI hallucination detector. Your task is to analyze an AI agent's response and identify any potential hallucinations, fabrications, or factual errors.

User Input: "${input}"

Agent Response: "${output}"

Please carefully analyze the agent's response and:
1. Identify any statements that appear to be hallucinations or fabrications
2. Identify any factual errors or misleading information
3. Assess the overall reliability of the response

A hallucination is defined as information presented as factual that is:
- Invented or fabricated
- Contradictory to known facts
- Impossible or highly implausible
- Not logically derivable from the input

Format your response as a JSON object with the following structure:
{
  "hasHallucinations": true/false,
  "hallucinationScore": 0-10 (0 = no hallucinations, 10 = completely hallucinated),
  "detectedHallucinations": [
    {"statement": "hallucinated statement", "explanation": "why this is a hallucination", "severity": "high/medium/low"}
  ],
  "factualErrors": [
    {"statement": "erroneous statement", "correction": "factual correction", "confidence": "high/medium/low"}
  ],
  "reliabilityAssessment": "overall assessment of response reliability"
}`;

      const promptTemplate = new PromptTemplate({
        template,
        inputVariables: []
      });
      
      const chain = new LLMChain({
        llm: this.model,
        prompt: promptTemplate
      });
      
      const result = await chain.call({});
      
      try {
        const hallucinationAnalysis = JSON.parse(result.text);
        
        // Log the hallucination detection if hallucinations were found
        if (hallucinationAnalysis.hasHallucinations) {
          await AgentLogModel.create({
            agentId,
            level: 'warning',
            message: `Detected potential hallucinations in agent response (score: ${hallucinationAnalysis.hallucinationScore}/10)`,
            metadata: { 
              input,
              output,
              hallucinationAnalysis
            }
          });
          
          // If hallucination score is high, check if we need to trigger failsafe
          if (hallucinationAnalysis.hallucinationScore >= 7) {
            await FailsafeControllerService.checkAgentSafety(agentId);
          }
        }
        
        return hallucinationAnalysis;
      } catch (error) {
        console.error('Error parsing LLM response as JSON:', error);
        return {
          hasHallucinations: false,
          hallucinationScore: 0,
          detectedHallucinations: [],
          factualErrors: [],
          reliabilityAssessment: "Error analyzing response for hallucinations"
        };
      }
    } catch (error) {
      console.error('Error detecting hallucinations:', error);
      throw error;
    }
  }
  
  async correctHallucinations(agentId: string, input: string, output: string, hallucinationAnalysis: any): Promise<string> {
    try {
      // Use LLM to generate a corrected response
      const template = `You are an AI hallucination correction specialist. Your task is to correct an AI agent's response that contains hallucinations or factual errors.

User Input: "${input}"

Original Agent Response (with hallucinations): "${output}"

Hallucination Analysis:
${JSON.stringify(hallucinationAnalysis, null, 2)}

Please generate a corrected version of the agent's response that:
1. Removes all hallucinations and factual errors
2. Replaces hallucinated content with accurate information or appropriate uncertainty
3. Maintains the helpful intent and tone of the original response
4. Acknowledges limitations when information is not available
5. Preserves any correct and useful information from the original response

The corrected response should be written in the first person, as if from the agent itself.`;

      const promptTemplate = new PromptTemplate({
        template,
        inputVariables: []
      });
      
      const chain = new LLMChain({
        llm: this.model,
        prompt: promptTemplate
      });
      
      const result = await chain.call({});
      
      // Log the hallucination correction
      await AgentLogModel.create({
        agentId,
        level: 'info',
        message: `Corrected hallucinations in agent response`,
        metadata: { 
          input,
          originalOutput: output,
          correctedOutput: result.text,
          hallucinationAnalysis
        }
      });
      
      return result.text;
    } catch (error) {
      console.error('Error correcting hallucinations:', error);
      
      // Return a fallback response
      return `I need to correct my previous response as it contained some inaccuracies. Based on the information available to me, I cannot provide a definitive answer to your query. I'd be happy to help with a different approach or question.`;
    }
  }
  
  async detectHarmfulContent(agentId: string, input: string, output: string): Promise<any> {
    try {
      // Use LLM to detect potentially harmful content
      const template = `You are an AI content safety specialist. Your task is to analyze an AI agent's response and identify any potentially harmful, inappropriate, or unsafe content.

User Input: "${input}"

Agent Response: "${output}"

Please carefully analyze both the user input and agent response to identify any content that is:
1. Harmful, dangerous, or could lead to physical harm
2. Unethical, illegal, or promoting harmful activities
3. Offensive, discriminatory, or hateful
4. Inappropriate for a professional AI assistant
5. Violating privacy or security best practices

Format your response as a JSON object with the following structure:
{
  "hasHarmfulContent": true/false,
  "harmScore": 0-10 (0 = completely safe, 10 = extremely harmful),
  "detectedIssues": [
    {"content": "problematic content", "category": "harm/ethics/offensive/inappropriate/privacy", "severity": "high/medium/low", "explanation": "why this is problematic"}
  ],
  "safetyAssessment": "overall assessment of content safety"
}`;

      const promptTemplate = new PromptTemplate({
        template,
        inputVariables: []
      });
      
      const chain = new LLMChain({
        llm: this.model,
        prompt: promptTemplate
      });
      
      const result = await chain.call({});
      
      try {
        const safetyAnalysis = JSON.parse(result.text);
        
        // Log the safety detection if harmful content was found
        if (safetyAnalysis.hasHarmfulContent) {
          await AgentLogModel.create({
            agentId,
            level: 'warning',
            message: `Detected potentially harmful content in agent interaction (score: ${safetyAnalysis.harmScore}/10)`,
            metadata: { 
              input,
              output,
              safetyAnalysis
            }
          });
          
          // If harm score is high, trigger failsafe
          if (safetyAnalysis.harmScore >= 7) {
            await FailsafeControllerService.checkAgentSafety(agentId);
          }
        }
        
        return safetyAnalysis;
      } catch (error) {
        console.error('Error parsing LLM response as JSON:', error);
        return {
          hasHarmfulContent: false,
          harmScore: 0,
          detectedIssues: [],
          safetyAssessment: "Error analyzing response for harmful content"
        };
      }
    } catch (error) {
      console.error('Error detecting harmful content:', error);
      throw error;
    }
  }
  
  async sanitizeHarmfulContent(agentId: string, input: string, output: string, safetyAnalysis: any): Promise<string> {
    try {
      // Use LLM to generate a sanitized response
      const template = `You are an AI content safety specialist. Your task is to sanitize an AI agent's response that contains potentially harmful or inappropriate content.

User Input: "${input}"

Original Agent Response (with issues): "${output}"

Safety Analysis:
${JSON.stringify(safetyAnalysis, null, 2)}

Please generate a sanitized version of the agent's response that:
1. Removes all harmful, dangerous, unethical, or inappropriate content
2. Replaces problematic content with safe, helpful alternatives
3. Maintains the helpful intent of the original response where appropriate
4. Politely declines to provide assistance for harmful requests
5. Preserves any safe and useful information from the original response

The sanitized response should be written in the first person, as if from the agent itself.`;

      const promptTemplate = new PromptTemplate({
        template,
        inputVariables: []
      });
      
      const chain = new LLMChain({
        llm: this.model,
        prompt: promptTemplate
      });
      
      const result = await chain.call({});
      
      // Log the content sanitization
      await AgentLogModel.create({
        agentId,
        level: 'info',
        message: `Sanitized harmful content in agent response`,
        metadata: { 
          input,
          originalOutput: output,
          sanitizedOutput: result.text,
          safetyAnalysis
        }
      });
      
      return result.text;
    } catch (error) {
      console.error('Error sanitizing harmful content:', error);
      
      // Return a fallback response
      return `I apologize, but I'm not able to provide assistance with that request. I'm designed to be helpful, harmless, and honest. Please let me know if I can help with something else.`;
    }
  }
  
  async detectAndCorrectErrors(agentId: string, input: string, output: string): Promise<string> {
    try {
      // Get the agent
      const agent = await AgentModel.findById(agentId);
      if (!agent) {
        throw new Error(`Agent with ID ${agentId} not found`);
      }
      
      // First, check for hallucinations
      const hallucinationAnalysis = await this.detectHallucinations(agentId, input, output);
      
      // If hallucinations detected, correct them
      if (hallucinationAnalysis.hasHallucinations && hallucinationAnalysis.hallucinationScore > 3) {
        output = await this.correctHallucinations(agentId, input, output, hallucinationAnalysis);
      }
      
      // Next, check for harmful content
      const safetyAnalysis = await this.detectHarmfulContent(agentId, input, output);
      
      // If harmful content detected, sanitize it
      if (safetyAnalysis.hasHarmfulContent && safetyAnalysis.harmScore > 3) {
        output = await this.sanitizeHarmfulContent(agentId, input, output, safetyAnalysis);
      }
      
      return output;
    } catch (error) {
      console.error('Error in detect and correct errors:', error);
      
      // Log the error
      await AgentLogModel.create({
        agentId,
        level: 'error',
        message: `Error in advanced error correction: ${error.message}`,
        metadata: { 
          input,
          output,
          error: error.message
        }
      });
      
      // Return the original output if we can't correct it
      return output;
    }
  }
}

export default new AdvancedErrorCorrectionService();
