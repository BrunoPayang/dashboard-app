export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  student_id: string;
  school: string;
  school_name: string;
  class_level: string;
  section: string;
  class_assigned?: string;
  gender: string;
  date_of_birth?: string;
  is_active: boolean;
  enrollment_date: string;
  primary_parent: string | null;
}

export interface StudentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Student[];
  page: number;
  pages: number;
}

export interface StudentFilters {
  search?: string;
  class_level?: string;
  school?: string;
  section?: string;
  gender?: string;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface StudentFormData {
  first_name: string;
  last_name: string;
  student_id: string;
  school: string;
  class_assigned: string;
  gender: string;
  date_of_birth: string;
  enrollment_date: string;
}

export interface StudentCreateRequest extends StudentFormData {}

export interface StudentUpdateRequest extends Partial<StudentFormData> {}

export interface StudentSearchParams {
  search?: string;
  class_level?: string;
  school?: string;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}
