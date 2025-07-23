import axios from 'axios';
import type {
  GanttTask,
  Milestone,
  WorkloadComparison,
  TeamAvailability,
} from '../types/report.types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:20005/api';

class ReportService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getGanttData(projectId: string): Promise<GanttTask[]> {
    const response = await axios.get(
      `${API_BASE_URL}/projects/${projectId}/reports/gantt`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  async getMilestones(projectId: string): Promise<Milestone[]> {
    const response = await axios.get(
      `${API_BASE_URL}/projects/${projectId}/reports/milestones`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  async createMilestone(
    projectId: string,
    milestone: Partial<Milestone>
  ): Promise<Milestone> {
    const response = await axios.post(
      `${API_BASE_URL}/projects/${projectId}/reports/milestones`,
      milestone,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async updateMilestone(
    projectId: string,
    milestoneId: string,
    milestone: Partial<Milestone>
  ): Promise<Milestone> {
    const response = await axios.put(
      `${API_BASE_URL}/projects/${projectId}/reports/milestones/${milestoneId}`,
      milestone,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async deleteMilestone(projectId: string, milestoneId: string): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/projects/${projectId}/reports/milestones/${milestoneId}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  async getWorkloadComparison(
    projectId: string
  ): Promise<WorkloadComparison[]> {
    const response = await axios.get(
      `${API_BASE_URL}/projects/${projectId}/reports/workload`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  async getTeamAvailability(
    projectId: string,
    startDate: string,
    endDate: string
  ): Promise<TeamAvailability[]> {
    const response = await axios.get(
      `${API_BASE_URL}/projects/${projectId}/reports/team-availability`,
      {
        headers: this.getAuthHeaders(),
        params: { startDate, endDate },
      }
    );
    return response.data;
  }

  async updateAvailability(
    projectId: string,
    availability: Partial<TeamAvailability>
  ): Promise<TeamAvailability> {
    const response = await axios.post(
      `${API_BASE_URL}/projects/${projectId}/reports/team-availability`,
      availability,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async getProjectMembers(
    projectId: string
  ): Promise<{ id: string; name: string; email: string }[]> {
    const response = await axios.get(
      `${API_BASE_URL}/projects/${projectId}/members`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    // Map API response structure to component expected structure
    return response.data.map((member: { userId: string; userName: string; userEmail: string }) => ({
      id: member.userId,
      name: member.userName,
      email: member.userEmail,
    }));
  }
}

const reportService = new ReportService();
export default reportService;
