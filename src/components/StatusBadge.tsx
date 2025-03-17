
import { cn } from '@/lib/utils';
import { FeedbackStatus } from '@/types/feedback';
import { Clock, CheckCircle2, XCircle, Activity, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: FeedbackStatus;
  className?: string;
  showIcon?: boolean;
}

const StatusBadge = ({ status, className, showIcon = true }: StatusBadgeProps) => {
  const getStatusConfig = (status: FeedbackStatus) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          label: 'Pending',
          className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500'
        };
      case 'in-review':
        return {
          icon: AlertCircle,
          label: 'In Review',
          className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500'
        };
      case 'in-progress':
        return {
          icon: Activity,
          label: 'In Progress',
          className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-500'
        };
      case 'resolved':
        return {
          icon: CheckCircle2,
          label: 'Resolved',
          className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500'
        };
      case 'rejected':
        return {
          icon: XCircle,
          label: 'Rejected',
          className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500'
        };
      default:
        return {
          icon: Clock,
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
        };
    }
  };

  const { icon: Icon, label, className: statusClassName } = getStatusConfig(status);

  return (
    <span className={cn('pill', statusClassName, className)}>
      {showIcon && <Icon className="h-3.5 w-3.5 mr-1" />}
      {label}
    </span>
  );
};

export default StatusBadge;
