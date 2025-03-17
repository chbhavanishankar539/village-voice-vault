
export type FeedbackCategory = 
  | 'infrastructure' 
  | 'public-services' 
  | 'environment' 
  | 'community' 
  | 'safety' 
  | 'other';

export type FeedbackStatus = 
  | 'pending' 
  | 'in-review' 
  | 'in-progress' 
  | 'resolved' 
  | 'rejected';

export interface Feedback {
  id: string;
  title: string;
  description: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  upvotes: number;
  createdAt: string;
  createdBy: string;
  location?: string;
  attachments?: string[];
  officialResponse?: OfficialResponse;
}

export interface OfficialResponse {
  id: string;
  content: string;
  respondedBy: string;
  respondedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'official';
  avatarUrl?: string;
}
