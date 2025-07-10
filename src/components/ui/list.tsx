"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

const List = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />
));
List.displayName = "List";

const ListItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement> & { unread?: boolean }
>(({ className, unread, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      "flex items-center gap-4 p-2 rounded-md hover:bg-accent transition-colors",
      unread && "bg-blue-50 dark:bg-blue-900/20",
      className
    )}
    {...props}
  />
));
ListItem.displayName = "ListItem";

const ListIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { icon: LucideIcon | keyof typeof LucideIcons }
>(({ className, icon, ...props }, ref) => {
  const IconComponent = typeof icon === 'string' ? LucideIcons[icon as keyof typeof LucideIcons] as LucideIcon : icon;

  if (!IconComponent) {
    return null; // or return a default icon
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground",
        className
      )}
      {...props}
    >
      <IconComponent className="h-5 w-5" />
    </div>
  );
});
ListIcon.displayName = "ListIcon";

const ListContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 min-w-0", className)}
    {...props}
  />
));
ListContent.displayName = "ListContent";

const ListTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("font-semibold truncate", className)}
    {...props}
  />
));
ListTitle.displayName = "ListTitle";

const ListSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground truncate", className)}
    {...props}
  />
));
ListSubtitle.displayName = "ListSubtitle";


export { List, ListItem, ListIcon, ListContent, ListTitle, ListSubtitle };
