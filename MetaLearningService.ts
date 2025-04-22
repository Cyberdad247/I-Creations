import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';
import AgentModel from '../models/AgentModel';
import AgentLogModel from '../models/AgentLogModel';
import AgentPerformanceMetricModel from '../models/AgentPerformanceMetricModel';
import KnowledgeBaseService from './KnowledgeBaseService';

class MetaLearningService {
  private model: OpenAI;
  
  constructor() {
    this.model = new OpenAI({ 
      modelName: 'gpt-4', 
      temperature: 0.2,
      openAIApiKey: process.env.OPENAI_API_KEY
    });
  }
  
  async analyzeSystemPerformance(): Promise<any> {
    try {
      // Get all agents
      const agents = await AgentModel.find({});
      
      // Get performance metrics for all agents
      const allMetrics = [];
      for (const agent of agents) {
        const metrics = await AgentPerformanceMetricModel.find({ agentId: agent.id })
          .sort({ timestamp: -1 })
          .limit(100);
          
        allMetrics.push({
          agentId: agent.id,
          agentName: agent.name,
          agentType: agent.type,
          metrics
        });
      }
      
      // Analyze global patterns
      const globalPatterns = this.analyzeGlobalPatterns(allMetrics);
      
      // Identify cross-agent learning opportunities
      const learningOpportunities = await this.identifyCrossAgentLearning(allMetrics);
      
      return {
        globalPatterns,
        learningOpportunities,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error analyzing system performance:', error);
      throw error;
    }
  }
  
  private analyzeGlobalPatterns(allMetricsData: any[]): any {
    // Calculate average metrics across all agents
    let totalErrorRate = 0;
    let totalResponseTime = 0;
    let totalMemoryUsage = 0;
    let totalMetricsCount = 0;
    
    // Group agents by type
    const agentsByType: Record<string, any[]> = {};
    
    for (const agentData of allMetricsData) {
      const { agentType, metrics } = agentData;
      
      if (!agentsByType[agentType]) {
        agentsByType[agentType] = [];
      }
      agentsByType[agentType].push(agentData);
      
      for (const metric of metrics) {
        totalErrorRate += metric.errorRate;
        totalResponseTime += metric.responseTime;
        totalMemoryUsage += metric.memoryUsage;
        totalMetricsCount++;
      }
    }
    
    // Calculate global averages
    const globalAverages = totalMetricsCount > 0 ? {
      errorRate: totalErrorRate / totalMetricsCount,
      responseTime: totalResponseTime / totalMetricsCount,
      memoryUsage: totalMemoryUsage / totalMetricsCount
    } : {
      errorRate: 0,
      responseTime: 0,
      memoryUsage: 0
    };
    
    // Calculate averages by agent type
    const averagesByType: Record<string, any> = {};
    
    for (const [type, agentsData] of Object.entries(agentsByType)) {
      let typeErrorRate = 0;
      let typeResponseTime = 0;
      let typeMemoryUsage = 0;
      let typeMetricsCount = 0;
      
      for (const agentData of agentsData) {
        for (const metric of agentData.metrics) {
          typeErrorRate += metric.errorRate;
          typeResponseTime += metric.responseTime;
          typeMemoryUsage += metric.memoryUsage;
          typeMetricsCount++;
        }
      }
      
      averagesByType[type] = typeMetricsCount > 0 ? {
        errorRate: typeErrorRate / typeMetricsCount,
        responseTime: typeResponseTime / typeMetricsCount,
        memoryUsage: typeMemoryUsage / typeMetricsCount,
        agentCount: agentsData.length
      } : {
        errorRate: 0,
        responseTime: 0,
        memoryUsage: 0,
        agentCount: agentsData.length
      };
    }
    
    // Identify best performing agent types
    const bestPerformingType = Object.entries(averagesByType)
      .sort(([, a], [, b]) => a.errorRate - b.errorRate)[0]?.[0] || null;
      
    // Identify worst performing agent types
    const worstPerformingType = Object.entries(averagesByType)
      .sort(([, a], [, b]) => b.errorRate - a.errorRate)[0]?.[0] || null;
    
    return {
      globalAverages,
      averagesByType,
      bestPerformingType,
      worstPerformingType
    };
  }
  
  private async identifyCrossAgentLearning(allMetricsData: any[]): Promise<any[]> {
    // Get successful agents (low error rate)
    const successfulAgents = allMetricsData
      .filter(agentData => {
        if (agentData.metrics.length === 0) return false;
        
        const avgErrorRate = agentData.metrics.reduce((sum: number, m: any) => sum + m.errorRate, 0) / agentData.metrics.length;
        return avgErrorRate < 3; // Less than 3% error rate
      })
      .map(agentData => ({
        agentId: agentData.agentId,
        agentName: agentData.agentName,
        agentType: agentData.agentType
      }));
      
    // Get struggling agents (high error rate)
    const strugglingAgents = allMetricsData
      .filter(agentData => {
        if (agentData.metrics.length === 0) return false;
        
        const avgErrorRate = agentData.metrics.reduce((sum: number, m: any) => sum + m.errorRate, 0) / agentData.metrics.length;
        return avgErrorRate > 8; // More than 8% error rate
      })
      .map(agentData => ({
        agentId: agentData.agentId,
        agentName: agentData.agentName,
        agentType: agentData.agentType
      }));
      
    // If we have both successful and struggling agents, identify learning opportunities
    if (successfulAgents.length > 0 && strugglingAgents.length > 0) {
      const learningOpportunities = [];
      
      for (const strugglingAgent of strugglingAgents) {
        // Find successful agents of the same type
        const successfulPeers = successfulAgents.filter(a => a.agentType === strugglingAgent.agentType);
        
        if (successfulPeers.length > 0) {
          // For each successful peer, extract knowledge that could help the struggling agent
          for (const successfulPeer of successfulPeers) {
            const knowledge = await this.extractTransferableKnowledge(successfulPeer.agentId, strugglingAgent.agentId);
            
            if (knowledge) {
              learningOpportunities.push({
                sourceAgentId: successfulPeer.agentId,
                sourceAgentName: successfulPeer.agentName,
                targetAgentId: strugglingAgent.agentId,
                targetAgentName: strugglingAgent.agentName,
                agentType: strugglingAgent.agentType,
                transferableKnowledge: knowledge
              });
            }
          }
        }
      }
      
      return learningOpportunities;
    }
    
    return [];
  }
  
  private async extractTransferableKnowledge(sourceAgentId: string, targetAgentId: string): Promise<any> {
    try {
      // Get configurations for both agents
      const sourceAgent = await AgentModel.findById(sourceAgentId);
      const targetAgent = await AgentModel.findById(targetAgentId);
      
      if (!sourceAgent || !targetAgent) {
        return null;
      }
      
      // Get successful interactions from source agent
      const successfulLogs = await AgentLogModel.find({
        agentId: sourceAgentId,
        level: 'info',
        // Only get logs that indicate successful responses
        message: { $regex: /successfully processed/i }
      })
      .sort({ timestamp: -1 })
      .limit(20);
      
      if (successfulLogs.length === 0) {
        return null;
      }
      
      // Extract key differences in configuration
      const configDifferences = this.compareAgentConfigurations(sourceAgent, targetAgent);
      
      // Use LLM to analyze what makes the successful agent effective
      const template = `You are an AI meta-learning system analyzing what makes one AI agent more successful than another.

Source Agent: ${sourceAgent.name} (Type: ${sourceAgent.type})
- Configuration: ${JSON.stringify(sourceAgent.properties)}
- Error Rate: ${sourceAgent.errorRate}%

Target Agent: ${targetAgent.name} (Type: ${targetAgent.type})
- Configuration: ${JSON.stringify(targetAgent.properties)}
- Error Rate: ${targetAgent.errorRate}%

Key Configuration Differences:
${configDifferences.map(diff => `- ${diff.property}: Source=${diff.sourceValue}, Target=${diff.targetValue}`).join('\n')}

Examples of successful interactions from the source agent:
${successfulLogs.map(log => `- ${log.message}`).join('\n')}

Based on this information, identify:
1. What specific configuration parameters from the source agent should be transferred to the target agent?
2. What patterns or strategies make the source agent successful that could be applied to the target agent?
3. Provide specific, actionable recommendations for improving the target agent.

Format your response as a JSON object with the following structure:
{
  "configTransfers": [
    {"property": "property_name", "value": "recommended_value", "reason": "explanation"}
  ],
  "strategies": [
    {"name": "strategy_name", "description": "strategy_description", "implementation": "how_to_implement"}
  ],
  "recommendations": [
    {"description": "recommendation", "priority": "high/medium/low"}
  ]
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
      
      // Parse the JSON response
      try {
        const knowledge = JSON.parse(result.text);
        return knowledge;
      } catch (error) {
        console.error('Error parsing LLM response as JSON:', error);
        return null;
      }
    } catch (error) {
      console.error('Error extracting transferable knowledge:', error);
      return null;
    }
  }
  
  private compareAgentConfigurations(sourceAgent: any, targetAgent: any): any[] {
    const differences = [];
    
    // Compare properties
    const sourceProps = sourceAgent.properties || [];
    const targetProps = targetAgent.properties || [];
    
    // Create maps for easier comparison
    const sourcePropMap = new Map(sourceProps.map((p: any) => [p.id, p.value]));
    const targetPropMap = new Map(targetProps.map((p: any) => [p.id, p.value]));
    
    // Check all source properties
    for (const [propId, sourceValue] of sourcePropMap.entries()) {
      if (targetPropMap.has(propId)) {
        const targetValue = targetPropMap.get(propId);
        
        // If values are different, record the difference
        if (sourceValue !== targetValue) {
          differences.push({
            property: propId,
            sourceValue,
            targetValue
          });
        }
      } else {
        // Property exists in source but not in target
        differences.push({
          property: propId,
          sourceValue,
          targetValue: 'undefined'
        });
      }
    }
    
    // Check for properties in target that aren't in source
    for (const [propId, targetValue] of targetPropMap.entries()) {
      if (!sourcePropMap.has(propId)) {
        differences.push({
          property: propId,
          sourceValue: 'undefined',
          targetValue
        });
      }
    }
    
    return differences;
  }
  
  async applyMetaLearning(learningOpportunity: any): Promise<boolean> {
    try {
      const { targetAgentId, transferableKnowledge } = learningOpportunity;
      
      // Get the target agent
      const targetAgent = await AgentModel.findById(targetAgentId);
      if (!targetAgent) {
        throw new Error(`Target agent with ID ${targetAgentId} not found`);
      }
      
      // Apply configuration transfers
      let modified = false;
      
      if (transferableKnowledge.configTransfers && transferableKnowledge.configTransfers.length > 0) {
        for (const transfer of transferableKnowledge.configTransfers) {
          const propertyIndex = targetAgent.properties.findIndex((p: any) => p.id === transfer.property);
          
          if (propertyIndex >= 0) {
            // Update existing property
            targetAgent.properties[propertyIndex].value = transfer.value;
            modified = true;
          } else {
            // Add new property if it doesn't exist
            targetAgent.properties.push({
              id: transfer.property,
              name: transfer.property, // Use property ID as name
              type: typeof transfer.value === 'boolean' ? 'boolean' : 
                    typeof transfer.value === 'number' ? 'number' : 'text',
              value: transfer.value
            });
            modified = true;
          }
        }
      }
      
      // Store strategies in the knowledge base
      if (transferableKnowledge.strategies && transferableKnowledge.strategies.length > 0) {
        for (const strategy of transferableKnowledge.strategies) {
          await KnowledgeBaseService.storeAgentMemory(
            targetAgentId,
            `strategy:${strategy.name}`,
            strategy
          );
          modified = true;
        }
      }
      
      // Save the modified agent
      if (modified) {
        await targetAgent.save();
        
        // Log the meta-learning application
        await AgentLogModel.create({
          agentId: targetAgentId,
          level: 'info',
          message: `Applied meta-learning from cross-agent knowledge transfer`,
          metadata: { 
            sourceAgentId: learningOpportunity.sourceAgentId,
            sourceAgentName: learningOpportunity.sourceAgentName,
            appliedTransfers: transferableKnowledge.configTransfers,
            appliedStrategies: transferableKnowledge.strategies.map((s: any) => s.name)
          }
        });
      }
      
      return modified;
    } catch (error) {
      console.error('Error applying meta-learning:', error);
      return false;
    }
  }
  
  async improveSystemPrompts(): Promise<any> {
    try {
      // Get all agents
      const agents = await AgentModel.find({});
      
      const results = [];
      
      for (const agent of agents) {
        // Skip agents with low error rates
        if (agent.errorRate < 3) continue;
        
        // Get recent logs for this agent
        const recentLogs = await AgentLogModel.find({ agentId: agent.id })
          .sort({ timestamp: -1 })
          .limit(50);
          
        if (recentLogs.length < 10) continue; // Need enough data
        
        // Extract successful and failed interactions
        const successfulInteractions = recentLogs.filter(log => 
          log.level === 'info' && log.message.includes('successfully processed')
        );
        
        const failedInteractions = recentLogs.filter(log => 
          log.level === 'error'
        );
        
        if (successfulInteractions.length < 3 || failedInteractions.length < 3) continue;
        
        // Use LLM to generate improved prompts
        const template = `You are an AI prompt engineering expert. Your task is to analyze successful and failed interactions for an AI agent and suggest improvements to its prompting strategy.

Agent Type: ${agent.type}
Current Configuration: ${JSON.stringify(agent.properties)}

Examples of SUCCESSFUL interactions:
${successfulInteractions.slice(0, 5).map((log, i) => `${i+1}. ${log.message}`).join('\n')}

Examples of FAILED interactions:
${failedInteractions.slice(0, 5).map((log, i) => `${i+1}. ${log.message}`).join('\n')}

Based on this information:
1. Identify patterns in successful vs. failed interactions
2. Suggest specific improvements to the agent's prompting strategy
3. Provide a new, improved prompt template that would help the agent be more successful

Format your response as a JSON object with the following structure:
{
  "analysis": "Your analysis of patterns in successful vs. failed interactions",
  "improvements": [
    {"description": "Specific improvement 
(Content truncated due to size limit. Use line ranges to read in chunks)