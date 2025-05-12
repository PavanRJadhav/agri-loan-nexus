
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  CreditCard, 
  PieChart, 
  FileText, 
  Users, 
  MessageSquare, 
  Settings,
  UserCheck,
  Building,
  BarChart4,
  User
} from "lucide-react";

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  // Define navigation links based on user role
  const getNavLinks = () => {
    const commonLinks = [
      { name: "Dashboard", icon: Home, path: "/dashboard" },
    ];
    
    const farmerLinks = [
      { name: "Loan Applications", icon: FileText, path: "/loan-applications/new" },
      { name: "Credit Cards", icon: CreditCard, path: "/credit-cards" },
      { name: "Transactions", icon: PieChart, path: "/transactions" },
      { name: "Support Chat", icon: MessageSquare, path: "/support" },
    ];
    
    const adminLinks = [
      { name: "All Applications", icon: FileText, path: "/all-applications" },
      { name: "User Management", icon: Users, path: "/users" },
      { name: "Analytics", icon: BarChart4, path: "/analytics" },
    ];
    
    const verifierLinks = [
      { name: "Verify Applications", icon: UserCheck, path: "/verify-applications" },
      { name: "Lending Partners", icon: Building, path: "/partners" },
    ];
    
    // Add profile and settings links for all user roles
    const profileSettingsLinks = [
      { name: "My Profile", icon: User, path: "/profile" },
      { name: "Settings", icon: Settings, path: "/settings" }
    ];
    
    if (user?.role === "farmer") {
      return [...commonLinks, ...farmerLinks, ...profileSettingsLinks];
    } else if (user?.role === "admin") {
      return [...commonLinks, ...adminLinks, ...profileSettingsLinks];
    } else if (user?.role === "verifier") {
      return [...commonLinks, ...verifierLinks, ...profileSettingsLinks];
    }
    
    return commonLinks;
  };
  
  const navLinks = getNavLinks();

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col bg-white border-r border-gray-200 overflow-y-auto">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-agriloan-primary">AgriLoan Nexus</h1>
      </div>
      
      <div className="px-3 py-4">
        <div className="mb-4">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            {user?.role?.toUpperCase()}
          </div>
        </div>
        
        <nav className="space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-agriloan-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <link.icon className="h-5 w-5 mr-3" />
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
