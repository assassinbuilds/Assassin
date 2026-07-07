import { api } from '../lib/api-client';

export interface Mission {
  mission_id: string;
  title: string;
  description: string;
  xp_reward: number;
  frequency: 'daily' | 'weekly' | 'one-time';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'in_progress' | 'pending_verification' | 'completed';
  progress: unknown;
  time_remaining_ms: number;
  requirement_type?: string;
}

export const missionsService = {
  getAvailableMissions: () => {
    return api.get<Mission[]>('/missions');
  },
  
  verifyMission: (missionId: string, requirementType: string, payload: Record<string, unknown> = {}) => {
    return api.post<{ verified: boolean, message?: string }>('/missions', {
      missionId,
      requirementType,
      payload
    });
  }
};
