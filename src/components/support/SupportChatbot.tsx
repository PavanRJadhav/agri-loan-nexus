
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Send, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// Define structured responses for better organization
const chatResponses = {
  loanApplication: "To apply for a loan, go to your dashboard and click on 'New Application'. You'll need to select a lender first if you haven't already.",
  loanStatus: "You can check the status of your loan applications on your dashboard. Applications can be pending, approved, or rejected.",
  interestRates: "Current interest rates range from 6.8% to 9.0% depending on the loan type and lending partner. You can view specific rates in the 'Lenders' section.",
  repaymentOptions: "You can repay your loan through our portal using UPI, net banking, or debit cards. Payments are processed within 24 hours.",
  requiredDocuments: "Required documents include ID proof, address proof, land records, and income statements. Our verification team will review them within 2 working days.",
  creditScore: "Your credit score is calculated based on your loan repayment history, income, and other financial factors. A score above 60 is required for loan approval.",
  contactSupport: "For additional support, please email support@agriloan.com or call our helpline at +91 1800 123 4567, available Monday to Friday, 9 AM to 6 PM.",
  missedPayment: "If you miss a payment, a late fee of 2% will be charged. Multiple missed payments may affect your credit score and future loan eligibility."
};

// Predefined questions for the user to select from
const predefinedQuestions = [
  { id: "loan-apply", text: "How do I apply for a loan?", response: chatResponses.loanApplication },
  { id: "loan-status", text: "How can I check my loan status?", response: chatResponses.loanStatus },
  { id: "interest", text: "What are the interest rates?", response: chatResponses.interestRates },
  { id: "repay", text: "How do I repay my loan?", response: chatResponses.repaymentOptions },
  { id: "docs", text: "What documents are required?", response: chatResponses.requiredDocuments },
  { id: "credit", text: "How is my credit score calculated?", response: chatResponses.creditScore },
  { id: "contact", text: "How do I contact support?", response: chatResponses.contactSupport },
  { id: "missed", text: "What if I miss a payment?", response: chatResponses.missedPayment }
];

const SupportChatbot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: `Hello ${user?.name || "there"}! I'm AgriBot, your virtual assistant. Please select a question below or type your query.`,
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<typeof predefinedQuestions>(predefinedQuestions);

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
      
      // Update suggested questions based on the current question
      updateSuggestedQuestions(questionText);
    }, 800);
  };

  const updateSuggestedQuestions = (currentQuestion: string) => {
    // Filter out the current question and shuffle the remaining ones
    const filteredQuestions = predefinedQuestions
      .filter(q => q.text !== currentQuestion)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    setSuggestedQuestions(filteredQuestions);
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
    } else {
      return "I'm not sure I understand. Could you please select one of the suggested questions or rephrase your query?";
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
        
        {/* Suggested questions after bot response */}
        {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && !isTyping && (
          <div className="flex flex-wrap gap-2 mt-3 ml-12">
            {suggestedQuestions.slice(0, 3).map(question => (
              <Button 
                key={question.id}
                variant="outline" 
                size="sm" 
                onClick={() => handleQuestionClick(question.text)}
                className="text-xs"
              >
                {question.text}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t p-4">
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
        
        {/* Quick question buttons */}
        <div className="flex flex-wrap gap-2 mt-3">
          {predefinedQuestions.slice(0, 4).map(question => (
            <Button 
              key={question.id}
              variant="ghost" 
              size="sm" 
              onClick={() => handleQuestionClick(question.text)}
              className="text-xs"
            >
              {question.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportChatbot;
