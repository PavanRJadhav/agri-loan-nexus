
import React from "react";
import { Button } from "@/components/ui/button";

interface ApplicationItemProps {
  id: number;
  title: string;
  date: string;
  status: string;
  statusColor: string;
  showActions?: boolean;
  amount?: string;
  type?: string;
  applicantInitial?: string;
  onApprove?: () => void;
  onReject?: () => void;
}

const ApplicationItem: React.FC<ApplicationItemProps> = ({
  id,
  title,
  date,
  status,
  statusColor,
  showActions = false,
  amount,
  type,
  applicantInitial,
  onApprove,
  onReject
}) => {
  if (showActions && applicantInitial) {
    // Verifier view with actions
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-agriloan-primary flex items-center justify-center text-white">
              {applicantInitial}
            </div>
            <div>
              <p className="font-medium">{title}</p>
              <p className="text-sm text-muted-foreground">{type}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 mx-4">
          <p className="text-sm font-medium">Status</p>
          <p className="text-sm text-muted-foreground">{status}</p>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Amount</p>
          <p className="text-sm text-muted-foreground">{amount}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReject}
          >
            Reject
          </Button>
          <Button 
            className="bg-agriloan-primary hover:bg-agriloan-secondary" 
            size="sm"
            onClick={onApprove}
          >
            Verify
          </Button>
        </div>
      </div>
    );
  }

  // Standard application item
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>
      <div className="flex items-center">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default ApplicationItem;
