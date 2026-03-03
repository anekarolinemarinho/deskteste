
export type DepartmentId = 'home' | 'service_record' | 'assistance' | 'registration' | 'tracking' | 'events' | 'cancellations' | 'billing' | 'commercial';

export interface Submodule {
  id: string;
  name: string;
  parentId: DepartmentId;
}

export interface Department {
  id: DepartmentId;
  name: string;
  icon: string;
  description: string;
  colorClass: string;
  submodules: Submodule[];
  groups?: { name: string; items: Submodule[] }[];
}

export interface FormSubmissionStatus {
  submitting: boolean;
  success: boolean | null;
  error: string | null;
}