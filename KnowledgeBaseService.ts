import { createClient } from 'redis';

class KnowledgeBaseService {
  private client;
  private isConnected: boolean = false;
  
  constructor() {
    this.initializeRedisClient();
  }
  
  private async initializeRedisClient() {
    try {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });
      
      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });
      
      this.client.on('connect', () => {
        console.log('Connected to Redis');
        this.isConnected = true;
      });
      
      await this.client.connect();
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
    }
  }
  
  async storeAgentConfiguration(agentId: string, configuration: any): Promise<boolean> {
    try {
      if (!this.isConnected) await this.initializeRedisClient();
      
      const key = `agent:${agentId}:config`;
      await this.client.set(key, JSON.stringify(configuration));
      return true;
    } catch (error) {
      console.error('Error storing agent configuration:', error);
      return false;
    }
  }
  
  async getAgentConfiguration(agentId: string): Promise<any> {
    try {
      if (!this.isConnected) await this.initializeRedisClient();
      
      const key = `agent:${agentId}:config`;
      const configStr = await this.client.get(key);
      
      if (!configStr) return null;
      return JSON.parse(configStr);
    } catch (error) {
      console.error('Error retrieving agent configuration:', error);
      return null;
    }
  }
  
  async storeAgentMemory(agentId: string, key: string, value: any): Promise<boolean> {
    try {
      if (!this.isConnected) await this.initializeRedisClient();
      
      const memoryKey = `agent:${agentId}:memory:${key}`;
      await this.client.set(memoryKey, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error storing agent memory:', error);
      return false;
    }
  }
  
  async getAgentMemory(agentId: string, key: string): Promise<any> {
    try {
      if (!this.isConnected) await this.initializeRedisClient();
      
      const memoryKey = `agent:${agentId}:memory:${key}`;
      const memoryStr = await this.client.get(memoryKey);
      
      if (!memoryStr) return null;
      return JSON.parse(memoryStr);
    } catch (error) {
      console.error('Error retrieving agent memory:', error);
      return null;
    }
  }
  
  async storeAgentTemplate(templateId: string, template: any): Promise<boolean> {
    try {
      if (!this.isConnected) await this.initializeRedisClient();
      
      const key = `template:${templateId}`;
      await this.client.set(key, JSON.stringify(template));
      return true;
    } catch (error) {
      console.error('Error storing agent template:', error);
      return false;
    }
  }
  
  async getAgentTemplate(templateId: string): Promise<any> {
    try {
      if (!this.isConnected) await this.initializeRedisClient();
      
      const key = `template:${templateId}`;
      const templateStr = await this.client.get(key);
      
      if (!templateStr) return null;
      return JSON.parse(templateStr);
    } catch (error) {
      console.error('Error retrieving agent template:', error);
      return null;
    }
  }
  
  async getAllAgentTemplates(): Promise<any[]> {
    try {
      if (!this.isConnected) await this.initializeRedisClient();
      
      const keys = await this.client.keys('template:*');
      if (!keys || keys.length === 0) return [];
      
      const templates = [];
      for (const key of keys) {
        const templateStr = await this.client.get(key);
        if (templateStr) {
          templates.push(JSON.parse(templateStr));
        }
      }
      
      return templates;
    } catch (error) {
      console.error('Error retrieving all agent templates:', error);
      return [];
    }
  }
  
  async clearAgentMemory(agentId: string): Promise<boolean> {
    try {
      if (!this.isConnected) await this.initializeRedisClient();
      
      const keys = await this.client.keys(`agent:${agentId}:memory:*`);
      if (keys && keys.length > 0) {
        await this.client.del(keys);
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing agent memory:', error);
      return false;
    }
  }
}

export default new KnowledgeBaseService();
