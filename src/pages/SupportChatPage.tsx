
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SupportChatbot from "@/components/support/SupportChatbot";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { HelpCircle, ChevronRight, MessageCircle, Tractor, Sprout, CreditCard, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define categories of support questions with more agricultural context
const supportCategories = [
  {
    id: "loan",
    title: "Loan Application",
    icon: FileText,
    questions: [
      "How do I apply for a crop loan?", 
      "What documents are required for loan application?", 
      "What are the eligibility criteria for farmers?",
      "How long does loan approval take?",
      "Can I apply for multiple loans?"
    ]
  },
  {
    id: "repayment",
    title: "Loan Management",
    icon: CreditCard,
    questions: [
      "How can I check my loan status?", 
      "What is the procedure to repay my loan?", 
      "What happens if I miss a payment?",
      "Can I make partial loan repayments?",
      "Are there prepayment penalties?"
    ]
  },
  {
    id: "finance",
    title: "Financial Information",
    icon: Sprout,
    questions: [
      "What are the current interest rates for agricultural loans?", 
      "How is my credit score calculated?", 
      "What types of farm loans are available?",
      "Are there any seasonal loan options?",
      "What subsidies are available for organic farming?"
    ]
  },
  {
    id: "support",
    title: "Support & Services",
    icon: Tractor,
    questions: [
      "How do I contact customer support?", 
      "What government subsidy schemes can I access?", 
      "Do you offer crop insurance with loans?",
      "Are there field officers who can visit my farm?",
      "How can I update my farming profile?"
    ]
  }
];

const SupportChatPage: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("loan");
  const { user } = useAuth();
  
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
    setSelectedQuestion(question);
    // Create a custom event for the chatbot to listen to
    const event = new CustomEvent('chatQuestion', { detail: question });
    window.dispatchEvent(event);
    
    // Also show toast to confirm selection
    toast.info("Question selected", {
      description: "Your question has been sent to the virtual assistant."
    });
  };
  
  // Find the active category based on the active tab
  const activeCategory = supportCategories.find(cat => cat.id === activeTab) || supportCategories[0];
  
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
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4">
          <Card className="h-[calc(100vh-15rem)]">
            <SupportChatbot selectedQuestion={selectedQuestion} />
          </Card>
        </div>
        
        <div className="lg:w-1/4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-primary" />
                Common Questions
              </CardTitle>
              <CardDescription>
                Select a category to find answers to common questions
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="loan" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4">
                  {supportCategories.map(category => (
                    <TabsTrigger key={category.id} value={category.id} className="text-xs">
                      <category.icon className="h-4 w-4" />
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2 flex items-center">
                    <activeCategory.icon className="h-4 w-4 mr-2 text-primary" />
                    {activeCategory.title}
                  </h3>
                  
                  <div className="space-y-2">
                    {activeCategory.questions.map((question, idx) => (
                      <Button 
                        key={idx}
                        variant="outline"
                        className="w-full justify-between text-left h-auto py-3 px-3 text-sm hover:bg-gray-50"
                        onClick={() => handleQuestionClick(question)}
                      >
                        <span>{question}</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Button>
                    ))}
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                Need More Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Can't find what you're looking for? Contact our support team.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
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
