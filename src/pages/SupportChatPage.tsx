
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import SupportChatbot from "@/components/support/SupportChatbot";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const SupportChatPage: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
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
      
      <Card className="h-[calc(100vh-15rem)]">
        <SupportChatbot />
      </Card>
      
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
