
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  descriptionColor?: string;
  link?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: Icon, descriptionColor, link }) => {
  const content = (
    <CardContent className="p-6">
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-2xl font-bold">{value}</p>
        <p className={`text-xs ${descriptionColor || "text-muted-foreground"}`}>
          {description}
        </p>
      </div>
    </CardContent>
  );

  if (link) {
    return (
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
        <Link to={link}>
          {content}
        </Link>
      </Card>
    );
  }

  return <Card>{content}</Card>;
};

export default StatCard;
