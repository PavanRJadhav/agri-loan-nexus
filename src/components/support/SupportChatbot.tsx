
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Loader } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';

// Predefined responses for common questions
const predefinedResponses: Record<string, string> = {
  "How do I apply for a crop loan?": 
    "To apply for a crop loan, go to the dashboard and click on 'New Loan Application'. Select 'Crop Loan' as your loan type, and follow the 5-step application process. You'll need to provide farm details, financial information, required documents, and banking information before submitting your application.",
  
  "What documents are required for loan application?": 
    "For loan applications, you'll need to provide: 1) Proof of identity (Aadhar card, voter ID), 2) Land ownership documents, 3) Bank statements for the last 6 months, 4) Income proof or previous harvest records, 5) Any existing loan statements if applicable. Additional documents may be requested based on the specific loan type.",
  
  "What are the eligibility criteria for farmers?": 
    "To be eligible for our agricultural loans, you need to: 1) Be a farmer with verifiable farming activities, 2) Have a minimum credit score of 60, 3) Own or lease agricultural land, 4) Have no significant loan defaults in the past, 5) Be between 21-65 years of age. Different loan types may have additional specific requirements.",
  
  "How long does loan approval take?": 
    "Typically, loan applications are processed within 3-5 business days. Once submitted, your application will be reviewed by our verification team. You can check the status in your dashboard under 'Recent Applications'. Approval times may vary based on document verification and credit assessment.",
  
  "Can I apply for multiple loans?": 
    "Yes, you can apply for multiple loans, but approval will depend on your repayment capacity and credit score. We recommend finishing the repayment of existing loans before applying for new ones to maintain a good credit score and increase chances of approval.",
  
  "How can I check my loan status?": 
    "You can check your loan status in the dashboard under 'Recent Applications'. Each application will show as 'Pending', 'Approved', or 'Rejected'. You'll also receive email notifications (if enabled) when your loan status changes.",
  
  "What is the procedure to repay my loan?": 
    "To repay your loan, go to the 'Repay Loan' section from your dashboard. You can choose to make full or partial payments. The system accepts repayments through various methods including bank transfer, UPI, and credit/debit cards. Each repayment is recorded in your transaction history.",
  
  "What happens if I miss a payment?": 
    "Missing a payment may affect your credit score and attract late payment fees. If you anticipate difficulty making a payment, contact our support team immediately. We may be able to offer payment restructuring options. Multiple missed payments could result in loan default and affect future loan eligibility.",
  
  "Can I make partial loan repayments?": 
    "Yes, you can make partial loan repayments at any time without penalty. Go to the 'Repay Loan' section and enter the amount you wish to pay. Partial payments reduce your outstanding balance and future interest accrual. We encourage regular partial payments to reduce overall interest costs.",
  
  "Are there prepayment penalties?": 
    "No, there are no prepayment penalties for any of our agricultural loans. You can pay off your loan early without incurring additional charges. Early repayment can help improve your credit score and make you eligible for higher loan amounts in the future.",
  
  "What are the current interest rates for agricultural loans?": 
    "Interest rates for agricultural loans typically range from 7% to 12% annually, depending on the loan type, amount, and your credit score. Crop loans usually have the lowest rates at 7-9%, while equipment loans range from 9-12%. Higher credit scores qualify for better interest rates.",
  
  "How is my credit score calculated?": 
    "Your credit score is calculated based on several factors including: 1) Loan repayment history, 2) Current debt levels, 3) Length of credit history, 4) Types of credit used, 5) Farm productivity and income records. Maintaining timely repayments is the most important factor for a good credit score.",
  
  "What types of farm loans are available?": 
    "We offer several types of agricultural loans: 1) Crop Loans for seasonal farming expenses, 2) Equipment Loans for purchasing machinery, 3) Kisan Credit Card Loans for revolving credit, 4) Irrigation Loans for water management systems, and 5) Land Development Loans for improving agricultural land.",
  
  "Are there any seasonal loan options?": 
    "Yes, we offer seasonal crop loans specifically designed to align with planting and harvest cycles. These loans provide funds before planting season and have repayment schedules timed with harvest periods. Seasonal loans typically have flexible terms to accommodate agricultural cycles.",
  
  "What subsidies are available for organic farming?": 
    "Several government subsidies support organic farming, including the Paramparagat Krishi Vikas Yojana (PKVY) and Mission Organic Value Chain Development (MOVCD). These programs offer financial assistance for certification, inputs, and marketing of organic produce. Our loan officers can help you apply for these subsidies.",
  
  "How do I contact customer support?": 
    "You can contact our customer support team through multiple channels: 1) Chat with us in this support section, 2) Email us at support@agriloan.com, 3) Call our toll-free number at 1800-123-4567, available Monday to Saturday, 9 AM to 6 PM. We typically respond to all queries within 24 hours.",
  
  "What government subsidy schemes can I access?": 
    "Through our platform, farmers can access various government schemes such as PM-KISAN, Kisan Credit Card, Soil Health Card, Pradhan Mantri Fasal Bima Yojana (crop insurance), and subsidies for micro-irrigation and farm mechanization. Our team can guide you through the application process for these schemes.",
  
  "Do you offer crop insurance with loans?": 
    "Yes, we provide the option to bundle crop insurance with your loan. The Pradhan Mantri Fasal Bima Yojana (PMFBY) can be integrated with your loan application. Insurance premiums can be included in your loan amount, providing protection against crop failures due to natural calamities.",
  
  "Are there field officers who can visit my farm?": 
    "Yes, we have field officers who can visit your farm for verification and assessment. During the loan application process, you can request a farm visit. Our officers provide guidance on improving farm productivity and can assist with documentation requirements for loan applications.",
  
  "How can I update my farming profile?": 
    "To update your farming profile, go to the 'Profile' section in your dashboard. Here you can update information about your land holdings, types of crops grown, irrigation facilities, equipment owned, and other farming details. Keeping your profile updated helps us provide more relevant loan options."
};

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface SupportChatbotProps {
  selectedQuestion?: string | null;
}

const SupportChatbot: React.FC<SupportChatbotProps> = ({ selectedQuestion }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: "Hello! I'm your AgriLoan virtual assistant. How can I help you with your farming financial needs today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Handle external question selection
  useEffect(() => {
    const handleExternalQuestion = (event: CustomEvent) => {
      const question = event.detail;
      if (question) {
        handleUserMessage(question);
      }
    };

    // Add event listener for custom event
    window.addEventListener('chatQuestion' as any, handleExternalQuestion as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('chatQuestion' as any, handleExternalQuestion as EventListener);
    };
  }, []);
  
  // Handle selected question from props
  useEffect(() => {
    if (selectedQuestion) {
      handleUserMessage(selectedQuestion);
    }
  }, [selectedQuestion]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleUserMessage = (text: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate bot typing
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      const botMessage: ChatMessage = {
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };
  
  const getBotResponse = (text: string): string => {
    // Check if we have a predefined response
    for (const [question, answer] of Object.entries(predefinedResponses)) {
      if (text.toLowerCase().includes(question.toLowerCase()) || 
          question.toLowerCase().includes(text.toLowerCase())) {
        return answer;
      }
    }
    
    // General responses for common keywords
    if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
      return `Hello ${user?.name || 'there'}! How can I help you today?`;
    }
    
    if (text.toLowerCase().includes('thanks') || text.toLowerCase().includes('thank you')) {
      return "You're welcome! Is there anything else I can help you with?";
    }
    
    if (text.toLowerCase().includes('loan')) {
      return "We offer various types of agricultural loans including crop loans, equipment loans, and development loans. To apply, go to the Dashboard and click on 'New Loan Application'. Is there a specific loan you're interested in?";
    }
    
    if (text.toLowerCase().includes('interest') || text.toLowerCase().includes('rate')) {
      return "Our interest rates vary by loan type, typically ranging from 7% to 12% annually. Crop loans usually have the lowest rates. Your personal rate depends on your credit score and loan amount.";
    }
    
    // Default response
    return "I'm not sure I understand your question. Could you please rephrase or select one of the common questions from the right panel?";
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleUserMessage(input);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center">
          <Bot className="mr-2 h-5 w-5 text-primary" />
          <div>
            <h3 className="font-medium">AgriLoan Assistant</h3>
            <p className="text-xs text-muted-foreground">Online • Quick responses</p>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-start gap-2">
                  {msg.sender === 'bot' && (
                    <Bot className="h-5 w-5 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {msg.sender === 'user' && (
                    <User className="h-5 w-5 mt-0.5" />
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  <Loader className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Typing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSubmit} className="p-4 border-t bg-background flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default SupportChatbot;
