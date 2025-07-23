import axios from 'axios';
import authService from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:20005';

interface Meeting {
  id?: string;
  title: string;
  hostId?: string;
  hostName?: string;
  startTime?: Date;
  duration?: number;
  code?: string;
  status?: 'scheduled' | 'active' | 'ended';
  projectId?: string;
}

class MeetingService {
  private getAuthHeaders() {
    const token = authService.getToken();
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async createMeeting(meeting: Meeting): Promise<Meeting> {
    const response = await axios.post(`${API_BASE_URL}/api/meetings`, meeting, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getMeeting(id: string): Promise<Meeting> {
    const response = await axios.get(`${API_BASE_URL}/api/meetings/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getMeetingByCode(code: string): Promise<Meeting> {
    const response = await axios.get(
      `${API_BASE_URL}/api/meetings/code/${code}`,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async getMeetingsByProject(projectId: string): Promise<Meeting[]> {
    const response = await axios.get(
      `${API_BASE_URL}/api/meetings/project/${projectId}`,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async getHostedMeetings(): Promise<Meeting[]> {
    const response = await axios.get(
      `${API_BASE_URL}/api/meetings/user/hosted`,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async startMeeting(id: string): Promise<Meeting> {
    const response = await axios.post(
      `${API_BASE_URL}/api/meetings/${id}/start`,
      {},
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async endMeeting(id: string): Promise<Meeting> {
    const response = await axios.post(
      `${API_BASE_URL}/api/meetings/${id}/end`,
      {},
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async deleteMeeting(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/meetings/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

export default new MeetingService();
