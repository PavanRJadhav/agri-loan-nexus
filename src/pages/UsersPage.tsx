
import React from "react";

const UsersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          View and manage system users
        </p>
      </div>
      
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        User management interface will be displayed here
      </div>
    </div>
  );
};

export default UsersPage;
