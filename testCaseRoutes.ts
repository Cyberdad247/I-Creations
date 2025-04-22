import express from 'express';
import TestCaseModel from '../models/TestCaseModel';
import ErrorCorrectionService from '../services/ErrorCorrectionService';

const router = express.Router();

// Get all test cases for an agent
router.get('/agent/:agentId', async (req, res) => {
  try {
    const testCases = await TestCaseModel.find({ agentId: req.params.agentId });
    res.json(testCases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get test case by ID
router.get('/:id', async (req, res) => {
  try {
    const testCase = await TestCaseModel.findById(req.params.id);
    if (!testCase) {
      return res.status(404).json({ message: 'Test case not found' });
    }
    res.json(testCase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new test case
router.post('/', async (req, res) => {
  try {
    const testCase = new TestCaseModel(req.body);
    await testCase.save();
    res.status(201).json(testCase);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update test case
router.put('/:id', async (req, res) => {
  try {
    const testCase = await TestCaseModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testCase) {
      return res.status(404).json({ message: 'Test case not found' });
    }
    res.json(testCase);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete test case
router.delete('/:id', async (req, res) => {
  try {
    const testCase = await TestCaseModel.findByIdAndDelete(req.params.id);
    if (!testCase) {
      return res.status(404).json({ message: 'Test case not found' });
    }
    res.json({ message: 'Test case deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Run a single test case
router.post('/:id/run', async (req, res) => {
  try {
    const testCase = await TestCaseModel.findById(req.params.id);
    if (!testCase) {
      return res.status(404).json({ message: 'Test case not found' });
    }
    
    // Update test case status to running
    testCase.status = 'running';
    await testCase.save();
    
    try {
      // Run the test case
      const result = await ErrorCorrectionService.detectErrors(
        testCase.agentId,
        testCase.input,
        testCase.actualOutput || '',
        testCase.expectedOutput
      );
      
      // Update test case with results
      testCase.status = result.hasErrors ? 'failure' : 'success';
      await testCase.save();
      
      res.json({
        testCaseId: testCase.id,
        success: !result.hasErrors,
        errors: result.errors,
        needsIntervention: result.needsIntervention
      });
    } catch (error) {
      // Update test case as failed
      testCase.status = 'failure';
      await testCase.save();
      
      throw error;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Run all test cases for an agent
router.post('/agent/:agentId/run-all', async (req, res) => {
  try {
    const results = await ErrorCorrectionService.runTestCases(req.params.agentId);
    res.json(results);
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
