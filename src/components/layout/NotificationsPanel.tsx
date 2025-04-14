
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, Clock, FileText } from "lucide-react";

interface NotificationProps {
  title: string;
  description: string;
  time: string;
  type: "loan" | "system" | "payment";
  isRead: boolean;
}

const Notification: React.FC<NotificationProps> = ({ title, description, time, type, isRead }) => {
  const getIcon = () => {
    switch (type) {
      case "loan":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "payment":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "system":
        return <Bell className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className={`p-3 border-b ${!isRead ? "bg-blue-50" : ""}`}>
      <div className="flex gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1 space-y-1">
          <p className={`text-sm ${!isRead ? "font-medium" : ""}`}>{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
        {!isRead && (
          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
        )}
      </div>
    </div>
  );
};

interface NotificationsPanelProps {
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  // Mock notifications data - in a real app would come from an API
  const notifications = [
    {
      id: 1,
      title: "Loan Application Update",
      description: "Your recent loan application has been approved.",
      time: "10 minutes ago",
      type: "loan" as const,
      isRead: false
    },
    {
      id: 2,
      title: "Payment Due Soon",
      description: "You have a payment due in 5 days.",
      time: "2 hours ago",
      type: "payment" as const,
      isRead: false
    },
    {
      id: 3,
      title: "New Feature Available",
      description: "You can now apply for credit cards through our app.",
      time: "Yesterday",
      type: "system" as const,
      isRead: true
    },
    {
      id: 4,
      title: "Document Verification",
      description: "Please upload your updated land documents.",
      time: "2 days ago",
      type: "loan" as const,
      isRead: true
    },
    {
      id: 5,
      title: "Payment Confirmation",
      description: "Your recent payment of ₹5,000 was successful.",
      time: "1 week ago",
      type: "payment" as const,
      isRead: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const loanNotifications = notifications.filter(n => n.type === "loan");
  const paymentNotifications = notifications.filter(n => n.type === "payment");
  const systemNotifications = notifications.filter(n => n.type === "system");

  return (
    <div className="w-full sm:w-96 bg-white rounded-md shadow-lg border overflow-hidden flex flex-col max-h-[80vh]">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-medium">Notifications</h3>
          <p className="text-sm text-muted-foreground">{unreadCount} unread messages</p>
        </div>
        <div className="flex gap-2">
          <button 
            className="text-xs text-blue-600 hover:text-blue-800"
            onClick={() => console.log("Mark all as read")}
          >
            Mark all as read
          </button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <div className="px-1.5 pt-1.5">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="loan">Loans</TabsTrigger>
            <TabsTrigger value="payment">Payments</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
        </div>
        
        <ScrollArea className="flex-1">
          <TabsContent value="all" className="m-0">
            {notifications.map(notification => (
              <Notification key={notification.id} {...notification} />
            ))}
          </TabsContent>
          
          <TabsContent value="loan" className="m-0">
            {loanNotifications.map(notification => (
              <Notification key={notification.id} {...notification} />
            ))}
          </TabsContent>
          
          <TabsContent value="payment" className="m-0">
            {paymentNotifications.map(notification => (
              <Notification key={notification.id} {...notification} />
            ))}
          </TabsContent>
          
          <TabsContent value="system" className="m-0">
            {systemNotifications.map(notification => (
              <Notification key={notification.id} {...notification} />
            ))}
          </TabsContent>
        </ScrollArea>
      </Tabs>
      
      <div className="p-3 border-t">
        <button 
          className="w-full py-2 text-center text-sm text-blue-600 hover:text-blue-800"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationsPanel;
