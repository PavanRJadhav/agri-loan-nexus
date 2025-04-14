
import React from "react";

interface UserActivityItemProps {
  initials: string;
  name: string;
  role: string;
  activity: string;
  bgColor: string;
}

const UserActivityItem: React.FC<UserActivityItemProps> = ({
  initials,
  name,
  role,
  activity,
  bgColor
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
      <div className="flex items-center space-x-2">
        <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center text-white`}>
          {initials}
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">{activity}</span>
    </div>
  );
};

export default UserActivityItem;
