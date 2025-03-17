import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ThumbsUp, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  User,
  Shield 
} from 'lucide-react';
import { 
  getFeedbackById, 
  addOfficialResponse, 
  upvoteFeedback, 
  updateFeedbackStatus,
  getIsOfficial
} from '@/utils/storage';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import StatusBadge from '@/components/StatusBadge';
import { Feedback, FeedbackStatus } from '@/types/feedback';

const FeedbackDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const isOfficial = getIsOfficial();
  
  useEffect(() => {
    if (id) {
      loadFeedback(id);
    }
  }, [id]);
  
  const loadFeedback = (feedbackId: string) => {
    setLoading(true);
    setTimeout(() => {
      const loadedFeedback = getFeedbackById(feedbackId);
      if (loadedFeedback) {
        setFeedback(loadedFeedback);
      } else {
        toast({
          title: "Not Found",
          description: "The requested feedback could not be found.",
          variant: "destructive",
        });
        navigate('/dashboard');
      }
      setLoading(false);
    }, 300);
  };
  
  const handleUpvote = () => {
    if (!feedback || isUpvoting) return;
    
    setIsUpvoting(true);
    setTimeout(() => {
      const updatedFeedback = upvoteFeedback(feedback.id);
      if (updatedFeedback) {
        setFeedback(updatedFeedback);
        toast({
          title: "Upvoted",
          description: "Thank you for your vote!"
        });
      }
      setIsUpvoting(false);
    }, 300);
  };
  
  const handleAddResponse = () => {
    if (!feedback || !responseText.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      const updatedFeedback = addOfficialResponse(feedback.id, responseText);
      if (updatedFeedback) {
        setFeedback(updatedFeedback);
        setResponseText('');
        toast({
          title: "Response Added",
          description: "Your response has been added successfully."
        });
      } else {
        toast({
          title: "Error",
          description: "There was an error adding your response.",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }, 300);
  };
  
  const updateStatus = (status: FeedbackStatus) => {
    if (!feedback) return;
    
    const updatedFeedback = updateFeedbackStatus(feedback.id, status);
    if (updatedFeedback) {
      setFeedback(updatedFeedback);
      toast({
        title: "Status Updated",
        description: `The status has been updated to ${status.replace('-', ' ')}.`
      });
    } else {
      toast({
        title: "Error",
        description: "There was an error updating the status.",
        variant: "destructive",
      });
    }
  };
  
  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'infrastructure':
        return { label: 'Infrastructure', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' };
      case 'public-services':
        return { label: 'Public Services', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' };
      case 'environment':
        return { label: 'Environment', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
      case 'community':
        return { label: 'Community', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' };
      case 'safety':
        return { label: 'Safety', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
      default:
        return { label: 'Other', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' };
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24">
          <div className="container max-w-3xl py-8">
            <Card className="animate-pulse">
              <CardHeader className="h-40"></CardHeader>
              <CardContent className="h-60"></CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }
  
  if (!feedback) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24">
          <div className="container max-w-3xl py-8 text-center">
            <h1 className="text-2xl font-semibold mb-4">Feedback Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The feedback you are looking for does not exist or has been removed.
            </p>
            <Link to="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  const { label: categoryLabel, color: categoryColor } = getCategoryConfig(feedback.category);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24">
        <div className="container max-w-3xl py-8">
          <div className="mb-6">
            <Link to="/dashboard">
              <Button variant="ghost" className="pl-0 gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Feedback Header Card */}
            <Card className="overflow-hidden border-primary/20">
              <CardHeader className="pb-3 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className={`pill ${categoryColor}`}>
                    {categoryLabel}
                  </span>
                  <StatusBadge status={feedback.status} />
                </div>
                
                <h1 className="text-2xl font-semibold">{feedback.title}</h1>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    <span>{feedback.createdBy}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span title={format(new Date(feedback.createdAt), 'PPpp')}>
                      {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  {feedback.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{feedback.location}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-base whitespace-pre-line">{feedback.description}</p>
                
                <div className="flex items-center justify-between pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1.5"
                    onClick={handleUpvote}
                    disabled={isUpvoting}
                  >
                    <ThumbsUp className={`h-4 w-4 ${isUpvoting ? 'text-primary' : ''}`} />
                    <span>Upvote</span>
                    <span className="font-semibold">({feedback.upvotes})</span>
                  </Button>
                  
                  {isOfficial && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="secondary" size="sm">
                          Update Status
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Update Feedback Status</AlertDialogTitle>
                          <AlertDialogDescription>
                            Select a new status for this feedback item.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="grid grid-cols-1 gap-2 py-4">
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => {
                              updateStatus('pending');
                              const closeButton = document.querySelector('[data-shadcnui-alert-dialog-close]') as HTMLElement | null;
                              if (closeButton) closeButton.click();
                            }}
                          >
                            <StatusBadge status="pending" className="mr-2" />
                            Mark as Pending
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => {
                              updateStatus('in-review');
                              const closeButton = document.querySelector('[data-shadcnui-alert-dialog-close]') as HTMLElement | null;
                              if (closeButton) closeButton.click();
                            }}
                          >
                            <StatusBadge status="in-review" className="mr-2" />
                            Mark as In Review
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => {
                              updateStatus('in-progress');
                              const closeButton = document.querySelector('[data-shadcnui-alert-dialog-close]') as HTMLElement | null;
                              if (closeButton) closeButton.click();
                            }}
                          >
                            <StatusBadge status="in-progress" className="mr-2" />
                            Mark as In Progress
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => {
                              updateStatus('resolved');
                              const closeButton = document.querySelector('[data-shadcnui-alert-dialog-close]') as HTMLElement | null;
                              if (closeButton) closeButton.click();
                            }}
                          >
                            <StatusBadge status="resolved" className="mr-2" />
                            Mark as Resolved
                          </Button>
                          <Button 
                            variant="outline" 
                            className="justify-start"
                            onClick={() => {
                              updateStatus('rejected');
                              const closeButton = document.querySelector('[data-shadcnui-alert-dialog-close]') as HTMLElement | null;
                              if (closeButton) closeButton.click();
                            }}
                          >
                            <StatusBadge status="rejected" className="mr-2" />
                            Mark as Rejected
                          </Button>
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Official Response */}
            <AnimatePresence>
              {feedback.officialResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-primary/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <h2 className="text-lg font-medium">Official Response</h2>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {feedback.officialResponse.respondedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span title={format(new Date(feedback.officialResponse.respondedAt), 'PPpp')}>
                            {formatDistanceToNow(new Date(feedback.officialResponse.respondedAt), { addSuffix: true })}
                          </span>
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{feedback.officialResponse.content}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Add Response Section (for officials only) */}
            {isOfficial && !feedback.officialResponse && (
              <Card className="border-dashed border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <h2 className="text-lg font-medium">Add Official Response</h2>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Type your official response here..."
                    className="mb-4 min-h-32"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  />
                  <Button 
                    onClick={handleAddResponse} 
                    disabled={!responseText.trim() || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Response"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 border-t mt-8">
        <div className="container">
          <div className="flex justify-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Village Feedback Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeedbackDetail;
