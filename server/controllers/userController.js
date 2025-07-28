import User from '../models/User.js';
import Submission from '../models/Submission.js';
import Question from '../models/Question.js';
import Duel from '../models/Duel.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { username, email, bio } = req.body;
    
    // Find user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if username is already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      user.username = username;
    }
    
    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
      user.email = email;
    }
    
    // Update bio if provided
    if (bio !== undefined) {
      user.bio = bio;
    }
    
    // Save updated user
    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user stats for dashboard
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get total submissions and accepted submissions
    const submissions = await Submission.find({ userId });
    const acceptedSubmissions = submissions.filter(sub => sub.status === 'Accepted');
    
    // Get unique solved problems
    const solvedQuestionIds = [...new Set(
      acceptedSubmissions.map(sub => sub.questionId.toString())
    )];
    
    // Get all questions for difficulty stats
    const allQuestions = await Question.find({});
    const easyQuestions = allQuestions.filter(q => q.difficulty === 'Easy');
    const mediumQuestions = allQuestions.filter(q => q.difficulty === 'Medium');
    const hardQuestions = allQuestions.filter(q => q.difficulty === 'Hard');
    
    // Get solved questions by difficulty
    const solvedQuestions = await Question.find({ _id: { $in: solvedQuestionIds } });
    const easySolved = solvedQuestions.filter(q => q.difficulty === 'Easy').length;
    const mediumSolved = solvedQuestions.filter(q => q.difficulty === 'Medium').length;
    const hardSolved = solvedQuestions.filter(q => q.difficulty === 'Hard').length;
    
    // Get duels stats
    const duels = await Duel.find({
      'participants.userId': userId,
      status: 'completed'
    });
    
    // Calculate duels won
    let duelsWon = 0;
    duels.forEach(duel => {
      const userParticipant = duel.participants.find(p => p.userId.toString() === userId);
      const otherParticipant = duel.participants.find(p => p.userId.toString() !== userId);
      
      // If both participants submitted and user's solution was accepted but other's wasn't
      // Or if both were accepted but user's runtime was better
      if (userParticipant && otherParticipant) {
        if (userParticipant.hasSubmitted && !otherParticipant.hasSubmitted) {
          duelsWon++;
        } else if (userParticipant.hasSubmitted && otherParticipant.hasSubmitted) {
          const userAccepted = userParticipant.result && userParticipant.result.status === 'Accepted';
          const otherAccepted = otherParticipant.result && otherParticipant.result.status === 'Accepted';
          
          if (userAccepted && !otherAccepted) {
            duelsWon++;
          } else if (userAccepted && otherAccepted) {
            const userRuntime = parseFloat(userParticipant.result.runtime);
            const otherRuntime = parseFloat(otherParticipant.result.runtime);
            if (userRuntime < otherRuntime) {
              duelsWon++;
            }
          }
        }
      }
    });
    
    // Calculate streak (simplified version - just count consecutive days with submissions)
    let streak = 0;
    if (submissions.length > 0) {
      // Sort submissions by date
      const submissionDates = submissions.map(sub => {
        const date = new Date(sub.createdAt);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      });
      
      // Get unique dates
      const uniqueDates = [...new Set(submissionDates)].sort();
      
      // Calculate current streak
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
      
      // Check if user submitted today or yesterday to maintain streak
      const hasRecentSubmission = uniqueDates.includes(todayStr) || uniqueDates.includes(yesterdayStr);
      
      if (hasRecentSubmission) {
        streak = 1; // Start with 1 for today/yesterday
        
        // Count backwards from yesterday to find consecutive days
        let checkDate = new Date(yesterday);
        checkDate.setDate(checkDate.getDate() - 1); // Start from 2 days ago
        
        while (true) {
          const dateStr = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
          if (uniqueDates.includes(dateStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }
    
    // Compile stats
    const stats = {
      totalSubmissions: submissions.length,
      acceptedSubmissions: acceptedSubmissions.length,
      problemsSolved: solvedQuestionIds.length,
      easySolved,
      mediumSolved,
      hardSolved,
      easyTotal: easyQuestions.length,
      mediumTotal: mediumQuestions.length,
      hardTotal: hardQuestions.length,
      duelsParticipated: duels.length,
      duelsWon,
      streak
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get recent submissions
export const getRecentSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get the 10 most recent submissions with question details
    const recentSubmissions = await Submission.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('questionId');
    
    res.json(recentSubmissions);
  } catch (error) {
    console.error('Error getting recent submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};