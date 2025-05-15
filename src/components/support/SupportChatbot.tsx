
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Send, User, HelpCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// Define structured responses for better organization
const chatResponses = {
  loanApplication: "To apply for a loan, go to your dashboard and click on 'New Application'. You'll be guided through our new step-by-step application process that includes farm details, financial information, banking details, document upload, lender selection, and final review.",
  loanStatus: "You can check the status of your loan applications on your dashboard. Applications can be pending, approved, or rejected. Once submitted, your application will be reviewed by our verification team.",
  interestRates: "Current interest rates range from 6.8% to 9.0% depending on the loan type and lending partner. You can view specific rates in the 'Lenders' section.",
  repaymentOptions: "You can repay your loan through our portal using UPI, net banking, or debit cards. Payments are processed within 24 hours.",
  requiredDocuments: "Required documents include ID proof (Aadhaar/PAN), address proof, land records, income statements, and bank statements. Our verification team will review them within 2 working days.",
  creditScore: "Your credit score is calculated based on your loan repayment history, income, and other financial factors. A score above 60 is required for loan approval.",
  contactSupport: "For additional support, please email support@agriloan.com or call our helpline at +91 1800 123 4567, available Monday to Friday, 9 AM to 6 PM.",
  missedPayment: "If you miss a payment, a late fee of 2% will be charged. Multiple missed payments may affect your credit score and future loan eligibility.",
  eligibilityCriteria: "To be eligible for a loan, you must be a farmer with valid land records, have a credit score above 60, and provide necessary documentation. Minimum income requirements vary by loan type.",
  subsidySchemes: "Various government subsidy schemes are available for farmers. These include interest subvention, crop insurance subsidies, and equipment purchase subsidies. Check the 'Subsidies' section for more details.",
  cropInsurance: "Our partners offer crop insurance that protects against natural disasters, pest attacks, and market fluctuations. Insurance premiums can be included in your loan application.",
  loanTypes: "We offer various loan types including Crop Loans, Equipment Financing, Land Development Loans, Warehouse Construction Loans, and Farm Expansion Loans. Each has different terms and interest rates."
};

// Predefined questions for the user to select from - expanded list
const predefinedQuestions = [
  { id: "loan-apply", text: "How do I apply for a loan?", response: chatResponses.loanApplication },
  { id: "loan-status", text: "How can I check my loan status?", response: chatResponses.loanStatus },
  { id: "interest", text: "What are the interest rates?", response: chatResponses.interestRates },
  { id: "repay", text: "How do I repay my loan?", response: chatResponses.repaymentOptions },
  { id: "docs", text: "What documents are required?", response: chatResponses.requiredDocuments },
  { id: "credit", text: "How is my credit score calculated?", response: chatResponses.creditScore },
  { id: "contact", text: "How do I contact support?", response: chatResponses.contactSupport },
  { id: "missed", text: "What if I miss a payment?", response: chatResponses.missedPayment },
  { id: "eligibility", text: "What are the eligibility criteria?", response: chatResponses.eligibilityCriteria },
  { id: "subsidy", text: "Are there any subsidy schemes?", response: chatResponses.subsidySchemes },
  { id: "insurance", text: "Do you offer crop insurance?", response: chatResponses.cropInsurance },
  { id: "types", text: "What types of loans are available?", response: chatResponses.loanTypes }
];

// Group questions by category for better organization
const questionCategories = [
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

const SupportChatbot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: `Hello ${user?.name || "there"}! I'm AgriBot, your virtual assistant. How can I help you today?`,
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  // Listen for question selection events from the parent component
  useEffect(() => {
    const handleSelectedQuestion = (event: CustomEvent) => {
      const question = event.detail;
      if (question) {
        handleQuestionClick(question);
      }
    };

    window.addEventListener('chatQuestion' as any, handleSelectedQuestion as EventListener);
    
    return () => {
      window.removeEventListener('chatQuestion' as any, handleSelectedQuestion as EventListener);
    };
  }, []);

  const handleQuestionClick = (questionText: string) => {
    // Add user's question to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: questionText,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setCurrentCategory(null); // Reset category view after selecting a question
    
    // Find matching predefined question
    const question = predefinedQuestions.find(q => q.text === questionText);
    
    // Simulate bot thinking
    setTimeout(() => {
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: question?.response || generateResponse(questionText),
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const generateResponse = (text: string): string => {
    const lowercaseText = text.toLowerCase();
    
    // Match user query to predefined responses
    if (lowercaseText.includes("apply") || lowercaseText.includes("application")) {
      return chatResponses.loanApplication;
    } else if (lowercaseText.includes("status") || lowercaseText.includes("check")) {
      return chatResponses.loanStatus;
    } else if (lowercaseText.includes("interest") || lowercaseText.includes("rate")) {
      return chatResponses.interestRates;
    } else if (lowercaseText.includes("repay") || lowercaseText.includes("payment")) {
      return chatResponses.repaymentOptions;
    } else if (lowercaseText.includes("document") || lowercaseText.includes("require")) {
      return chatResponses.requiredDocuments;
    } else if (lowercaseText.includes("credit") || lowercaseText.includes("score")) {
      return chatResponses.creditScore;
    } else if (lowercaseText.includes("contact") || lowercaseText.includes("support") || lowercaseText.includes("help")) {
      return chatResponses.contactSupport;
    } else if (lowercaseText.includes("miss") || lowercaseText.includes("late")) {
      return chatResponses.missedPayment;
    } else if (lowercaseText.includes("eligib")) {
      return chatResponses.eligibilityCriteria;
    } else if (lowercaseText.includes("subsid") || lowercaseText.includes("scheme")) {
      return chatResponses.subsidySchemes;
    } else if (lowercaseText.includes("insurance") || lowercaseText.includes("crop insur")) {
      return chatResponses.cropInsurance;
    } else if (lowercaseText.includes("type") || lowercaseText.includes("kind") || lowercaseText.includes("offer")) {
      return chatResponses.loanTypes;
    } else {
      return "I'm not sure I understand. Please select one of the suggested categories or questions to get the information you need.";
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const questionText = input.trim();
    setInput("");
    handleQuestionClick(questionText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleCategorySelect = (category: string) => {
    setCurrentCategory(category);
  };

  // Get questions for the current category
  const getCategoryQuestions = () => {
    const category = questionCategories.find(cat => cat.title === currentCategory);
    return category ? category.questions : [];
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary text-primary-foreground">
                {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <Card className={message.sender === 'user' ? 'bg-primary text-primary-foreground' : ''}>
                <CardContent className="p-3">
                  <p>{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <Card>
                <CardContent className="p-3">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0.2s" }}></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        {/* Category selection */}
        {!currentCategory && !isTyping && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">How can I help you today?</h3>
            <div className="grid grid-cols-2 gap-2">
              {questionCategories.map((category) => (
                <Button 
                  key={category.title} 
                  variant="outline" 
                  className="justify-start text-left"
                  onClick={() => handleCategorySelect(category.title)}
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  {category.title}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Questions for selected category */}
        {currentCategory && !isTyping && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">{currentCategory}</h3>
              <Button variant="ghost" size="sm" onClick={() => setCurrentCategory(null)}>
                Back to categories
              </Button>
            </div>
            <div className="space-y-2">
              {getCategoryQuestions().map((question) => (
                <Button 
                  key={question} 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={() => handleQuestionClick(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isTyping}
          />
          <Button type="submit" size="icon" onClick={handleSend} disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupportChatbot;
