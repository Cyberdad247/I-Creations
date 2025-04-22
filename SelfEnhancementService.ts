import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';
import AgentModel from '../models/AgentModel';
import AgentLogModel from '../models/AgentLogModel';
import KnowledgeBaseService from './KnowledgeBaseService';

class SelfEnhancementService {
  private model: OpenAI;
  
  constructor() {
    this.model = new OpenAI({ 
      modelName: 'gpt-4', 
      temperature: 0.3,
      openAIApiKey: process.env.OPENAI_API_KEY
    });
  }
  
  async enhanceAgentPrompt(agentId: string): Promise<any> {
    try {
      // Get the agent
      const agent = await AgentModel.findById(agentId);
      if (!agent) {
        throw new Error(`Agent with ID ${agentId} not found`);
      }
      
      // Get recent logs for this agent
      const recentLogs = await AgentLogModel.find({ agentId })
        .sort({ timestamp: -1 })
        .limit(100);
        
      if (recentLogs.length < 10) {
        return {
          success: false,
          message: 'Not enough interaction data to enhance prompt'
        };
      }
      
      // Extract successful and failed interactions
      const successfulInteractions = recentLogs.filter(log => 
        log.level === 'info' && 
        (log.message.includes('successfully processed') || log.message.includes('Successfully corrected'))
      );
      
      const failedInteractions = recentLogs.filter(log => 
        log.level === 'error' || 
        (log.level === 'warning' && log.message.includes('error'))
      );
      
      // Get current prompt template
      const currentPromptTemplate = this.getPromptTemplate(agent.type);
      
      // Use LLM to generate improved prompt
      const template = `You are an AI prompt engineering expert. Your task is to analyze successful and failed interactions for an AI agent and create an improved prompt template.

Agent Type: ${agent.type}
Agent Name: ${agent.name}
Current Configuration: ${JSON.stringify(agent.properties)}

Current Prompt Template:
${currentPromptTemplate}

Examples of SUCCESSFUL interactions (${successfulInteractions.length}):
${successfulInteractions.slice(0, 5).map((log, i) => {
  const metadata = log.metadata || {};
  return `${i+1}. Input: ${metadata.input || 'Unknown'}
   Output: ${metadata.output || 'Unknown'}`;
}).join('\n\n')}

Examples of FAILED interactions (${failedInteractions.length}):
${failedInteractions.slice(0, 5).map((log, i) => {
  const metadata = log.metadata || {};
  return `${i+1}. Input: ${metadata.input || 'Unknown'}
   Error: ${log.message}`;
}).join('\n\n')}

Based on this information, create an improved prompt template that will:
1. Reduce errors and improve response quality
2. Maintain the agent's core functionality and purpose
3. Incorporate patterns from successful interactions
4. Address common failure patterns

The improved prompt template should be a complete replacement for the current template, ready to use with the LangChain PromptTemplate system.

Your response should be formatted as a JSON object with the following structure:
{
  "analysis": "Your analysis of the current prompt and interaction patterns",
  "improvements": [
    {"description": "Specific improvement made", "reason": "Why this improvement helps"}
  ],
  "improvedPromptTemplate": "Your complete improved prompt template"
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
        const enhancementResult = JSON.parse(result.text);
        
        // Store the improved prompt in the knowledge base
        await KnowledgeBaseService.storeAgentMemory(
          agentId,
          'enhanced_prompt_template',
          enhancementResult
        );
        
        // Log the enhancement
        await AgentLogModel.create({
          agentId,
          level: 'info',
          message: `Enhanced agent prompt template through self-improvement`,
          metadata: { enhancementResult }
        });
        
        return {
          success: true,
          enhancementResult
        };
      } catch (error) {
        console.error('Error parsing LLM response as JSON:', error);
        return {
          success: false,
          message: 'Error generating enhanced prompt'
        };
      }
    } catch (error) {
      console.error('Error enhancing agent prompt:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
  
  private getPromptTemplate(agentType: string): string {
    // Return default prompt templates based on agent type
    switch (agentType) {
      case 'assistant':
        return `You are {agentName}, a helpful AI assistant.
          
Please respond to the following request:
{input}`;
        
      case 'researcher':
        return `You are {agentName}, an AI research assistant specialized in gathering and analyzing information.
          
Please research the following topic and provide a comprehensive analysis:
{input}`;
        
      case 'coder':
        return `You are {agentName}, an AI coding assistant specialized in writing, reviewing, and explaining code.
          
Please respond to the following coding request:
{input}`;
        
      default:
        return `You are {agentName}, an AI assistant.
          
Please respond to the following:
{input}`;
    }
  }
  
  async analyzeUserInteractions(agentId: string): Promise<any> {
    try {
      // Get the agent
      const agent = await AgentModel.findById(agentId);
      if (!agent) {
        throw new Error(`Agent with ID ${agentId} not found`);
      }
      
      // Get recent logs for this agent
      const recentLogs = await AgentLogModel.find({ agentId })
        .sort({ timestamp: -1 })
        .limit(200);
        
      if (recentLogs.length < 20) {
        return {
          success: false,
          message: 'Not enough interaction data for analysis'
        };
      }
      
      // Extract user inputs from logs
      const userInputs = recentLogs
        .filter(log => log.metadata && log.metadata.input)
        .map(log => log.metadata.input);
        
      if (userInputs.length < 10) {
        return {
          success: false,
          message: 'Not enough user inputs for analysis'
        };
      }
      
      // Use LLM to analyze user interaction patterns
      const template = `You are an AI interaction analyst. Your task is to analyze user interactions with an AI agent and identify patterns and improvement opportunities.

Agent Type: ${agent.type}
Agent Name: ${agent.name}

Recent User Inputs (${userInputs.length} total):
${userInputs.slice(0, 20).map((input, i) => `${i+1}. ${input}`).join('\n')}

Based on these interactions, please:
1. Identify common themes and patterns in user requests
2. Determine the most frequent types of queries
3. Identify potential knowledge gaps or areas where the agent could be improved
4. Suggest specific enhancements to better serve user needs

Format your response as a JSON object with the following structure:
{
  "commonThemes": [
    {"theme": "theme_name", "frequency": "approximate_percentage", "examples": ["example1", "example2"]}
  ],
  "queryTypes": [
    {"type": "query_type", "frequency": "approximate_percentage", "examples": ["example1", "example2"]}
  ],
  "knowledgeGaps": [
    {"gap": "description_of_gap", "impact": "high/medium/low", "improvement": "suggested_improvement"}
  ],
  "enhancementSuggestions": [
    {"suggestion": "enhancement_suggestion", "benefit": "expected_benefit", "implementation": "implementation_approach"}
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
      
      try {
        const analysisResult = JSON.parse(result.text);
        
        // Store the analysis in the knowledge base
        await KnowledgeBaseService.storeAgentMemory(
          agentId,
          'user_interaction_analysis',
          analysisResult
        );
        
        // Log the analysis
        await AgentLogModel.create({
          agentId,
          level: 'info',
          message: `Analyzed user interaction patterns through self-improvement`,
          metadata: { analysisResult }
        });
        
        return {
          success: true,
          analysisResult
        };
      } catch (error) {
        console.error('Error parsing LLM response as JSON:', error);
        return {
          success: false,
          message: 'Error analyzing user interactions'
        };
      }
    } catch (error) {
      console.error('Error analyzing user interactions:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
  
  async generateKnowledgeExpansion(agentId: string): Promise<any> {
    try {
      // Get the agent
      const agent = await AgentModel.findById(agentId);
      if (!agent) {
        throw new Error(`Agent with ID ${agentId} not found`);
      }
      
      // Get user interaction analysis if available
      const interactionAnalysis = await KnowledgeBaseService.getAgentMemory(
        agentId,
        'user_interaction_analysis'
      );
      
      if (!interactionAnalysis) {
        return {
          success: false,
          message: 'No user interaction analysis available'
        };
      }
      
      // Use LLM to generate knowledge expansion
      const template = `You are an AI knowledge expansion specialist. Your task is to identify areas where an AI agent's knowledge should be expanded based on user interaction patterns.

Agent Type: ${agent.type}
Agent Name: ${agent.name}

User Interaction Analysis:
${JSON.stringify(interactionAnalysis, null, 2)}

Based on this analysis, please:
1. Identify the top 3-5 knowledge areas that should be expanded
2. For each area, provide specific knowledge that would enhance the agent's capabilities
3. Prioritize areas that would have the highest impact on user satisfaction

Format your response as a JSON object with the following structure:
{
  "knowledgeAreas": [
    {
      "area": "knowledge_area_name",
      "priority": "high/medium/low",
      "currentGap": "description_of_current_knowledge_gap",
      "expansionContent": "detailed_knowledge_to_add",
      "sources": ["suggested_source1", "suggested_source2"]
    }
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
      
      try {
        const expansionResult = JSON.parse(result.text);
        
        // Store the knowledge expansion in the knowledge base
        await KnowledgeBaseService.storeAgentMemory(
          agentId,
          'knowledge_expansion',
          expansionResult
        );
        
        // Log the expansion
        await AgentLogModel.create({
          agentId,
          level: 'info',
          message: `Generated knowledge expansion through self-improvement`,
          metadata: { expansionResult }
        });
        
        return {
          success: true,
          expansionResult
        };
      } catch (error) {
        console.error('Error parsing LLM response as JSON:', error);
        return {
          success: false,
          message: 'Error generating knowledge expansion'
        };
      }
    } catch (error) {
      console.error('Error generating knowledge expansion:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
  
  async runSelfImprovementCycle(agentId: string): Promise<any> {
    try {
      // Step 1: Analyze user interactions
      const interactionAnalysis = await this.analyzeUserInteractions(agentId);
      
      // Step 2: Generate knowledge expansion
      const knowledgeExpansion = await this.generateKnowledgeExpansion(agentId);
      
      // Step 3: Enhance agent prompt
      const promptEnhancement = await this.enhanceAgentPrompt(agentId);
      
      // Log the self-improvement cycle
      await AgentLogModel.create({
        agentId,
        level: 'info',
        message: `Completed self-improvement cycle`,
        metadata: { 
          interactionAnalysisSuccess: interactionAnalysis.success,
          knowledgeExpansionSuccess: knowledgeExpansion.success,
          promptEnhancementSuccess: promptEnhancement.success
        }
      });
      
      return {
        success: true,
        interactionAnalysis: interactionAnalysis.success ? interactionAnalysis.analysisResult : null,
        knowledgeExpansion: knowledgeExpansion.success ? knowledgeExpansion.expansionResult : null,
        promptEnhancement: promptEnhancement.success ? promptEnhancement.enhancementResult : null
      };
    } catch (error) {
      console.error('Error running self-improvement cycle:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default new SelfEnhancementService();
