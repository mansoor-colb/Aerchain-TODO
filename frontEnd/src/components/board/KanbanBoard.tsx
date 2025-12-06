import { Task, Status } from "@/types/task";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  tasks: Task[];
  getTasksByStatus: (status: Status) => Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newStatus: Status) => void;
  onAddTask?: () => void;
}

const columns: Status[] = ["To Do", "In Progress", "Done"];

export function KanbanBoard({
  getTasksByStatus,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onAddTask,
}: KanbanBoardProps) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {columns.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={getTasksByStatus(status)}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onMoveTask={onMoveTask}
          onAddTask={status === "To Do" ? onAddTask : undefined}
        />
      ))}
    </div>
  );
}
