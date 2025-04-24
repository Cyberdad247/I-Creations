declare module 'models/AgentModel' {
  import { Model } from 'mongoose';
  interface IAgent {
    id: string;
    name: string;
    refreshToken: string;
    refreshTokenExpires: Date;
    lastLogin: Date;
  }
  interface AgentModel extends Model<IAgent> {
    findById(id: string): Promise<IAgent | null>;
  }
  const AgentModel: AgentModel;
  export default AgentModel;
}

declare module 'models/AgentLogModel' {
  import { Model } from 'mongoose';
  interface IAgentLog {
    agentId: string;
    level: string;
    message: string;
    metadata: object;
    createdAt: Date;
  }
  interface AgentLogModel extends Model<IAgentLog> {
    create(logData: any): Promise<IAgentLog>;
  }
  const AgentLogModel: AgentLogModel;
  export default AgentLogModel;
}
