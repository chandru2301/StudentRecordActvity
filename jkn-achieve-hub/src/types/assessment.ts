// Assessment Types and Interfaces

export interface AssessmentRequest {
  title: string;
  description?: string;
  facultyId: number;
  type: AssessmentType;
  startDate: string;
  endDate: string;
  timeLimitMinutes?: number;
  maxAttempts?: number;
  totalMarks?: number;
  passingMarks?: number;
  isRandomized?: boolean;
  showCorrectAnswers?: boolean;
  allowReview?: boolean;
  questions?: QuestionRequest[];
}

export interface QuestionRequest {
  questionText: string;
  type: QuestionType;
  questionOrder?: number;
  marks?: number;
  negativeMarks?: number;
  explanation?: string;
  isRequired?: boolean;
  options?: QuestionOptionRequest[];
}

export interface QuestionOptionRequest {
  optionText: string;
  optionOrder?: number;
  isCorrect?: boolean;
  optionLetter?: string;
}

export interface StudentAnswerRequest {
  studentId: number;
  assessmentId: number;
  questionId: number;
  answerText?: string;
  selectedOptionId?: number;
  timeTakenSeconds?: number;
}

export interface GradeAnswerRequest {
  studentAnswerId: number;
  isCorrect?: boolean;
  marksObtained?: number;
  feedback?: string;
  gradedBy?: string;
}

export interface AssessmentResponse {
  id: number;
  title: string;
  description?: string;
  facultyId: number;
  facultyName?: string;
  facultyEmail?: string;
  type: AssessmentType;
  typeDisplayName: string;
  status: AssessmentStatus;
  statusDisplayName: string;
  startDate: string;
  endDate: string;
  timeLimitMinutes?: number;
  maxAttempts?: number;
  totalMarks?: number;
  passingMarks?: number;
  isRandomized?: boolean;
  showCorrectAnswers?: boolean;
  allowReview?: boolean;
  createdAt: string;
  updatedAt: string;
  questions?: QuestionResponse[];
  totalQuestions?: number;
  totalSubmissions?: number;
  pendingGrading?: number;
}

export interface QuestionResponse {
  id: number;
  questionText: string;
  assessmentId: number;
  assessmentTitle?: string;
  type: QuestionType;
  typeDisplayName: string;
  questionOrder?: number;
  marks?: number;
  negativeMarks?: number;
  explanation?: string;
  isRequired?: boolean;
  createdAt: string;
  updatedAt: string;
  options?: QuestionOptionResponse[];
}

export interface QuestionOptionResponse {
  id: number;
  optionText: string;
  questionId: number;
  optionOrder?: number;
  isCorrect?: boolean;
  optionLetter?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentAnswerResponse {
  id: number;
  studentId: number;
  studentName?: string;
  studentRollNumber?: string;
  assessmentId: number;
  assessmentTitle?: string;
  questionId: number;
  questionText?: string;
  answerText?: string;
  selectedOptionId?: number;
  isCorrect?: boolean;
  marksObtained?: number;
  feedback?: string;
  timeTakenSeconds?: number;
  answerStatus: AnswerStatus;
  answerStatusDisplayName: string;
  submittedAt: string;
  updatedAt: string;
  gradedAt?: string;
  gradedBy?: string;
}

export enum AssessmentType {
  QUIZ = 'QUIZ',
  EXAM = 'EXAM',
  ASSIGNMENT = 'ASSIGNMENT',
  TEST = 'TEST',
  SURVEY = 'SURVEY'
}

export enum AssessmentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  ESSAY = 'ESSAY',
  FILL_IN_BLANK = 'FILL_IN_BLANK',
  MATCHING = 'MATCHING'
}

export enum AnswerStatus {
  SUBMITTED = 'SUBMITTED',
  GRADED = 'GRADED',
  REVIEWED = 'REVIEWED'
}

// UI State Types
export interface AssessmentFormData {
  title: string;
  description: string;
  type: AssessmentType;
  startDate: string;
  endDate: string;
  timeLimitMinutes: number;
  maxAttempts: number;
  totalMarks: number;
  passingMarks: number;
  isRandomized: boolean;
  showCorrectAnswers: boolean;
  allowReview: boolean;
  questions: QuestionFormData[];
}

export interface QuestionFormData {
  questionText: string;
  type: QuestionType;
  questionOrder: number;
  marks: number;
  negativeMarks: number;
  explanation: string;
  isRequired: boolean;
  options: QuestionOptionFormData[];
}

export interface QuestionOptionFormData {
  optionText: string;
  optionOrder: number;
  isCorrect: boolean;
  optionLetter: string;
}

export interface AssessmentStats {
  totalAssessments: number;
  activeAssessments: number;
  completedAssessments: number;
  totalSubmissions: number;
  pendingGrading: number;
  averageScore: number;
}

export interface StudentAssessmentProgress {
  assessmentId: number;
  assessmentTitle: string;
  totalQuestions: number;
  answeredQuestions: number;
  timeRemaining?: number;
  isCompleted: boolean;
  score?: number;
  maxScore?: number;
}

export interface GradingSummary {
  assessmentId: number;
  assessmentTitle: string;
  totalSubmissions: number;
  gradedSubmissions: number;
  pendingSubmissions: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}
