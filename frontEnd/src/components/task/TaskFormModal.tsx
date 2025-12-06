import { useState, useEffect } from "react";
import { Task, CreateTaskInput, Priority, Status } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatForInput, parseInputDate } from "@/lib/dateUtils";


import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";


interface TaskFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  initialValues?: Partial<CreateTaskInput>;
  onSubmit: (input: CreateTaskInput) => void;
  mode?: "create" | "edit";
}

const priorities: Priority[] = ["High", "Medium", "Low", "None"];
const statuses: Status[] = ["To Do", "In Progress", "Done"];

export function TaskFormModal({
  open,
  onOpenChange,
  task,
  initialValues,
  onSubmit,
  mode = "create",
}: TaskFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("None");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<Status>("To Do");

  useEffect(() => {
    // console.log("check values",open,initialValues)
    if (open) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setPriority(task.priority);
        setDueDate(formatForInput(task.dueDate));
        setStatus(task.status);
      } else if (initialValues) {
        setTitle(initialValues.title || "");
        setDescription(initialValues.description || "");
        setPriority(initialValues.priority || "None");
        setDueDate(formatForInput(initialValues.dueDate || null));
        setStatus(initialValues.status || "To Do");
      } else {
        setTitle("");
        setDescription("");
        setPriority("None");
        setDueDate("");
        setStatus("To Do");
      }
    }
  }, [open, task, initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: parseInputDate(dueDate),
      status,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Create New Task" : "Edit Task"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Add a new task to your board"
                : "Update your task details"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details..."
                rows={3}
              />
            </div>

            {/* Priority and Status row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as Priority)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as Status)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

      <div className="grid gap-2">
  <Label htmlFor="dueDate">Due Date</Label>

  <Popover>
    <PopoverTrigger asChild>
      <button
        type="button"
        className="flex items-center justify-between w-full border rounded-md px-3 py-2 text-left cursor-pointer"
      >
        <span>
          {dueDate ? format(new Date(dueDate), "yyyy-MM-dd") : "Pick a date"}
        </span>
        <CalendarIcon className="h-5 w-5 opacity-70" />
      </button>
    </PopoverTrigger>

    <PopoverContent className="p-0" align="start">
      <Calendar
        mode="single"
        selected={dueDate ? new Date(dueDate) : undefined}
        onSelect={(date) => {
          if (!date) return;
          const formatted = format(date, "yyyy-MM-dd");
          setDueDate(formatted);
        }}
        initialFocus
      />
    </PopoverContent>
  </Popover>
</div>

          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              {mode === "create" ? "Create Task" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
