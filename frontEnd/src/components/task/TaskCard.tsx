import { Task, Status } from "@/types/task";
import { cn } from "@/lib/utils";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { formatDate, isOverdue } from "@/lib/dateUtils";
import { Calendar, GripVertical, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function TaskCard({ task, onEdit, onDelete, isDragging, dragHandleProps }: TaskCardProps) {
  const overdue = task.status !== 'Done' && isOverdue(task.dueDate);
  
  return (
    <div
      className={cn(
        "group relative rounded-lg border bg-card p-3 shadow-card transition-all duration-200",
        "hover:shadow-card-hover hover:border-primary/20",
        isDragging && "opacity-50 rotate-2 scale-105 shadow-lg",
      )}
    >
      {/* Drag handle */}
      <div
        {...dragHandleProps}
        className={cn(
          "absolute left-1 top-1/2 -translate-y-1/2 cursor-grab opacity-0 transition-opacity",
          "group-hover:opacity-50 hover:!opacity-100",
          "focus:opacity-100"
        )}
        tabIndex={0}
        role="button"
        aria-label="Drag to reorder task"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="pl-4">
        {/* Header with title and actions */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm text-card-foreground leading-snug line-clamp-2"      onClick={() => onEdit?.(task)} style={{cursor:"pointer"}}>
            {task.title}
          </h3>
          
          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => onEdit?.(task)}
              aria-label="Edit task"
              className="h-7 w-7"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => onDelete?.(task._id)}
              aria-label="Delete task"
              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        {/* Description */}
        {task.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
        
        {/* Footer with metadata */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <PriorityBadge priority={task.priority} size="sm" />
          
          {task.dueDate && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                overdue ? "text-destructive" : "text-muted-foreground"
              )}
            >
              <Calendar className="h-3 w-3" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
