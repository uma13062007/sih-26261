import { apiClient, isMockApiEnabled, simulateDelay } from './apiClient';
import { mockStore } from '../mocks/store';

export const replayService = {
  async runReplay(payload) {
    if (isMockApiEnabled()) {
      await simulateDelay(800); // Simulate analytical batch processing
      const summary = mockStore.executeReplay(payload);
      return { data: summary, message: 'Niyantran synthetic replay completed successfully.' };
    }
    return apiClient.post('/replays', payload);
  },

  async getReplayById(id) {
    if (isMockApiEnabled()) {
      await simulateDelay(120);
      const replay = mockStore.getReplayById(id);
      if (!replay) throw new Error(`Replay ${id} is not available in the current demo session.`);
      return { data: replay };
    }
    return apiClient.get(`/replays/${id}`);
  },

  async getReplays() {
    if (isMockApiEnabled()) {
      await simulateDelay(120);
      return { data: mockStore.getReplays() };
    }
    return apiClient.get('/replays');
  },
};
