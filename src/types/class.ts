// Class Management Types

export interface Class {
  id: string;
  name: string;
  level: string;
  section: string;
  full_name: string;
  school: string;
  school_name: string;
  academic_year: string;
  max_students: number;
  student_count: number;
  available_spots: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateClassRequest {
  name: string;
  level: string;
  section: string;
  description?: string;
  academic_year: string;
  max_students: number;
  is_active: boolean;
}

export interface UpdateClassRequest {
  name?: string;
  level?: string;
  section?: string;
  description?: string;
  academic_year?: string;
  max_students?: number;
  is_active?: boolean;
}

export interface ClassListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Class[];
  page: number;
  pages: number;
}

export interface ClassFilters {
  search?: string;
  level?: string;
  section?: string;
  academic_year?: string;
  is_active?: boolean;
  school?: string;
}

// Class level options for French education system
export const CLASS_LEVELS = [
  { value: '1', label: 'CI (Cours d\'Initiation)' },
  { value: '2', label: 'CP (Cours Préparatoire)' },
  { value: '3', label: 'CE1 (Cours Élémentaire 1)' },
  { value: '4', label: 'CE2 (Cours Élémentaire 2)' },
  { value: '5', label: 'CM1 (Cours Moyen 1)' },
  { value: '6', label: 'CM2 (Cours Moyen 2)' },
  { value: '7', label: '6ème (Sixième)' },
  { value: '8', label: '5ème (Cinquième)' },
  { value: '9', label: '4ème (Quatrième)' },
  { value: '10', label: '3ème (Troisième)' },
  { value: '11', label: 'Seconde' },
  { value: '12', label: 'Première' },
  { value: '13', label: 'Terminale' }
] as const;

export const CLASS_SECTIONS = [
  { value: 'A', label: 'Section A' },
  { value: 'B', label: 'Section B' },
  { value: 'C', label: 'Section C' },
  { value: 'D', label: 'Section D' },
  { value: 'E', label: 'Section E' }
] as const;

export const ACADEMIC_YEARS = [
  '2023-2024',
  '2024-2025',
  '2025-2026',
  '2026-2027',
  '2027-2028'
] as const;
