
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare, MapPin } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { Feedback } from '@/types/feedback';
import { upvoteFeedback } from '@/utils/storage';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface FeedbackCardProps {
  feedback: Feedback;
  refreshData?: () => void;
}

const FeedbackCard = ({ feedback, refreshData }: FeedbackCardProps) => {
  const [isUpvoting, setIsUpvoting] = useState(false);
  const hasResponse = !!feedback.officialResponse;
  
  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsUpvoting(true);
    upvoteFeedback(feedback.id);
    setTimeout(() => {
      setIsUpvoting(false);
      if (refreshData) refreshData();
    }, 300);
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
  
  const { label: categoryLabel, color: categoryColor } = getCategoryConfig(feedback.category);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link to={`/feedback/${feedback.id}`} className="h-full block">
        <Card className={cn(
          "h-full overflow-hidden transition-all duration-300 hover:shadow-lg",
          "hover:border-primary/40 card-hover"
        )}>
          <CardHeader className="pb-2 flex flex-row justify-between items-start">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className={`pill ${categoryColor} animate-in`}>
                  {categoryLabel}
                </span>
                <StatusBadge status={feedback.status} />
              </div>
              <h3 className="text-lg font-medium leading-tight">{feedback.title}</h3>
            </div>
          </CardHeader>
          
          <CardContent className="pb-3">
            <p className="text-muted-foreground line-clamp-2">
              {feedback.description}
            </p>
            
            {feedback.location && (
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{feedback.location}</span>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="pt-0 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-7 px-2 gap-1 font-normal hover:bg-primary/10 hover:text-primary", 
                  isUpvoting && "animate-pulse-subtle"
                )}
                onClick={handleUpvote}
              >
                <ThumbsUp className={cn("h-3.5 w-3.5", isUpvoting && "text-primary")} />
                <span>{feedback.upvotes}</span>
              </Button>
              
              {hasResponse && (
                <motion.div 
                  className="flex items-center gap-1 text-xs"
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 1.5 
                  }}
                >
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  <span>Official Response</span>
                </motion.div>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground">
              <span>{formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}</span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

export default FeedbackCard;
