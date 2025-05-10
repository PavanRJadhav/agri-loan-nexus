
import React, { useState } from "react";
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

const predefinedResponses: Record<string, string[]> = {
  loan: [
    "Our agricultural loans range from ₹10,000 to ₹20,00,000 with competitive interest rates.",
    "To apply for a loan, visit the 'Loan Applications' section from your dashboard.",
    "Loan approval typically takes 3-5 business days after document verification."
  ],
  payment: [
    "You can make payments through our portal using UPI, net banking, or debit cards.",
    "Payments are processed within 24 hours and reflected in your account."
  ],
  interest: [
    "Current interest rates range from 6.8% to 9.0% depending on the loan type and lending partner.",
    "You can view interest rates for each lending partner in the 'Lenders' section."
  ],
  help: [
    "I'm here to help with information about loans, payments, interest rates, and application processes.",
    "You can also contact our support team at support@agriloan.com or call +91 1800 123 4567."
  ]
};

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

  const generateResponse = (text: string): string => {
    const lowercaseText = text.toLowerCase();
    
    if (lowercaseText.includes("loan") || lowercaseText.includes("borrow") || lowercaseText.includes("credit")) {
      return predefinedResponses.loan[Math.floor(Math.random() * predefinedResponses.loan.length)];
    } else if (lowercaseText.includes("payment") || lowercaseText.includes("pay") || lowercaseText.includes("repay")) {
      return predefinedResponses.payment[Math.floor(Math.random() * predefinedResponses.payment.length)];
    } else if (lowercaseText.includes("interest") || lowercaseText.includes("rate")) {
      return predefinedResponses.interest[Math.floor(Math.random() * predefinedResponses.interest.length)];
    } else if (lowercaseText.includes("lender") || lowercaseText.includes("partner")) {
      return "You can select your preferred lending partner from the 'Lenders' section. Each lender offers different interest rates and loan limits.";
    } else if (lowercaseText.includes("document") || lowercaseText.includes("verify")) {
      return "Required documents include ID proof, address proof, land records, and income statements. Our verification team will review them within 2 working days.";
    } else {
      return predefinedResponses.help[Math.floor(Math.random() * predefinedResponses.help.length)];
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input.trim(),
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simulate bot thinking
    setTimeout(() => {
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: generateResponse(userMessage.text),
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
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
      </div>
    </div>
  );
};

export default SupportChatbot;
