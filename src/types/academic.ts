// Academic records type definitions
export interface TranscriptRecord {
  id: number;
  student: number;
  student_name: string;
  academic_year: string;
  semester: string;
  gpa: number | null;
  file_url: string | null;
  uploaded_by: number;
  uploaded_by_name: string;
  upload_date: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface BehaviorReport {
  id: number;
  student: number;
  student_name: string;
  report_type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  incident_date: string;
  reported_by: number;
  reported_by_name: string;
  severity: 'low' | 'medium' | 'high';
  action_taken: string;
  follow_up_required: boolean;
  follow_up_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentStatistics {
  academic: {
    total_transcripts: number;
    average_gpa: number;
    latest_gpa: number;
  };
  behavior: {
    positive_reports: number;
    negative_reports: number;
    total_reports: number;
  };
  payments: {
    total_payments: number;
    paid_payments: number;
    overdue_payments: number;
    total_amount: number;
  };
}

export interface CreateTranscriptRequest {
  student: number | string;
  academic_year: string;
  semester: string;
  gpa: number | null;
  file_url?: string;
  notes?: string;
}

export interface CreateBehaviorReportRequest {
  student: number | string;
  report_type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  incident_date: string;
  severity: 'low' | 'medium' | 'high';
  action_taken?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
}
