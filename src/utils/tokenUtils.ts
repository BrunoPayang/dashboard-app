import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  exp: number;
  iat?: number;
  user_id?: number;
  [key: string]: any;
}

/**
 * Check if a JWT token is expired
 * @param token - JWT token string
 * @returns true if token is expired, false if still valid
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Treat invalid tokens as expired
  }
};

/**
 * Get token expiry time
 * @param token - JWT token string
 * @returns Date object of expiry time, or null if invalid
 */
export const getTokenExpiry = (token: string): Date | null => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return new Date(decoded.exp * 1000);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token will expire soon (within next 5 minutes)
 * @param token - JWT token string
 * @returns true if token expires within 5 minutes
 */
export const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    const fiveMinutesFromNow = currentTime + (5 * 60); // 5 minutes in seconds
    return decoded.exp < fiveMinutesFromNow;
  } catch (error) {
    return true;
  }
};

/**
 * Validate both access and refresh tokens
 * @param accessToken - Access token string
 * @param refreshToken - Refresh token string
 * @returns Object with validation results
 */
export const validateTokens = (accessToken: string | null, refreshToken: string | null) => {
  if (!accessToken || !refreshToken) {
    return {
      isValid: false,
      needsRefresh: false,
      needsLogin: true,
      reason: 'Missing tokens'
    };
  }

  const isAccessExpired = isTokenExpired(accessToken);
  const isRefreshExpired = isTokenExpired(refreshToken);

  if (isRefreshExpired) {
    return {
      isValid: false,
      needsRefresh: false,
      needsLogin: true,
      reason: 'Refresh token expired'
    };
  }

  if (isAccessExpired) {
    return {
      isValid: false,
      needsRefresh: true,
      needsLogin: false,
      reason: 'Access token expired, refresh available'
    };
  }

  const accessExpiringSoon = isTokenExpiringSoon(accessToken);
  
  return {
    isValid: true,
    needsRefresh: accessExpiringSoon,
    needsLogin: false,
    reason: accessExpiringSoon ? 'Access token expiring soon' : 'Tokens valid'
  };
};

/**
 * Get time remaining until token expires
 * @param token - JWT token string
 * @returns Time remaining in milliseconds, or 0 if expired/invalid
 */
export const getTimeUntilExpiry = (token: string): number => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    const timeRemaining = (decoded.exp - currentTime) * 1000; // Convert to milliseconds
    return Math.max(0, timeRemaining);
  } catch (error) {
    return 0;
  }
};