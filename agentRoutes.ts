import express from 'express';
import AgentModel from '../models/AgentModel';
import AgentLogModel from '../models/AgentLogModel';
import AgentOrchestrationService from '../services/AgentOrchestrationService';
import ErrorCorrectionService from '../services/ErrorCorrectionService';
import AdvancedErrorCorrectionService from '../services/AdvancedErrorCorrectionService';
import LearningEngineService from '../services/LearningEngineService';
import FailsafeControllerService from '../services/FailsafeControllerService';

const router = express.Router();

// Get all agents
router.get('/', async (req, res) => {
  try {
    const agents = await AgentModel.find();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent by ID
router.get('/:id', async (req, res) => {
  try {
    const agent = await AgentModel.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new agent
router.post('/', async (req, res) => {
  try {
    const agent = new AgentModel(req.body);
    await agent.save();
    res.status(201).json(agent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update agent
router.put('/:id', async (req, res) => {
  try {
    const agent = await AgentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete agent
router.delete('/:id', async (req, res) => {
  try {
    const agent = await AgentModel.findByIdAndDelete(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process agent request
router.post('/:id/process', async (req, res) => {
  try {
    const { input } = req.body;
    const agentId = req.params.id;
    
    // Get the agent
    const agent = await AgentModel.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    // Process the request
    const output = await AgentOrchestrationService.processAgentRequest(agentId, input, agent);
    
    // Apply error correction
    const correctedOutput = await AdvancedErrorCorrectionService.detectAndCorrectErrors(agentId, input, output);
    
    // Extract provider/model for logging
    const provider = agent.properties.find((p) => p.id === 'provider')?.value || 'openai';
    const model = agent.properties.find((p) => p.id === 'model')?.value || 'gpt-3.5-turbo';
    
    // Log the interaction with provider/model in metadata
    await AgentLogModel.create({
      agentId,
      level: 'info',
      message: 'Successfully processed user request',
      metadata: { 
        input,
        output: correctedOutput,
        provider,
        model
      }
    });
    
    res.json({ 
      agentId,
      input,
      output: correctedOutput
    });
  } catch (error) {
    console.error('Error processing agent request:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reset agent
router.post('/:id/reset', async (req, res) => {
  try {
    const agentId = req.params.id;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const success = await FailsafeControllerService.resetAgent(agentId, userId);
    
    if (success) {
      res.json({ message: 'Agent reset successfully' });
    } else {
      res.status(500).json({ message: 'Failed to reset agent' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Emergency shutdown
router.post('/emergency-shutdown', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const success = await FailsafeControllerService.emergencyShutdown(userId);
    
    if (success) {
      res.json({ message: 'Emergency shutdown executed successfully' });
    } else {
      res.status(500).json({ message: 'Failed to execute emergency shutdown' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent logs
router.get('/:id/logs', async (req, res) => {
  try {
    const agentId = req.params.id;
    const logs = await AgentLogModel.find({ agentId })
      .sort({ timestamp: -1 })
      .limit(parseInt(req.query.limit as string) || 100);
      
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze agent performance
router.get('/:id/performance', async (req, res) => {
  try {
    const agentId = req.params.id;
    const performance = await LearningEngineService.analyzeAgentPerformance(agentId);
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply optimizations
router.post('/:id/optimize', async (req, res) => {
  try {
    const agentId = req.params.id;
    const { optimizations } = req.body;
    
    if (!optimizations || !Array.isArray(optimizations)) {
      return res.status(400).json({ message: 'Optimizations array is required' });
    }
    
    const success = await LearningEngineService.applyOptimizations(agentId, optimizations);
    
    if (success) {
      res.json({ message: 'Optimizations applied successfully' });
    } else {
      res.status(500).json({ message: 'Failed to apply optimizations' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check agent safety
router.get('/:id/safety', async (req, res) => {
  try {
    const agentId = req.params.id;
    const safety = await FailsafeControllerService.checkAgentSafety(agentId);
    res.json(safety);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Navigation endpoint for API discovery
router.get('/api/navigation', (req, res) => {
  res.json({
    routes: [
      { name: 'Users', path: '/api/users' },
      { name: 'Test Cases', path: '/api/test-cases' },
      { name: 'Agents', path: '/api/agents' }
    ]
  });
});

export default router;
