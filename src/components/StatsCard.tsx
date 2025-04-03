
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          <div className="rounded-full p-2 bg-nutri-light text-nutri-primary">
            {icon}
          </div>
        </div>
        
        {trend && trendValue && (
          <div className="mt-4 flex items-center">
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                trend === "up" && "bg-green-100 text-green-800",
                trend === "down" && "bg-red-100 text-red-800",
                trend === "neutral" && "bg-gray-100 text-gray-800"
              )}
            >
              {trendValue}
            </span>
            <span className="text-xs text-gray-500 ml-2">vs. mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
