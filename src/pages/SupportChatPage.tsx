
import React from "react";
import { Card } from "@/components/ui/card";
import SupportChatbot from "@/components/support/SupportChatbot";

const SupportChatPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Support Chat</h2>
        <p className="text-muted-foreground">
          Chat with our virtual assistant for quick help and information
        </p>
      </div>
      
      <Card className="h-[calc(100vh-15rem)]">
        <SupportChatbot />
      </Card>
    </div>
  );
};

export default SupportChatPage;
