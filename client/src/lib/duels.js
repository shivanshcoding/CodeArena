import api from './api';

// Create a new duel
export const createDuel = async (duelData) => {
  try {
    const response = await api.post('/duels', duelData);
    return response.data;
  } catch (error) {
    console.error('Error creating duel:', error);
    throw error;
  }
};

// Get all public duels
export const getPublicDuels = async () => {
  try {
    const response = await api.get('/duels/public');
    return response.data;
  } catch (error) {
    console.error('Error getting public duels:', error);
    throw error;
  }
};

// Get duel by ID
export const getDuelById = async (id) => {
  try {
    const response = await api.get(`/duels/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting duel:', error);
    throw error;
  }
};

// Join a duel
export const joinDuel = async (id) => {
  try {
    const response = await api.post(`/duels/${id}/join`);
    return response.data;
  } catch (error) {
    console.error('Error joining duel:', error);
    throw error;
  }
};

// Submit solution for a duel
export const submitDuelSolution = async (id, submissionId) => {
  try {
    const response = await api.post(`/duels/${id}/submit`, { submissionId });
    return response.data;
  } catch (error) {
    console.error('Error submitting duel solution:', error);
    throw error;
  }
};

// Get user's duels
export const getUserDuels = async () => {
  try {
    const response = await api.get('/duels/user/me');
    return response.data;
  } catch (error) {
    console.error('Error getting user duels:', error);
    throw error;
  }
};

// Cancel a duel
export const cancelDuel = async (id) => {
  try {
    const response = await api.put(`/duels/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling duel:', error);
    throw error;
  }
};

// Join duel by invite code
export const joinDuelByInviteCode = async (inviteCode) => {
  try {
    const response = await api.post(`/duels/invite/${inviteCode}`);
    return response.data;
  } catch (error) {
    console.error('Error joining duel by invite code:', error);
    throw error;
  }
};