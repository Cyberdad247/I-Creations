import FailsafeSettingsModel from '../models/FailsafeSettingsModel';
import AgentModel from '../models/AgentModel';
import AgentLogModel from '../models/AgentLogModel';
import UserModel from '../models/UserModel';

class FailsafeControllerService {
  // Default settings if none are found in the database
  private readonly DEFAULT_SETTINGS = {
    requireApproval: true,
    notifyOnReset: true,
    autoLockThreshold: 3
  };
  
  async getFailsafeSettings(): Promise<any> {
    try {
      // Get settings from database or use defaults
      let settings = await FailsafeSettingsModel.findOne();
      
      if (!settings) {
        // Create default settings if none exist
        settings = await FailsafeSettingsModel.create(this.DEFAULT_SETTINGS);
      }
      
      return settings;
    } catch (error) {
      console.error('Error getting failsafe settings:', error);
      return this.DEFAULT_SETTINGS;
    }
  }
  
  async updateFailsafeSettings(newSettings: any): Promise<boolean> {
    try {
      let settings = await FailsafeSettingsModel.findOne();
      
      if (!settings) {
        // Create settings if they don't exist
        await FailsafeSettingsModel.create({
          ...this.DEFAULT_SETTINGS,
          ...newSettings
        });
      } else {
        // Update existing settings
        settings.requireApproval = newSettings.requireApproval ?? settings.requireApproval;
        settings.notifyOnReset = newSettings.notifyOnReset ?? settings.notifyOnReset;
        settings.autoLockThreshold = newSettings.autoLockThreshold ?? settings.autoLockThreshold;
        await settings.save();
      }
      
      return true;
    } catch (error) {
      console.error('Error updating failsafe settings:', error);
      return false;
    }
  }
  
  async resetAgent(agentId: string, userId: string): Promise<boolean> {
    try {
      // Get the agent
      const agent = await AgentModel.findById(agentId);
      if (!agent) {
        throw new Error(`Agent with ID ${agentId} not found`);
      }
      
      // Get the user
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      // Check if user has permission to reset the agent
      if (user.role !== 'admin' && user.role !== 'developer') {
        throw new Error('Insufficient permissions to reset agent');
      }
      
      // Reset the agent
      agent.status = 'offline';
      agent.errorRate = 0;
      agent.requestsPerHour = 0;
      agent.averageResponseTime = 0;
      agent.memoryUsage = 0;
      await agent.save();
      
      // Log the reset
      await AgentLogModel.create({
        agentId,
        level: 'warning',
        message: `Agent reset by user ${user.name} (${user.email})`,
        metadata: { 
          userId,
          userRole: user.role,
          timestamp: new Date()
        }
      });
      
      // Check if we need to notify admins
      const settings = await this.getFailsafeSettings();
      if (settings.notifyOnReset) {
        await this.notifyAdmins(
          `Agent Reset Alert: ${agent.name}`,
          `Agent "${agent.name}" (ID: ${agentId}) was reset by ${user.name} (${user.email}) at ${new Date().toISOString()}`
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error resetting agent:', error);
      return false;
    }
  }
  
  async emergencyShutdown(userId: string): Promise<boolean> {
    try {
      // Get the user
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      // Check if user has permission to perform emergency shutdown
      if (user.role !== 'admin') {
        throw new Error('Only administrators can perform emergency shutdown');
      }
      
      // Set all agents to offline status
      await AgentModel.updateMany({}, { status: 'offline' });
      
      // Log the emergency shutdown
      const shutdownLog = {
        level: 'error',
        message: `EMERGENCY SHUTDOWN initiated by user ${user.name} (${user.email})`,
        metadata: { 
          userId,
          userRole: user.role,
          timestamp: new Date()
        }
      };
      
      // Create a log entry for each agent
      const agents = await AgentModel.find({});
      for (const agent of agents) {
        await AgentLogModel.create({
          ...shutdownLog,
          agentId: agent.id
        });
      }
      
      // Notify all admins
      await this.notifyAdmins(
        'EMERGENCY SHUTDOWN ALERT',
        `Emergency shutdown of all agents was initiated by ${user.name} (${user.email}) at ${new Date().toISOString()}`
      );
      
      return true;
    } catch (error) {
      console.error('Error performing emergency shutdown:', error);
      return false;
    }
  }
  
  async checkAgentSafety(agentId: string): Promise<any> {
    try {
      // Get the agent
      const agent = await AgentModel.findById(agentId);
      if (!agent) {
        throw new Error(`Agent with ID ${agentId} not found`);
      }
      
      // Get failsafe settings
      const settings = await this.getFailsafeSettings();
      
      // Get recent error logs
      const recentErrorLogs = await AgentLogModel.find({ 
        agentId, 
        level: 'error',
        timestamp: { $gte: new Date(Date.now() - 1 * 60 * 60 * 1000) } // Last hour
      })
      .sort({ timestamp: -1 });
      
      // Count consecutive errors
      let consecutiveErrors = 0;
      for (const log of recentErrorLogs) {
        if (log.level === 'error') {
          consecutiveErrors++;
        } else {
          break; // Stop counting when we hit a non-error log
        }
      }
      
      // Check if agent should be locked
      const shouldLock = consecutiveErrors >= settings.autoLockThreshold;
      
      // If agent should be locked and is not already offline or error
      if (shouldLock && agent.status === 'online') {
        agent.status = 'error';
        await agent.save();
        
        // Log the automatic lock
        await AgentLogModel.create({
          agentId,
          level: 'warning',
          message: `Agent automatically locked due to ${consecutiveErrors} consecutive errors`,
          metadata: { 
            consecutiveErrors,
            autoLockThreshold: settings.autoLockThreshold,
            timestamp: new Date()
          }
        });
        
        // Notify admins if needed
        if (settings.notifyOnReset) {
          await this.notifyAdmins(
            `Agent Auto-Lock Alert: ${agent.name}`,
            `Agent "${agent.name}" (ID: ${agentId}) was automatically locked due to ${consecutiveErrors} consecutive errors at ${new Date().toISOString()}`
          );
        }
      }
      
      return {
        agentId,
        status: agent.status,
        errorRate: agent.errorRate,
        consecutiveErrors,
        autoLockThreshold: settings.autoLockThreshold,
        isLocked: agent.status === 'error',
        requiresAttention: agent.errorRate > 10 || consecutiveErrors > 0
      };
    } catch (error) {
      console.error('Error checking agent safety:', error);
      throw error;
    }
  }
  
  private async notifyAdmins(subject: string, message: string): Promise<void> {
    try {
      // Get all admin users
      const admins = await UserModel.find({ role: 'admin', status: 'active' });
      
      // In a real implementation, this would send emails or notifications
      // For now, we'll just log the notification
      console.log(`ADMIN NOTIFICATION: ${subject}`);
      console.log(`Message: ${message}`);
      console.log(`Recipients: ${admins.map(admin => admin.email).join(', ')}`);
      
      // In a real implementation, you would use a notification service here
      // For example:
      // await notificationService.sendEmail({
      //   to: admins.map(admin => admin.email),
      //   subject,
      //   body: message
      // });
    } catch (error) {
      console.error('Error notifying admins:', error);
    }
  }
}

export default new FailsafeControllerService();
