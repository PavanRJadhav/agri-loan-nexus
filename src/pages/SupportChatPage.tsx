
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import SupportChatbot from "@/components/support/SupportChatbot";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

// Define common questions that users might ask - these match the available responses in the chatbot
const commonQuestions = [
  "How do I apply for a loan?",
  "What are the interest rates?",
  "How can I check my loan status?",
  "How do I repay my loan?",
  "What documents are required?",
  "How is my credit score calculated?",
  "How do I contact support?",
  "What if I miss a payment?"
];

const SupportChatPage: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Effect to handle selected questions is now handled within the SupportChatbot component
  
  const handleToggleNotifications = (checked: boolean) => {
    setEmailNotifications(checked);
    
    if (checked) {
      toast.success("Email notifications enabled", {
        description: `You will now receive emails for important activities.`
      });
    } else {
      toast.info("Email notifications disabled", {
        description: `You will no longer receive emails for activities.`
      });
    }
  };
  
  const handleQuestionClick = (question: string) => {
    // Create a custom event for the chatbot to listen to
    const event = new CustomEvent('chatQuestion', { detail: question });
    window.dispatchEvent(event);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Support Chat</h2>
          <p className="text-muted-foreground">
            Chat with our virtual assistant for quick help and information
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Email notifications</span>
          <Switch 
            checked={emailNotifications}
            onCheckedChange={handleToggleNotifications}
          />
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-3/4">
          <Card className="h-[calc(100vh-15rem)]">
            <SupportChatbot />
          </Card>
        </div>
        
        <div className="lg:w-1/4 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-3">Common Questions</h3>
              <div className="space-y-2">
                {commonQuestions.map((question, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => handleQuestionClick(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>
          You will {emailNotifications ? '' : 'not '} 
          receive email notifications at {user?.email} for:
        </p>
        {emailNotifications && (
          <ul className="list-disc pl-5 mt-2">
            <li>Loan application submissions</li>
            <li>Loan approvals and rejections</li>
            <li>Profile updates</li>
            <li>Lender selections</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default SupportChatPage;
