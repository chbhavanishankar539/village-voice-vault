
import { Feedback, FeedbackStatus, User } from '@/types/feedback';

// Local storage keys
const FEEDBACKS_KEY = 'village_feedbacks';
const USERS_KEY = 'village_users';
const CURRENT_USER_KEY = 'village_current_user';

// Initial dummy data
const initialFeedbacks: Feedback[] = [
  {
    id: '1',
    title: 'Broken Street Lights on Main Street',
    description: 'Several street lights are not working on Main Street between Oak Avenue and Pine Road. This has created a safety concern for pedestrians at night.',
    category: 'infrastructure',
    status: 'in-progress',
    upvotes: 24,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    createdBy: 'Jane Smith',
    location: 'Main Street',
    officialResponse: {
      id: '1-response',
      content: 'Thank you for reporting this issue. Our maintenance team has been notified and will repair the lights within the next 48 hours.',
      respondedBy: 'Tom Johnson',
      respondedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    }
  },
  {
    id: '2',
    title: 'Request for Additional Trash Bins in Village Park',
    description: 'The village park is experiencing litter problems, especially on weekends. Additional trash bins would help maintain cleanliness.',
    category: 'environment',
    status: 'pending',
    upvotes: 18,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    createdBy: 'Michael Brown',
    location: 'Village Park',
  },
  {
    id: '3',
    title: 'Community Garden Proposal',
    description: 'I would like to propose establishing a community garden on the vacant lot at the corner of Elm Street and River Road. This would provide fresh produce and foster community engagement.',
    category: 'community',
    status: 'in-review',
    upvotes: 32,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    createdBy: 'Sarah Johnson',
    location: 'Elm Street and River Road',
  },
  {
    id: '4',
    title: 'Speeding Issues on Residential Streets',
    description: 'Cars are consistently speeding on Cedar Avenue, creating danger for children and pets. I request additional speed bumps or enforcement.',
    category: 'safety',
    status: 'resolved',
    upvotes: 45,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    createdBy: 'David Williams',
    location: 'Cedar Avenue',
    officialResponse: {
      id: '4-response',
      content: 'We have installed new speed bumps and added additional patrol during peak hours. Please let us know if the situation improves.',
      respondedBy: 'Chief Roberts',
      respondedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    }
  }
];

const initialUsers: User[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'citizen',
  },
  {
    id: '2',
    name: 'Tom Johnson',
    email: 'tom.johnson@example.com',
    role: 'official',
  }
];

// Initialize local storage with dummy data if it doesn't exist
export const initializeStorage = (): void => {
  if (!localStorage.getItem(FEEDBACKS_KEY)) {
    localStorage.setItem(FEEDBACKS_KEY, JSON.stringify(initialFeedbacks));
  }
  
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  }
  
  if (!localStorage.getItem(CURRENT_USER_KEY)) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(initialUsers[0]));
  }
};

// Feedback related functions
export const getAllFeedbacks = (): Feedback[] => {
  const feedbacksJson = localStorage.getItem(FEEDBACKS_KEY);
  return feedbacksJson ? JSON.parse(feedbacksJson) : [];
};

export const getFeedbackById = (id: string): Feedback | undefined => {
  const feedbacks = getAllFeedbacks();
  return feedbacks.find(feedback => feedback.id === id);
};

export const addFeedback = (feedback: Omit<Feedback, 'id' | 'createdAt' | 'upvotes'>): Feedback => {
  const feedbacks = getAllFeedbacks();
  const currentUser = getCurrentUser();
  
  const newFeedback: Feedback = {
    ...feedback,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    upvotes: 0,
    createdBy: currentUser?.name || 'Anonymous',
    status: 'pending',
  };
  
  localStorage.setItem(FEEDBACKS_KEY, JSON.stringify([newFeedback, ...feedbacks]));
  return newFeedback;
};

export const updateFeedback = (id: string, updates: Partial<Feedback>): Feedback | undefined => {
  const feedbacks = getAllFeedbacks();
  const index = feedbacks.findIndex(feedback => feedback.id === id);
  
  if (index === -1) return undefined;
  
  const updatedFeedback = { ...feedbacks[index], ...updates };
  feedbacks[index] = updatedFeedback;
  
  localStorage.setItem(FEEDBACKS_KEY, JSON.stringify(feedbacks));
  return updatedFeedback;
};

export const updateFeedbackStatus = (id: string, status: FeedbackStatus): Feedback | undefined => {
  return updateFeedback(id, { status });
};

export const upvoteFeedback = (id: string): Feedback | undefined => {
  const feedback = getFeedbackById(id);
  if (!feedback) return undefined;
  
  return updateFeedback(id, { upvotes: feedback.upvotes + 1 });
};

export const addOfficialResponse = (
  feedbackId: string, 
  content: string
): Feedback | undefined => {
  const feedback = getFeedbackById(feedbackId);
  if (!feedback) return undefined;
  
  const currentUser = getCurrentUser();
  if (!currentUser) return undefined;
  
  const officialResponse = {
    id: `${feedbackId}-response-${Date.now()}`,
    content,
    respondedBy: currentUser.name,
    respondedAt: new Date().toISOString()
  };
  
  return updateFeedback(feedbackId, { 
    officialResponse,
    status: 'in-progress' 
  });
};

// User related functions
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getIsOfficial = (): boolean => {
  const currentUser = getCurrentUser();
  return currentUser?.role === 'official';
};

// Helper function to filter feedbacks by various criteria
export const filterFeedbacks = (
  feedbacks: Feedback[],
  filters: {
    status?: FeedbackStatus | 'all',
    category?: string | 'all',
    search?: string,
    sortBy?: 'newest' | 'oldest' | 'most-upvotes'
  }
): Feedback[] => {
  let filtered = [...feedbacks];
  
  // Filter by status
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(feedback => feedback.status === filters.status);
  }
  
  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(feedback => feedback.category === filters.category);
  }
  
  // Filter by search term
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(feedback => 
      feedback.title.toLowerCase().includes(searchLower) || 
      feedback.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort feedbacks
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'most-upvotes':
        filtered.sort((a, b) => b.upvotes - a.upvotes);
        break;
    }
  }
  
  return filtered;
};
