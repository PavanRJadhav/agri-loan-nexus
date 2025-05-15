
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import SupportChatbot from "@/components/support/SupportChatbot";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

// Define categories of support questions
const supportCategories = [
  {
    title: "Loan Application",
    questions: ["How do I apply for a loan?", "What documents are required?", "What are the eligibility criteria?"]
  },
  {
    title: "Loan Management",
    questions: ["How can I check my loan status?", "How do I repay my loan?", "What if I miss a payment?"]
  },
  {
    title: "Financial Information",
    questions: ["What are the interest rates?", "How is my credit score calculated?", "What types of loans are available?"]
  },
  {
    title: "Support & Services",
    questions: ["How do I contact support?", "Are there any subsidy schemes?", "Do you offer crop insurance?"]
  }
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
              <h3 className="text-lg font-medium mb-3">Popular Topics</h3>
              
              {supportCategories.map((category, index) => (
                <div key={index} className="mb-4">
                  <h4 className="text-sm font-medium flex items-center mb-2">
                    <HelpCircle className="h-4 w-4 mr-1 text-primary" />
                    {category.title}
                  </h4>
                  <div className="space-y-2">
                    {category.questions.map((question, qIndex) => (
                      <Button 
                        key={qIndex} 
                        variant="outline" 
                        className="w-full justify-start text-left h-auto py-2 px-3 text-sm"
                        onClick={() => handleQuestionClick(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
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
