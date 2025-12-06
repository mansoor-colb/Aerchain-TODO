import { cn } from "@/lib/utils";
import { Priority } from "@/types/task";

interface PriorityBadgeProps {
  priority: Priority;
  size?: "sm" | "md";
  className?: string;
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  High: {
    label: "High",
    className: "bg-priority-high/10 text-priority-high border-priority-high/30",
  },
  Medium: {
    label: "Medium",
    className: "bg-priority-medium/10 text-priority-medium border-priority-medium/30",
  },
  Low: {
    label: "Low",
    className: "bg-priority-low/10 text-priority-low border-priority-low/30",
  },
  None: {
    label: "None",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export function PriorityBadge({ priority, size = "md", className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
