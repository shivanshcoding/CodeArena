import Duel from '../models/Duel.js';
import User from '../models/User.js';
import Question from '../models/Question.js';
import Submission from '../models/Submission.js';

// Create a new duel
export const createDuel = async (req, res) => {
  try {
    const { title, questionId, timeLimit, isPublic } = req.body;
    const userId = req.user.id;

    // Validate question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Create new duel
    const duel = new Duel({
      title,
      createdBy: userId,
      questionId,
      timeLimit: timeLimit || 30, // Default 30 minutes
      isPublic: isPublic !== undefined ? isPublic : true,
      participants: [{ user: userId }]
    });

    await duel.save();

    // Populate creator info
    await duel.populate('createdBy', 'username');
    await duel.populate('questionId', 'title difficulty');

    return res.status(201).json(duel);
  } catch (error) {
    console.error('Error creating duel:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all public duels
export const getPublicDuels = async (req, res) => {
  try {
    const duels = await Duel.find({ isPublic: true, status: { $in: ['pending', 'active'] } })
      .populate('createdBy', 'username')
      .populate('questionId', 'title difficulty')
      .populate('participants.user', 'username')
      .sort({ createdAt: -1 });

    return res.status(200).json(duels);
  } catch (error) {
    console.error('Error getting public duels:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get duel by ID
export const getDuelById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const duel = await Duel.findById(id)
      .populate('createdBy', 'username')
      .populate('opponent', 'username')
      .populate('questionId')
      .populate('participants.user', 'username')
      .populate('participants.submissionId');

    if (!duel) {
      return res.status(404).json({ message: 'Duel not found' });
    }

    // Check if user is authorized to view this duel
    if (!duel.isPublic) {
      const userId = req.user.id;
      const isParticipant = duel.participants.some(p => p.user._id.toString() === userId);
      const isCreator = duel.createdBy._id.toString() === userId;
      
      if (!isParticipant && !isCreator) {
        return res.status(403).json({ message: 'You are not authorized to view this duel' });
      }
    }

    return res.status(200).json(duel);
  } catch (error) {
    console.error('Error getting duel:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Join a duel
export const joinDuel = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const duel = await Duel.findById(id);
    if (!duel) {
      return res.status(404).json({ message: 'Duel not found' });
    }

    // Check if duel is joinable
    if (duel.status !== 'pending') {
      return res.status(400).json({ message: 'This duel is no longer accepting participants' });
    }

    // Check if user is already a participant
    const isParticipant = duel.participants.some(p => p.user.toString() === userId);
    if (isParticipant) {
      return res.status(400).json({ message: 'You are already a participant in this duel' });
    }

    // Add user to participants
    duel.participants.push({ user: userId, joinedAt: new Date() });
    
    // If this is the second participant, update status to active and set start time
    if (duel.participants.length === 2) {
      duel.status = 'active';
      duel.startTime = new Date();
      duel.endTime = new Date(Date.now() + duel.timeLimit * 60000); // Convert minutes to milliseconds
      duel.opponent = userId;
    }

    await duel.save();

    // Populate user info
    await duel.populate('createdBy', 'username');
    await duel.populate('opponent', 'username');
    await duel.populate('questionId', 'title difficulty');
    await duel.populate('participants.user', 'username');

    return res.status(200).json(duel);
  } catch (error) {
    console.error('Error joining duel:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit solution for a duel
export const submitDuelSolution = async (req, res) => {
  try {
    const { id } = req.params;
    const { submissionId } = req.body;
    const userId = req.user.id;

    // Validate submission exists
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const duel = await Duel.findById(id);
    if (!duel) {
      return res.status(404).json({ message: 'Duel not found' });
    }

    // Check if duel is active
    if (duel.status !== 'active') {
      return res.status(400).json({ message: 'This duel is not active' });
    }

    // Check if user is a participant
    const participantIndex = duel.participants.findIndex(p => p.user.toString() === userId);
    if (participantIndex === -1) {
      return res.status(403).json({ message: 'You are not a participant in this duel' });
    }

    // Update participant's submission
    duel.participants[participantIndex].submissionId = submissionId;
    duel.participants[participantIndex].completedAt = new Date();
    duel.participants[participantIndex].result = {
      status: submission.status === 'Accepted' ? 'success' : 'failed',
      executionTime: submission.executionTime,
      memoryUsed: submission.memoryUsed
    };

    // Check if all participants have submitted
    const allSubmitted = duel.participants.every(p => p.submissionId);
    if (allSubmitted) {
      duel.status = 'completed';
      duel.endTime = new Date();
    }

    await duel.save();

    // Populate duel info
    await duel.populate('createdBy', 'username');
    await duel.populate('opponent', 'username');
    await duel.populate('questionId', 'title difficulty');
    await duel.populate('participants.user', 'username');
    await duel.populate('participants.submissionId');

    return res.status(200).json(duel);
  } catch (error) {
    console.error('Error submitting duel solution:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's duels
export const getUserDuels = async (req, res) => {
  try {
    const userId = req.user.id;

    const duels = await Duel.find({
      'participants.user': userId
    })
      .populate('createdBy', 'username')
      .populate('opponent', 'username')
      .populate('questionId', 'title difficulty')
      .sort({ createdAt: -1 });

    return res.status(200).json(duels);
  } catch (error) {
    console.error('Error getting user duels:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel a duel
export const cancelDuel = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const duel = await Duel.findById(id);
    if (!duel) {
      return res.status(404).json({ message: 'Duel not found' });
    }

    // Only the creator can cancel a duel
    if (duel.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Only the creator can cancel this duel' });
    }

    // Only pending duels can be cancelled
    if (duel.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending duels can be cancelled' });
    }

    duel.status = 'cancelled';
    await duel.save();

    return res.status(200).json({ message: 'Duel cancelled successfully', duel });
  } catch (error) {
    console.error('Error cancelling duel:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Join duel by invite code
export const joinDuelByInviteCode = async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const userId = req.user.id;

    const duel = await Duel.findOne({ inviteCode });
    if (!duel) {
      return res.status(404).json({ message: 'Duel not found with this invite code' });
    }

    // Check if duel is joinable
    if (duel.status !== 'pending') {
      return res.status(400).json({ message: 'This duel is no longer accepting participants' });
    }

    // Check if user is already a participant
    const isParticipant = duel.participants.some(p => p.user.toString() === userId);
    if (isParticipant) {
      return res.status(400).json({ message: 'You are already a participant in this duel' });
    }

    // Add user to participants
    duel.participants.push({ user: userId, joinedAt: new Date() });
    
    // If this is the second participant, update status to active and set start time
    if (duel.participants.length === 2) {
      duel.status = 'active';
      duel.startTime = new Date();
      duel.endTime = new Date(Date.now() + duel.timeLimit * 60000); // Convert minutes to milliseconds
      duel.opponent = userId;
    }

    await duel.save();

    // Populate user info
    await duel.populate('createdBy', 'username');
    await duel.populate('opponent', 'username');
    await duel.populate('questionId', 'title difficulty');
    await duel.populate('participants.user', 'username');

    return res.status(200).json(duel);
  } catch (error) {
    console.error('Error joining duel by invite code:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};