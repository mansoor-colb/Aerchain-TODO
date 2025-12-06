import { useState, useCallback, useRef } from "react";
import { Task, Status } from "@/types/task";
import { TaskCard } from "@/components/task/TaskCard";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newStatus: Status) => void;
  onAddTask?: () => void;
}

const columnConfig: Record<Status, { title: string; color: string; bgColor: string }> = {
  "To Do": {
    title: "To Do",
    color: "text-status-todo",
    bgColor: "bg-status-todo/10",
  },
  "In Progress": {
    title: "In Progress",
    color: "text-status-progress",
    bgColor: "bg-status-progress/10",
  },
  Done: {
    title: "Done",
    color: "text-status-done",
    bgColor: "bg-status-done/10",
  },
};

export function KanbanColumn({
  status,
  tasks,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onAddTask,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const config = columnConfig[status];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      
      const taskId = e.dataTransfer.getData("taskId");
      if (taskId) {
        onMoveTask(taskId, status);
      }
    },
    [onMoveTask, status]
  );

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-card/50 backdrop-blur-sm",
        "min-h-[500px] w-full min-w-[280px] max-w-[350px]",
        isDragOver && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", config.bgColor, config.color.replace("text-", "bg-"))} />
          <h2 className="font-semibold text-sm">{config.title}</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        
        {status === "To Do" && onAddTask && (
          <button
            onClick={onAddTask}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Add task"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tasks Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <p className="text-sm">No tasks</p>
          </div>
        ) : (
          tasks.map((task) => (
            <DraggableTask
              key={task._id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface DraggableTaskProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

function DraggableTask({ task, onEdit, onDelete }: DraggableTaskProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData("taskId", task._id);
      e.dataTransfer.effectAllowed = "move";
      setIsDragging(true);
    },
    [task._id]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
    >
      <TaskCard
        task={task}
        key={task._id}
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
}
