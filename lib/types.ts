export interface Call {
  id: string;
  prospectName: string;
  date: string;
  duration: number;
  status: 'completed' | 'scheduled' | 'cancelled';
  outcome: 'qualified' | 'not-qualified' | 'follow-up' | 'closed-won' | 'closed-lost';
  talkTimeRatio: number;
  questionsAsked: number;
  sentimentScore: number;
  notes?: string;
  tags: string[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}