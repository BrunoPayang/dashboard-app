// School Configuration Types based on API Documentation

export interface SchoolConfiguration {
  academic_year_start: string;
  academic_year_end: string;
  current_semester: 'first' | 'second' | 'third';
  enable_sms_notifications: boolean;
  enable_email_notifications: boolean;
  enable_push_notifications: boolean;
  currency: string;
  payment_reminder_days: number;
  max_file_size_mb: number;
  allowed_file_types: string[];
}

export interface School {
  id: string;
  name: string;
  slug: string;
  school_type: 'primary' | 'secondary' | 'both' | 'university' | 'other';
  academic_year?: string;
  logo?: string;
  primary_color?: string;
  secondary_color?: string;
  contact_email: string;
  contact_phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  is_active: boolean;
  is_verified: boolean;
  student_count?: number;
  staff_count?: number;
  configuration?: SchoolConfiguration;
  created_at: string;
  updated_at: string;
}

export interface SchoolConfigurationResponse {
  school_id: string;
  school_name: string;
  school_slug: string;
  school_type: 'primary' | 'secondary' | 'both' | 'university' | 'other';
  academic_year?: string;
  logo?: string;
  primary_color?: string;
  secondary_color?: string;
  contact_email: string;
  contact_phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  is_active: boolean;
  is_verified: boolean;
  student_count?: number;
  staff_count?: number;
  created_at: string;
  updated_at: string;
  config_created_at: string;
  config_updated_at: string;
  academic_year_start: string;
  academic_year_end: string;
  current_semester: 'first' | 'second' | 'third';
  enable_sms_notifications: boolean;
  enable_email_notifications: boolean;
  enable_push_notifications: boolean;
  currency: string;
  payment_reminder_days: number;
  max_file_size_mb: number;
  allowed_file_types: string[];
}

export interface SchoolStatistics {
  total_students: number;
  class_distribution: Array<{
    class_assigned__level: string | null;
    count: number;
  }>;
  class_details: Array<{
    id: string;
    name: string;
    level: string;
    section: string;
    full_name: string;
    academic_year: string;
    max_students: number;
    student_count: number;
    available_spots: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }>;
  class_statistics: {
    total_classes: number;
    active_classes: number;
    total_capacity: number;
    utilization_rate: number;
  };
  gender_distribution: Array<{
    gender: 'male' | 'female';
    count: number;
  }>;
  recent_enrollments: number;
  payment_statistics: {
    total_payments: number;
    paid_payments: number;
    overdue_payments: number;
  };
}

export interface SchoolListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: School[];
}

export interface SchoolUpdateRequest {
  name?: string;
  school_type?: 'primary' | 'secondary' | 'both' | 'university' | 'other';
  academic_year?: string;
  logo?: string;
  primary_color?: string;
  secondary_color?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  is_active?: boolean;
  is_verified?: boolean;
  configuration?: Partial<SchoolConfiguration>;
}

export interface SchoolConfigurationUpdateRequest {
  academic_year_start?: string;
  academic_year_end?: string;
  current_semester?: 'first' | 'second' | 'third';
  enable_sms_notifications?: boolean;
  enable_email_notifications?: boolean;
  enable_push_notifications?: boolean;
  currency?: string;
  payment_reminder_days?: number;
  max_file_size_mb?: number;
  allowed_file_types?: string[];
}
