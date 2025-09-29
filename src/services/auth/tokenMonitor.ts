import { validateTokens, getTimeUntilExpiry } from '../../utils/tokenUtils';

class TokenMonitorService {
  private refreshTimer: NodeJS.Timeout | null = null;
  private onTokenExpired: (() => void) | null = null;
  private onTokenRefreshed: ((tokens: { access: string; refresh?: string }) => void) | null = null;

  /**
   * Start monitoring tokens and auto-refresh when needed
   */
  startMonitoring(
    onTokenExpired: () => void,
    onTokenRefreshed: (tokens: { access: string; refresh?: string }) => void
  ) {
    this.onTokenExpired = onTokenExpired;
    this.onTokenRefreshed = onTokenRefreshed;
    
    // Check immediately
    this.checkAndScheduleRefresh();
  }

  /**
   * Stop token monitoring
   */
  stopMonitoring() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    this.onTokenExpired = null;
    this.onTokenRefreshed = null;
  }

  /**
   * Check tokens and schedule refresh if needed
   */
  private checkAndScheduleRefresh() {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (!accessToken || !refreshToken) {
      this.onTokenExpired?.();
      return;
    }

    const tokenValidation = validateTokens(accessToken, refreshToken);

    if (tokenValidation.needsLogin) {
      this.onTokenExpired?.();
      return;
    }

    if (tokenValidation.needsRefresh) {
      // Token needs refresh now
      this.refreshTokens();
    } else {
      // Schedule refresh for when token will expire soon (5 minutes before)
      const timeUntilExpiry = getTimeUntilExpiry(accessToken);
      const refreshTime = Math.max(0, timeUntilExpiry - (5 * 60 * 1000)); // 5 minutes before expiry
      
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Token valid. Scheduling refresh in ${Math.round(refreshTime / 1000 / 60)} minutes`);
      }
      
      this.refreshTimer = setTimeout(() => {
        this.checkAndScheduleRefresh();
      }, refreshTime);
    }
  }

  /**
   * Refresh tokens using the refresh token
   */
  private async refreshTokens() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        this.onTokenExpired?.();
        return;
      }

      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Auto-refreshing tokens...');
      }
      
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || 'https://schoolconnect-qeaf.onrender.com/api'}/auth/token/refresh/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.access) {
        localStorage.setItem('access_token', data.access);
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh);
        }
        
        this.onTokenRefreshed?.(data);
        
        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Tokens refreshed successfully');
        }
        
        // Schedule next refresh
        this.checkAndScheduleRefresh();
      } else {
        throw new Error('No access token in refresh response');
      }
    } catch (error) {
      console.error('Auto token refresh failed:', error);
      this.onTokenExpired?.();
    }
  }

  /**
   * Force immediate token refresh
   */
  async forceRefresh(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return false;
    }

    try {
      await this.refreshTokens();
      return true;
    } catch (error) {
      console.error('Force refresh failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const tokenMonitor = new TokenMonitorService();