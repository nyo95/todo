const API_BASE = process.env.NODE_ENV === 'production' ? '' : '';

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}/api${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  },

  async authRequest(endpoint: string, options: RequestInit = {}, token: string) {
    return this.request(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export const authApi = {
  async signUp(email: string, password: string, name?: string) {
    return api.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  async signIn(email: string, password: string) {
    return api.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

export const projectsApi = {
  async getAll(token: string) {
    return api.authRequest('/projects', {}, token);
  },

  async create(token: string, data: { name: string; description?: string; color?: string }) {
    return api.authRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  },

  async update(token: string, id: string, data: { name?: string; description?: string; color?: string }) {
    return api.authRequest(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token);
  },

  async delete(token: string, id: string) {
    return api.authRequest(`/projects/${id}`, {
      method: 'DELETE',
    }, token);
  },
};

export const tasksApi = {
  async getAll(token: string, filters?: { projectId?: string; completed?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.projectId) params.append('projectId', filters.projectId);
    if (filters?.completed !== undefined) params.append('completed', filters.completed.toString());
    
    const query = params.toString();
    return api.authRequest(`/tasks${query ? `?${query}` : ''}`, {}, token);
  },

  async create(token: string, data: { 
    title: string; 
    description?: string; 
    dueDate?: string; 
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    projectId?: string;
  }) {
    return api.authRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  },

  async update(token: string, id: string, data: {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    projectId?: string;
    completed?: boolean;
  }) {
    return api.authRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token);
  },

  async delete(token: string, id: string) {
    return api.authRequest(`/tasks/${id}`, {
      method: 'DELETE',
    }, token);
  },
};