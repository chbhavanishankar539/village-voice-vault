
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  BarChart2, 
  Users, 
  Clock, 
  CheckCircle2, 
  Activity, 
  ChevronRight
} from 'lucide-react';
import { getAllFeedbacks, initializeStorage } from '@/utils/storage';
import FeedbackCard from '@/components/FeedbackCard';
import { Feedback } from '@/types/feedback';

const Index = () => {
  const [recentFeedbacks, setRecentFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    inProgress: 0,
    pending: 0
  });
  
  useEffect(() => {
    initializeStorage();
    loadData();
  }, []);
  
  const loadData = () => {
    const allFeedbacks = getAllFeedbacks();
    
    // Get the 3 most recent feedbacks
    const recent = [...allFeedbacks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
    
    setRecentFeedbacks(recent);
    
    // Calculate stats
    setStats({
      total: allFeedbacks.length,
      resolved: allFeedbacks.filter(f => f.status === 'resolved').length,
      inProgress: allFeedbacks.filter(f => f.status === 'in-progress').length,
      pending: allFeedbacks.filter(f => f.status === 'pending' || f.status === 'in-review').length
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
          
          <motion.div 
            className="container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-2xl mx-auto md:mx-0">
              <div className="text-center md:text-left space-y-4">
                <div className="pill bg-primary/10 text-primary">
                  Empowering Communities
                </div>
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                  Your Voice Matters in Our Village
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg mx-auto md:mx-0">
                  Submit feedback, track progress, and see how your ideas are shaping our community.
                </p>
                <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
                  <Link to="/submit">
                    <Button size="lg" className="rounded-full">
                      Submit Feedback
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button size="lg" variant="outline" className="rounded-full">
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
        
        {/* Stats Section */}
        <section className="py-12 bg-secondary/50">
          <div className="container">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/70 backdrop-blur-sm dark:bg-black/30 border-primary/10">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                    <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Feedback</p>
                    <h4 className="text-2xl font-semibold">{stats.total}</h4>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 backdrop-blur-sm dark:bg-black/30 border-primary/10">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Resolved</p>
                    <h4 className="text-2xl font-semibold">{stats.resolved}</h4>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 backdrop-blur-sm dark:bg-black/30 border-primary/10">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
                    <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <h4 className="text-2xl font-semibold">{stats.inProgress}</h4>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 backdrop-blur-sm dark:bg-black/30 border-primary/10">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/20">
                    <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <h4 className="text-2xl font-semibold">{stats.pending}</h4>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
        
        {/* Recent Feedback Section */}
        <section className="py-12">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Recent Feedback</h2>
              <Link to="/dashboard">
                <Button variant="ghost" className="gap-1">
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentFeedbacks.map(feedback => (
                <FeedbackCard 
                  key={feedback.id} 
                  feedback={feedback} 
                  refreshData={loadData}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-12 bg-secondary/50">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold mb-2">How It Works</h2>
              <p className="text-muted-foreground">Simple steps to make your voice heard</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="rounded-full bg-primary/10 p-4 inline-flex mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">1. Submit Feedback</h3>
                <p className="text-muted-foreground">
                  Share your ideas, concerns, or report issues in your community.
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="rounded-full bg-primary/10 p-4 inline-flex mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">2. Officials Review</h3>
                <p className="text-muted-foreground">
                  Village officials review your feedback and provide responses.
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="rounded-full bg-primary/10 p-4 inline-flex mb-4">
                  <BarChart2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">3. Track Progress</h3>
                <p className="text-muted-foreground">
                  Follow the status of your submissions and see community impact.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-6 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="font-medium">Village Feedback Hub</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Village Feedback Hub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
