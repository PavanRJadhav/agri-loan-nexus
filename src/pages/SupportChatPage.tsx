
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

const SupportChatPage: React.FC = () => {
  const [message, setMessage] = useState("");
  
  // Mock chat data - in a real app, this would be managed with state and API calls
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "system", text: "Welcome to AgriLoan Support! How can we help you today?", timestamp: "10:30 AM" },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    const newUserMessage = {
      id: chatMessages.length + 1,
      sender: "user",
      text: message,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setChatMessages([...chatMessages, newUserMessage]);
    setMessage("");
    
    // Simulate automated response after a short delay
    setTimeout(() => {
      const autoResponse = {
        id: chatMessages.length + 2,
        sender: "system",
        text: "Thank you for your message. Our support team will respond shortly. For urgent inquiries, please call our helpline at 1800-AGRI-HELP.",
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      setChatMessages(prev => [...prev, autoResponse]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Support Chat</h2>
        <p className="text-muted-foreground">
          Get help from our support team.
        </p>
      </div>
      
      <Card className="h-[calc(100vh-220px)] flex flex-col">
        <CardHeader>
          <CardTitle>Live Chat Support</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4 mb-4">
            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === 'user' 
                        ? 'bg-agriloan-primary text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`text-xs mt-1 block text-right ${
                      msg.sender === 'user' ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2 mt-auto">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="bg-agriloan-primary">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportChatPage;
