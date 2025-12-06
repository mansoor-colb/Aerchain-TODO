import { useState, useCallback } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Task, CreateTaskInput, Status, Priority } from "@/types/task";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import { TaskListView } from "@/components/board/TaskListView";
import { TaskFormModal } from "@/components/task/TaskFormModal";
import { VoiceInputModal } from "@/components/voice/VoiceInputModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ui/loader";

import {
  Plus,
  Mic,
  Search,
  LayoutGrid,
  List,
  CheckSquare,
} from "lucide-react";

type ViewMode = "kanban" | "list";

const Index = () => {
  const {
    filteredTasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    isLoading,
    getTasksByStatus,
  } = useTasks();

  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Handle task creation
  const handleCreateTask = useCallback(
    (input: CreateTaskInput) => {
      createTask(input);
      toast({
        title: "Task created",
        description: `"${input.title}" has been added to your board.`,
      });
    },
    [createTask]
  );

  // Handle task update
  const handleUpdateTask = useCallback(
    (input: CreateTaskInput) => {
      if (!editingTask) return;
      updateTask({ _id: editingTask._id, ...input });
      setEditingTask(null);
      toast({
        title: "Task updated",
        description: "Your changes have been saved.",
      });
    },
    [editingTask, updateTask]
  );

  // Handle task deletion
  const handleDeleteTask = useCallback(
    (taskId: string) => {
      deleteTask(taskId);
      toast({
        title: "Task deleted",
        description: "The task has been removed.",
      });
    },
    [deleteTask]
  );

  // Handle opening edit modal
  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  // Handle keyboard shortcut for create
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "c" && !e.metaKey && !e.ctrlKey) {
      const activeElement = document.activeElement;
      const isInput = activeElement instanceof HTMLInputElement || 
                      activeElement instanceof HTMLTextAreaElement;
      if (!isInput) {
        e.preventDefault();
        setIsCreateModalOpen(true);
      }
    }
  }, []);

  // Register keyboard shortcuts
  useState(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                <CheckSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">TaskFlow</h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVoiceModalOpen(true)}
                className="gap-2"
              >
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">Voice</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Task</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search and Filters */}
          <div className="flex flex-1 flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as Status | "All")}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select
              value={priorityFilter}
              onValueChange={(v) => setPriorityFilter(v as Priority | "All")}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priority</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border bg-muted p-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                viewMode === "kanban"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Kanban view"
            >
              <LayoutGrid className="h-4 w-4" />
              Board
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                viewMode === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
              List
            </button>
          </div>
        </div>

        {/* Board View */}

     {isLoading ? (
  <Loader />
) : (
  <>
    {viewMode === "kanban" ? (
      <KanbanBoard
        tasks={filteredTasks}
        getTasksByStatus={getTasksByStatus}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onMoveTask={moveTask}
        onAddTask={() => setIsCreateModalOpen(true)}
      />
    ) : (
      <TaskListView
        tasks={filteredTasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />
    )}

    {/* Shortcut Hint */}
    <div className="mt-6 text-center">
      <p className="text-xs text-muted-foreground">
        Press <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">C</kbd> to create a new task
      </p>
    </div>
  </>
)}

      </main>

      {/* Create Task Modal */}
      <TaskFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateTask}
        mode="create"
      />

      {/* Edit Task Modal */}
      <TaskFormModal
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        task={editingTask}
        onSubmit={handleUpdateTask}
        mode="edit"
      />

      {/* Voice Input Modal */}
      <VoiceInputModal
        open={isVoiceModalOpen}
        onOpenChange={setIsVoiceModalOpen}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
};

export default Index;
