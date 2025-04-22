import AgentModel from '../models/AgentModel';
import AgentPerformanceMetricModel from '../models/AgentPerformanceMetricModel';
import AgentLogModel from '../models/AgentLogModel';

class LearningEngineService {
  // Performance thresholds for optimization
  private readonly ERROR_RATE_THRESHOLD = 5; // 5%
  private readonly RESPONSE_TIME_THRESHOLD = 3; // 3 seconds
  
  async analyzeAgentPerformance(agentId: string): Promise<any> {
    try {
      // Get the agent
      const agent = await AgentModel.findById(agentId);
      if (!agent) {
        throw new Error(`Agent with ID ${agentId} not found`);
      }
      
      // Get recent performance metrics
      const recentMetrics = await AgentPerformanceMetricModel.find({ agentId })
        .sort({ timestamp: -1 })
        .limit(100);
        
      if (recentMetrics.length === 0) {
        return {
          needsOptimization: false,
          message: 'Not enough performance data to analyze'
        };
      }
      
      // Calculate average metrics
      const avgErrorRate = recentMetrics.reduce((sum, metric) => sum + metric.errorRate, 0) / recentMetrics.length;
      const avgResponseTime = recentMetrics.reduce((sum, metric) => sum + metric.responseTime, 0) / recentMetrics.length;
      
      // Determine if optimization is needed
      const needsOptimization = avgErrorRate > this.ERROR_RATE_THRESHOLD || 
                               avgResponseTime > this.RESPONSE_TIME_THRESHOLD;
      
      // Get recent error logs for pattern analysis
      const errorLogs = await AgentLogModel.find({ 
        agentId, 
        level: 'error',
        timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
      });
      
      // Analyze error patterns
      const errorPatterns = this.analyzeErrorPatterns(errorLogs);
      
      return {
        needsOptimization,
        metrics: {
          avgErrorRate,
          avgResponseTime,
          totalRequests: recentMetrics.reduce((sum, metric) => sum + metric.requestsPerHour, 0),
          avgMemoryUsage: recentMetrics.reduce((sum, metric) => sum + metric.memoryUsage, 0) / recentMetrics.length
        },
        errorPatterns,
        optimizationSuggestions: needsOptimization ? this.generateOptimizationSuggestions(agent, avgErrorRate, avgResponseTime, errorPatterns) : []
      };
    } catch (error) {
      console.error('Error analyzing agent performance:', error);
      throw error;
    }
  }
  
  private analyzeErrorPatterns(errorLogs: any[]): any[] {
    if (errorLogs.length === 0) return [];
    
    // Group errors by message pattern
    const patternGroups: Record<string, any[]> = {};
    
    errorLogs.forEach(log => {
      // Simplify error message to identify patterns
      const simplifiedMessage = this.simplifyErrorMessage(log.message);
      
      if (!patternGroups[simplifiedMessage]) {
        patternGroups[simplifiedMessage] = [];
      }
      
      patternGroups[simplifiedMessage].push(log);
    });
    
    // Convert to array and sort by frequency
    return Object.entries(patternGroups)
      .map(([pattern, logs]) => ({
        pattern,
        count: logs.length,
        frequency: (logs.length / errorLogs.length) * 100,
        examples: logs.slice(0, 3).map(log => log.message) // Include a few examples
      }))
      .sort((a, b) => b.count - a.count);
  }
  
  private simplifyErrorMessage(message: string): string {
    // Remove specific details to identify patterns
    return message
      .replace(/[0-9]+/g, 'NUM') // Replace numbers
      .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, 'STRING') // Replace strings
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, 'EMAIL') // Replace emails
      .substring(0, 100); // Limit length
  }
  
  private generateOptimizationSuggestions(agent: any, errorRate: number, responseTime: number, errorPatterns: any[]): any[] {
    const suggestions = [];
    
    // Suggest optimizations based on error rate
    if (errorRate > this.ERROR_RATE_THRESHOLD) {
      suggestions.push({
        type: 'error_rate',
        description: `High error rate (${errorRate.toFixed(2)}%). Consider adjusting agent parameters.`,
        actions: [
          {
            parameter: 'temperature',
            currentValue: this.findPropertyValue(agent, 'temperature'),
            suggestedValue: Math.max(0.1, (this.findPropertyValue(agent, 'temperature') || 0.7) - 0.2),
            reason: 'Reducing temperature can lead to more conservative and reliable responses'
          }
        ]
      });
    }
    
    // Suggest optimizations based on response time
    if (responseTime > this.RESPONSE_TIME_THRESHOLD) {
      suggestions.push({
        type: 'response_time',
        description: `Slow response time (${responseTime.toFixed(2)}s). Consider optimizing for speed.`,
        actions: [
          {
            parameter: 'model',
            currentValue: this.findPropertyValue(agent, 'model'),
            suggestedValue: this.findPropertyValue(agent, 'model') === 'gpt-4' ? 'gpt-3.5-turbo' : this.findPropertyValue(agent, 'model'),
            reason: 'Using a smaller model can significantly improve response times'
          }
        ]
      });
    }
    
    // Suggest optimizations based on error patterns
    if (errorPatterns.length > 0) {
      const topPattern = errorPatterns[0];
      
      if (topPattern.frequency > 20) { // If a single pattern accounts for >20% of errors
        suggestions.push({
          type: 'error_pattern',
          description: `Common error pattern detected: "${topPattern.pattern}" (${topPattern.frequency.toFixed(2)}% of errors)`,
          actions: [
            {
              parameter: 'custom_handling',
              suggestion: `Add custom error handling for pattern: ${topPattern.pattern}`,
              examples: topPattern.examples
            }
          ]
        });
      }
    }
    
    return suggestions;
  }
  
  private findPropertyValue(agent: any, propertyId: string): any {
    const property = agent.properties.find((p: any) => p.id === propertyId);
    return property ? property.value : null;
  }
  
  async applyOptimizations(agentId: string, optimizations: any[]): Promise<boolean> {
    try {
      const agent = await AgentModel.findById(agentId);
      if (!agent) {
        throw new Error(`Agent with ID ${agentId} not found`);
      }
      
      // Apply each optimization to the agent properties
      let modified = false;
      
      optimizations.forEach(opt => {
        if (opt.parameter && opt.suggestedValue) {
          const propertyIndex = agent.properties.findIndex((p: any) => p.id === opt.parameter);
          
          if (propertyIndex >= 0) {
            agent.properties[propertyIndex].value = opt.suggestedValue;
            modified = true;
          }
        }
      });
      
      if (modified) {
        await agent.save();
        
        // Log the optimization
        await AgentLogModel.create({
          agentId,
          level: 'info',
          message: `Applied automatic optimizations: ${optimizations.map((opt: any) => opt.parameter).join(', ')}`,
          metadata: { optimizations }
        });
      }
      
      return modified;
    } catch (error) {
      console.error('Error applying optimizations:', error);
      return false;
    }
  }
  
  async extractKnowledge(agentId: string): Promise<any[]> {
    try {
      // This would analyze successful interactions to extract reusable knowledge
      // For now, we'll return a placeholder implementation
      return [
        {
          pattern: 'greeting_response',
          description: 'Standard greeting pattern',
          examples: ['Hello, how can I help you?', 'Hi there! What can I assist you with today?']
        },
        {
          pattern: 'clarification_request',
          description: 'Asking for clarification when input is ambiguous',
          examples: ['Could you please provide more details?', 'I'm not sure I understand. Can you elaborate?']
        }
      ];
    } catch (error) {
      console.error('Error extracting knowledge:', error);
      return [];
    }
  }
}

export default new LearningEngineService();
