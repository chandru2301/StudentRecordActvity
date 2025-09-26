export interface CertificateUploadRequest {
  studentId: number;
  certificateName: string;
  certificateType: string;
  fileName: string;
  filePath: string;
  fileSize?: number;
  fileType: string;
}

export interface CertificateReviewRequest {
  certificateId: number;
  status: CertificateStatus;
  reviewedBy: string;
  reviewNotes?: string;
}

export interface CertificateResponse {
  id: number;
  studentId: number;
  studentName: string;
  studentRollNumber: string;
  certificateName: string;
  certificateType: string;
  fileName: string;
  filePath: string;
  fileSize?: number;
  fileType: string;
  status: CertificateStatus;
  statusDisplayName: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateSummaryResponse {
  studentId: number;
  studentName: string;
  studentRollNumber: string;
  totalCertificates: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  underReviewCount: number;
  recentCertificates: CertificateResponse[];
  certificateTypeSummaries: CertificateTypeSummary[];
}

export interface CertificateTypeSummary {
  certificateType: string;
  count: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
}

export enum CertificateStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  UNDER_REVIEW = 'UNDER_REVIEW'
}

export enum CertificateType {
  ACADEMIC = 'ACADEMIC',
  ACHIEVEMENT = 'ACHIEVEMENT',
  PARTICIPATION = 'PARTICIPATION',
  COMPLETION = 'COMPLETION',
  MERIT = 'MERIT',
  OTHER = 'OTHER'
}

export interface CertificateStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  underReview: number;
  pendingPercentage: number;
  approvedPercentage: number;
  rejectedPercentage: number;
  underReviewPercentage: number;
}

export interface FileUploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}
