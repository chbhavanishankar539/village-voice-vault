
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Calendar, Search, Plus } from 'lucide-react';
import FeedbackCard from '@/components/FeedbackCard';
import { getAllFeedbacks, filterFeedbacks, initializeStorage } from '@/utils/storage';
import { Feedback, FeedbackCategory, FeedbackStatus } from '@/types/feedback';

const Dashboard = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<FeedbackCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most-upvotes'>('newest');
  
  useEffect(() => {
    initializeStorage();
    loadFeedbacks();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [feedbacks, searchTerm, statusFilter, categoryFilter, sortBy]);
  
  const loadFeedbacks = () => {
    setIsLoading(true);
    setTimeout(() => {
      const data = getAllFeedbacks();
      setFeedbacks(data);
      setFilteredFeedbacks(data);
      setIsLoading(false);
    }, 300);
  };
  
  const applyFilters = () => {
    const filtered = filterFeedbacks(feedbacks, {
      status: statusFilter,
      category: categoryFilter,
      search: searchTerm,
      sortBy: sortBy
    });
    setFilteredFeedbacks(filtered);
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setSortBy('newest');
  };
  
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'public-services', label: 'Public Services' },
    { value: 'environment', label: 'Environment' },
    { value: 'community', label: 'Community' },
    { value: 'safety', label: 'Safety' },
    { value: 'other', label: 'Other' }
  ];
  
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-review', label: 'In Review' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' }
  ];
  
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most-upvotes', label: 'Most Upvotes' }
  ];
  
  const getStatistics = () => {
    const totalCount = feedbacks.length;
    const pendingCount = feedbacks.filter(f => f.status === 'pending').length;
    const inReviewCount = feedbacks.filter(f => f.status === 'in-review').length;
    const inProgressCount = feedbacks.filter(f => f.status === 'in-progress').length;
    const resolvedCount = feedbacks.filter(f => f.status === 'resolved').length;
    const rejectedCount = feedbacks.filter(f => f.status === 'rejected').length;
    
    const categories: Record<string, number> = {};
    feedbacks.forEach(feedback => {
      categories[feedback.category] = (categories[feedback.category] || 0) + 1;
    });
    
    return {
      counts: {
        total: totalCount,
        pending: pendingCount,
        inReview: inReviewCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
        rejected: rejectedCount
      },
      categories
    };
  };
  
  const stats = getStatistics();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="container py-6">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <h1 className="text-3xl font-semibold">Feedback Dashboard</h1>
              <p className="text-muted-foreground">
                Browse, search, and filter community feedback
              </p>
            </div>
            <Link to="/submit">
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                <span>Submit Feedback</span>
              </Button>
            </Link>
          </motion.div>
          
          <Tabs defaultValue="all-feedback" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all-feedback">All Feedback</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all-feedback" className="space-y-6">
              {/* Filter Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Filter Feedback</CardTitle>
                  <CardDescription>
                    Use the filters below to find specific feedback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search feedback..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Select
                      value={categoryFilter}
                      onValueChange={(value) => setCategoryFilter(value as FeedbackCategory | 'all')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => setStatusFilter(value as FeedbackStatus | 'all')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </Button>
                    
                    <Select
                      value={sortBy}
                      onValueChange={(value) => setSortBy(value as 'newest' | 'oldest' | 'most-upvotes')}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              {/* Results Section */}
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {isLoading ? (
                  // Skeleton loaders
                  Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="opacity-50 animate-pulse">
                      <CardHeader className="h-24" />
                      <CardContent className="h-32" />
                    </Card>
                  ))
                ) : filteredFeedbacks.length > 0 ? (
                  filteredFeedbacks.map(feedback => (
                    <FeedbackCard 
                      key={feedback.id} 
                      feedback={feedback}
                      refreshData={loadFeedbacks}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground">No feedback found matching your filters.</p>
                    <Button 
                      variant="link" 
                      onClick={resetFilters} 
                      className="mt-2"
                    >
                      Reset filters
                    </Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="statistics" className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium">
                        Total Feedback
                      </CardTitle>
                      <CardDescription>
                        All time submissions
                      </CardDescription>
                    </div>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.counts.total}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.counts.resolved} resolved ({Math.round((stats.counts.resolved / stats.counts.total) * 100) || 0}%)
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium">
                        In Progress
                      </CardTitle>
                      <CardDescription>
                        Being actively addressed
                      </CardDescription>
                    </div>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.counts.inProgress}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.counts.inReview} in review
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium">
                        Pending
                      </CardTitle>
                      <CardDescription>
                        Awaiting initial review
                      </CardDescription>
                    </div>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.counts.pending}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.counts.rejected} rejected
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Feedback by Category</CardTitle>
                  <CardDescription>
                    Distribution of feedback across different categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.categories).map(([category, count]) => {
                      const percentage = Math.round((count / stats.counts.total) * 100) || 0;
                      let categoryName = '';
                      let barColor = '';
                      
                      switch(category) {
                        case 'infrastructure':
                          categoryName = 'Infrastructure';
                          barColor = 'bg-sky-500';
                          break;
                        case 'public-services':
                          categoryName = 'Public Services';
                          barColor = 'bg-indigo-500';
                          break;
                        case 'environment':
                          categoryName = 'Environment';
                          barColor = 'bg-emerald-500';
                          break;
                        case 'community':
                          categoryName = 'Community';
                          barColor = 'bg-orange-500';
                          break;
                        case 'safety':
                          categoryName = 'Safety';
                          barColor = 'bg-red-500';
                          break;
                        default:
                          categoryName = 'Other';
                          barColor = 'bg-gray-500';
                      }
                      
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{categoryName}</span>
                            <span className="text-muted-foreground">{count} ({percentage}%)</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full ${barColor}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Feedback by Status</CardTitle>
                  <CardDescription>
                    Current status of all feedback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { key: 'pending', name: 'Pending', color: 'bg-amber-500' },
                      { key: 'inReview', name: 'In Review', color: 'bg-blue-500' },
                      { key: 'inProgress', name: 'In Progress', color: 'bg-purple-500' },
                      { key: 'resolved', name: 'Resolved', color: 'bg-green-500' },
                      { key: 'rejected', name: 'Rejected', color: 'bg-red-500' }
                    ].map((status) => {
                      const count = stats.counts[status.key as keyof typeof stats.counts];
                      const percentage = Math.round((count / stats.counts.total) * 100) || 0;
                      
                      return (
                        <div key={status.key} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{status.name}</span>
                            <span className="text-muted-foreground">{count} ({percentage}%)</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full ${status.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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

export default Dashboard;
