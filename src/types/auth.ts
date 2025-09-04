export interface User {
  id: number;
  username: string;
  email: string;
  user_type: 'admin' | 'school_staff' | 'parent';
  first_name: string;
  last_name: string;
  full_name: string;
  school: string; // This is the school UUID
  school_name: string;
  phone: string;
  profile_picture: string | null;
  is_verified: boolean;
  profile: {
    address: string;
    emergency_contact: string;
    language_preference: string;
    email_notifications: boolean;
    sms_notifications: boolean;
    push_notifications: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface School {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  primary_color?: string;
  secondary_color?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  user_type: 'admin' | 'school_staff' | 'parent';
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface AuthState {
  user: User | null;
  school: School | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
