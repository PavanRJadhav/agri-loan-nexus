
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Users,
  Settings,
  FileText,
  Building,
  PlusCircle,
  CreditCard,
  CheckCircle,
  Wallet,
  History,
  MessageSquare
} from "lucide-react";

export function Sidebar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Admin navigation items
  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Users",
      href: "/users",
      icon: Users,
    },
    {
      title: "Lending Partners",
      href: "/lenders",
      icon: Building,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  // Farmer navigation items
  const farmerNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Loan Applications",
      href: "/loan-applications",
      icon: FileText,
    },
    {
      title: "New Application",
      href: "/loan-applications/new",
      icon: PlusCircle,
    },
    {
      title: "Credit Cards",
      href: "/credit-cards",
      icon: CreditCard,
    },
    {
      title: "Transactions",
      href: "/transactions",
      icon: History,
    },
    {
      title: "Credit Score",
      href: "/credit-score",
      icon: CheckCircle,
    },
    {
      title: "Repay Loan",
      href: "/repay-loan",
      icon: Wallet,
    },
    {
      title: "Lending Partners",
      href: "/lenders",
      icon: Building,
    },
    {
      title: "Support Chat",
      href: "/support",
      icon: MessageSquare,
    },
  ];

  // Verifier navigation items
  const verifierNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Loan Verification",
      href: "/verify-loans",
      icon: CreditCard,
    },
    {
      title: "Lending Partners",
      href: "/lenders",
      icon: Building,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  let navItems;
  if (user?.role === "admin") {
    navItems = adminNavItems;
  } else if (user?.role === "farmer") {
    navItems = farmerNavItems;
  } else if (user?.role === "verifier") {
    navItems = verifierNavItems;
  } else {
    navItems = [];
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground bg-secondary text-secondary-foreground h-10 px-4 py-2">
          Open Menu
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-64">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navigate through the application using the menu below.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        <NavigationMenu>
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <Link
                  to={item.href}
                  className="group flex items-center gap-2 rounded-md p-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-secondary focus:text-secondary-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 rounded-md p-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-secondary focus:text-secondary-foreground"
              >
                Logout
              </button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </SheetContent>
    </Sheet>
  );
}
