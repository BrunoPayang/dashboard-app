export interface Parent {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: 'parent';
  school: string;
  is_active: boolean;
  fcm_token?: string;
  created_at: string;
  last_login?: string;
  children_count?: number;
  notification_preferences?: {
    sms_notifications: boolean;
    email_notifications: boolean;
    push_notifications: boolean;
  };
  // Add relationships for the new endpoint
  relationships?: ParentStudentRelationship[];
}

export interface CreateParentRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: 'parent';
  school: string;
}

export interface UpdateParentRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
}

export interface ParentStudentRelationship {
  id: number;
  parent: number;
  parent_name: string;
  student: string;
  student_name: string;
  relationship: 'father' | 'mother' | 'guardian' | 'grandparent' | 'aunt' | 'uncle' | 'sibling' | 'other';
  is_primary: boolean;
  is_emergency_contact: boolean;
  receive_sms: boolean;
  receive_email: boolean;
  receive_push: boolean;
  created_at: string;
}

export interface CreateRelationshipRequest {
  parent: number;
  student: string;
  relationship: 'father' | 'mother' | 'guardian' | 'grandparent' | 'aunt' | 'uncle' | 'sibling' | 'other';
  is_primary: boolean;
  is_emergency_contact: boolean;
  receive_sms: boolean;
  receive_email: boolean;
  receive_push: boolean;
}

export interface UpdateRelationshipRequest {
  relationship?: 'father' | 'mother' | 'guardian' | 'grandparent' | 'aunt' | 'uncle' | 'sibling' | 'other';
  is_primary?: boolean;
  is_emergency_contact?: boolean;
  receive_sms?: boolean;
  receive_email?: boolean;
  receive_push?: boolean;
}

export interface Notification {
  id: string;
  school: string;
  title: string;
  body: string;
  notification_type: 'academic' | 'behavior' | 'payment' | 'general';
  target_users: number[];
  sent_via_fcm: boolean;
  sent_via_email: boolean;
  sent_via_sms: boolean;
  data: Record<string, any>;
  created_at: string;
  sent_at?: string;
}

export interface CreateNotificationRequest {
  title: string;
  body: string;
  notification_type: 'academic' | 'behavior' | 'payment' | 'general';
  target_users: number[];
  sent_via_fcm: boolean;
  sent_via_email: boolean;
  sent_via_sms: boolean;
  data?: Record<string, any>;
}

export interface BulkNotificationRequest {
  title: string;
  body: string;
  notification_type: 'academic' | 'behavior' | 'payment' | 'general';
  target_type: 'parents' | 'staff' | 'emergency_contacts';
  sent_via_fcm: boolean;
  sent_via_email: boolean;
  sent_via_sms: boolean;
  data?: Record<string, any>;
}

export interface NotificationDelivery {
  id: number;
  notification_title: string;
  notification_type: string;
  user: number;
  user_name: string;
  delivered_via_fcm: boolean;
  delivered_via_email: boolean;
  delivered_via_sms: boolean;
  read_at?: string;
  delivered_at?: string;
}

export interface ParentFilters {
  search: string;
  is_active?: boolean;
  school?: string;
  ordering: string;
}

export interface RelationshipFilters {
  parent?: number;
  student?: string;
  relationship?: string;
  is_primary?: boolean;
  is_emergency_contact?: boolean;
  ordering: string;
}

export interface NotificationFilters {
  notification_type?: string;
  target_type?: string;
  created_after?: string;
  created_before?: string;
  ordering: string;
}

export const RELATIONSHIP_TYPES = {
  father: 'Père',
  mother: 'Mère',
  guardian: 'Tuteur',
  grandparent: 'Grand-parent',
  aunt: 'Tante',
  uncle: 'Oncle',
  sibling: 'Frère/Sœur',
  other: 'Autre'
} as const;

export const NOTIFICATION_TYPES = {
  academic: 'Académique',
  behavior: 'Comportement',
  payment: 'Paiement',
  general: 'Général'
} as const;

export const TARGET_TYPES = {
  parents: 'Parents',
  staff: 'Personnel',
  emergency_contacts: 'Contacts d\'urgence'
} as const;
