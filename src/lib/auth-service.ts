import { refreshToken, logout } from './api';

class AuthService {
  private accessToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearAccessToken() {
    this.accessToken = null;
  }

  async refreshAccessToken(): Promise<string> {
    // If there's already a refresh in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start new refresh
    this.refreshPromise = this.performRefresh();

    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<string> {
    try {
      console.log('Performing token refresh...');
      const response = await refreshToken();
      this.setAccessToken(response.accessToken);
      console.log('Token refresh successful');
      return response.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, clear token and redirect to login
      this.clearAccessToken();
      // Don't redirect here, let the calling code handle it
      throw error;
    }
  }

  async logout() {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAccessToken();
    }
  }

  // Check if token is expired (simple check - in production you'd decode JWT)
  isTokenExpired(): boolean {
    // For now, we'll rely on 401 responses to trigger refresh
    // In production, you could decode JWT and check exp claim
    return false;
  }
}

export const authService = new AuthService();
