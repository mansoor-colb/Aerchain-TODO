import { cn } from "@/lib/utils";
import { Status } from "@/types/task";

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md";
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string; dotClassName: string }> = {
  "To Do": {
    label: "To Do",
    className: "bg-status-todo/10 text-status-todo",
    dotClassName: "bg-status-todo",
  },
  "In Progress": {
    label: "In Progress",
    className: "bg-status-progress/10 text-status-progress",
    dotClassName: "bg-status-progress",
  },
  Done: {
    label: "Done",
    className: "bg-status-done/10 text-status-done",
    dotClassName: "bg-status-done",
  },
};

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        config.className,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClassName)} />
      {config.label}
    </span>
  );
}
