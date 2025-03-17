
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addFeedback } from '@/utils/storage';
import { FeedbackCategory } from '@/types/feedback';

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }).max(100, {
    message: "Title must not exceed 100 characters.",
  }),
  category: z.enum(['infrastructure', 'public-services', 'environment', 'community', 'safety', 'other'], {
    required_error: "Please select a category.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }).max(500, {
    message: "Description must not exceed 500 characters.",
  }),
  location: z.string().optional(),
  submitterName: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }).max(50, {
    message: "Name must not exceed 50 characters."
  }).optional(),
  isAnonymous: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const Submit = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: undefined,
      description: "",
      location: "",
      submitterName: "",
      isAnonymous: false,
    },
  });

  const isAnonymous = form.watch("isAnonymous");

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Determine the creator name based on anonymous choice
      let createdBy = "Anonymous";
      if (!values.isAnonymous && values.submitterName && values.submitterName.trim()) {
        createdBy = values.submitterName.trim();
      }

      const newFeedback = addFeedback({
        title: values.title,
        category: values.category as FeedbackCategory,
        description: values.description,
        location: values.location,
        status: 'pending',
        createdBy: createdBy,
      });

      toast({
        title: "Feedback Submitted",
        description: "Your feedback has been successfully submitted.",
      });

      setTimeout(() => {
        navigate(`/feedback/${newFeedback.id}`);
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <motion.div 
          className="container max-w-2xl py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold mb-2">Submit Feedback</h1>
            <p className="text-muted-foreground">
              Share your ideas, concerns, or report issues in your community
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Anonymous checkbox */}
                <FormField
                  control={form.control}
                  name="isAnonymous"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Submit anonymously</FormLabel>
                        <FormDescription>
                          Check this if you prefer not to share your name
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submitter name field */}
                {!isAnonymous && (
                  <FormField
                    control={form.control}
                    name="submitterName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your name" 
                            {...field} 
                            className="bg-white/50 dark:bg-black/10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Brief summary of your feedback" 
                          {...field} 
                          className="bg-white/50 dark:bg-black/10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white/50 dark:bg-black/10">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="public-services">Public Services</SelectItem>
                          <SelectItem value="environment">Environment</SelectItem>
                          <SelectItem value="community">Community</SelectItem>
                          <SelectItem value="safety">Safety</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide details about your feedback..." 
                          className="min-h-32 bg-white/50 dark:bg-black/10"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Specific location related to your feedback" 
                          {...field} 
                          className="bg-white/50 dark:bg-black/10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t">
        <div className="container">
          <div className="flex justify-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Village Feedback Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Submit;
