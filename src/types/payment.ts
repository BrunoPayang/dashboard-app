// Payment system type definitions
export interface PaymentRecord {
  id: number;
  student: number | string;
  student_name: string; // Read-only
  amount: string; // Decimal as string
  currency: string;
  payment_type: PaymentType;
  status: PaymentStatus;
  due_date: string; // YYYY-MM-DD
  paid_date: string | null;
  payment_method: PaymentMethod | '';
  reference_number: string;
  receipt_url: string | null;
  notes: string;
  created_by: number;
  created_by_name: string; // Read-only
  days_overdue: number; // Read-only
  created_at: string;
  updated_at: string;
}

export type PaymentType = 
  | 'tuition' 
  | 'library' 
  | 'laboratory' 
  | 'sports' 
  | 'transport' 
  | 'meal' 
  | 'uniform' 
  | 'examination' 
  | 'other';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'overdue' 
  | 'cancelled' 
  | 'refunded';

export type PaymentMethod = 
  | 'cash' 
  | 'bank_transfer' 
  | 'card' 
  | 'mobile_money' 
  | 'check' 
  | 'other';

export interface PaymentSummary {
  total_payments: number;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
  payment_types: PaymentTypeBreakdown[];
}

export interface PaymentTypeBreakdown {
  payment_type: PaymentType;
  count: number;
  total_amount: number;
}

export interface CreatePaymentRequest {
  student: number | string;
  amount: string;
  currency?: string;
  payment_type: PaymentType;
  status?: PaymentStatus;
  due_date: string;
  notes?: string;
  created_by?: number | string;
}

export interface UpdatePaymentRequest {
  status?: PaymentStatus;
  paid_date?: string;
  payment_method?: PaymentMethod;
  reference_number?: string;
  receipt_url?: string;
  notes?: string;
}

export interface PaymentFilters {
  payment_type: PaymentType | '';
  status: PaymentStatus | '';
  search: string;
}

// Constants for UI components
export const PAYMENT_TYPES: { value: PaymentType; label: string }[] = [
  { value: 'tuition', label: 'Frais de Scolarité' },
  { value: 'library', label: 'Frais de Bibliothèque' },
  { value: 'laboratory', label: 'Frais de Laboratoire' },
  { value: 'sports', label: 'Frais de Sport' },
  { value: 'transport', label: 'Frais de Transport' },
  { value: 'meal', label: 'Frais de Restauration' },
  { value: 'uniform', label: 'Frais d\'Uniforme' },
  { value: 'examination', label: 'Frais d\'Examen' },
  { value: 'other', label: 'Autre' },
];

export const PAYMENT_STATUSES: { value: PaymentStatus; label: string }[] = [
  { value: 'pending', label: 'En Attente' },
  { value: 'paid', label: 'Payé' },
  { value: 'overdue', label: 'En Retard' },
  { value: 'cancelled', label: 'Annulé' },
  { value: 'refunded', label: 'Remboursé' },
];

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Espèces' },
  { value: 'bank_transfer', label: 'Virement Bancaire' },
  { value: 'card', label: 'Carte de Crédit/Débit' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'check', label: 'Chèque' },
  { value: 'other', label: 'Autre' },
];
