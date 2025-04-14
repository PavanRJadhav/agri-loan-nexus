
import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, Menu, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import NotificationsPanel from "./NotificationsPanel";
import { useToast } from "@/hooks/use-toast";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Handle clicking outside to close notifications panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center md:hidden">
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>
      
      <div className="hidden md:flex md:w-64 lg:w-80">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full bg-gray-50 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-agriloan-primary focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative" ref={notificationRef}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative" 
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="sr-only">Notifications</span>
          </Button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 z-50">
              <NotificationsPanel onClose={() => setShowNotifications(false)} />
            </div>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarFallback className="bg-agriloan-primary text-white">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem disabled>
              {user?.name || "User"}
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="text-gray-500 text-xs">
              {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
