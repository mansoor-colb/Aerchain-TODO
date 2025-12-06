import { Task, Status, Priority } from "@/types/task";
import { TaskCard } from "@/components/task/TaskCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, isOverdue } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar } from "lucide-react";

interface TaskListViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskListView({ tasks, onEditTask, onDeleteTask }: TaskListViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No tasks found</p>
        <p className="text-sm">Create a new task to get started</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const overdue = task.status !== 'Done' && isOverdue(task.dueDate);
            
            return (
              <TableRow key={task._id} className="group"  >
                <TableCell>
                  <div>
                    <p className="font-medium" onClick={() => onEditTask(task)} style={{cursor:"pointer"}}>{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={task.status} size="sm" />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={task.priority} size="sm" />
                </TableCell>
                <TableCell>
                  {task.dueDate ? (
                    <div
                      className={cn(
                        "flex items-center gap-1 text-sm",
                        overdue ? "text-destructive" : "text-muted-foreground"
                      )}
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="iconSm"
                      onClick={() => onEditTask(task)}
                      aria-label="Edit task"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="iconSm"
                      onClick={() => onDeleteTask(task._id)}
                      aria-label="Delete task"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
