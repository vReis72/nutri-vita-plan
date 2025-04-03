
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
  items?: {
    title: string;
    href: string;
    icon: React.ElementType;
  }[];
}

export function Sidebar({ className, children }: SidebarProps) {
  return (
    <div className={cn("h-full w-[240px] border-r bg-background flex-shrink-0", className)}>
      {children}
    </div>
  );
}

export function SidebarTrigger({ className }: { className?: string }) {
  return (
    <button className={cn("h-5 w-5 text-muted-foreground", className)}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
      </svg>
    </button>
  );
}

// Context for sidebar state
const SidebarContext = React.createContext<{
  expanded: boolean;
  toggleSidebar: () => void;
}>({
  expanded: true,
  toggleSidebar: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = React.useState(true);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <SidebarContext.Provider value={{ expanded, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
