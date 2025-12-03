
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  isApproved: boolean;
  karma: number;
}

export type FileType = 'pdf' | 'image';

export interface ExamRatings {
  difficultySum: number; // 1-5 scale
  qualitySum: number;    // 1-5 scale
  count: number;
}

export interface Exam {
  id: string;
  subject: string;
  teacher: string;
  gradeLevel: string;
  date: string; // ISO string
  uploaderName: string;
  fileName: string;
  fileType: FileType;
  fileContent?: string; // For mock preview
  tags: string[];
  ratings: ExamRatings;
  transcript?: string; // OCR text content
  isReported?: boolean;
  isApproved: boolean;
  views: number;
  downloads: number;
}

export interface FilterState {
  subject: string | null;
  teacher: string | null;
  search: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
