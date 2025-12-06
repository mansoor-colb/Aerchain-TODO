import { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchTasks,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
  moveTaskApi,
  reorderTaskApi,
} from "@/services/taskApi";

import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  Status,
  Priority,
} from "@/types/task";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "All">("All");

  // --------------------- FETCH TASKS FROM API ---------------------
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchTasks();
        console.log("data",data)
        setTasks(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // --------------------- FILTERED TASKS ---------------------
  const filteredTasks = useMemo(() => {
    return tasks?.filter((task) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !task.title.toLowerCase().includes(q) &&
          !task.description.toLowerCase().includes(q)
        )
          return false;
      }

      if (statusFilter !== "All" && task.status !== statusFilter) return false;
      if (priorityFilter !== "All" && task.priority !== priorityFilter)
        return false;

      return true;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const getTasksByStatus = useCallback(
    (status: Status) => filteredTasks.filter((task) => task.status === status),
    [filteredTasks]
  );

  // --------------------- CREATE TASK ---------------------
  const createTask = useCallback(async (input: CreateTaskInput) => {
    try {
        setLoading(true);
      const newTask = await createTaskApi(input);
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err) {
      console.error(err);
      setError("Failed to create task");
      throw err;
    }
    finally{
        setLoading(false);
    }
  }, []);

  // --------------------- UPDATE TASK ---------------------
  const updateTask = useCallback(async (input: UpdateTaskInput) => {
    try {
        setLoading(true);
      const updated = await updateTaskApi(input);
      console.log(updated)
      let tasksnew=tasks.map((t) => (t._id === updated._id ? updated : t)) ||[]
      console.log("jhhjh",tasksnew)
      setTasks((prev)=>{return prev.map((t) => (t._id === updated._id ? updated : t)) });
    } catch (err) {
      console.error(err);
      setError("Failed to update task");
    }
    finally{
        setLoading(false);
    }
  }, []);

  // --------------------- DELETE TASK ---------------------
  const deleteTask = useCallback(async (id: string) => {
    try {
        setLoading(true);
      await deleteTaskApi(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete task");
    }finally{
        setLoading(false);
    }
  }, []);

  // --------------------- MOVE TASK (STATUS CHANGE) ---------------------
  const moveTask = useCallback(async (taskId: string, newStatus: Status) => {
    try {
        setLoading(true);
      const updated = await moveTaskApi(taskId, newStatus);
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      console.error(err);
      setError("Failed to move task");
    }
    finally{
        setLoading(false);
    }
  }, []);

  // --------------------- REORDER TASK ---------------------
  const reorderTasks = useCallback(
    async (taskId: string, newIndex: number, status: Status) => {
      try {
        await reorderTaskApi(taskId, newIndex, status);

        // Reorder locally
        setTasks((prev) => {
          const tasksByStatus = prev.filter((t) => t.status === status);
          const others = prev.filter((t) => t.status !== status);

          const item = tasksByStatus.find((t) => t._id === taskId);
          if (!item) return prev;

          const list = tasksByStatus.filter((t) => t._id !== taskId);
          list.splice(newIndex, 0, item);

          return [...others, ...list];
        });
      } catch (err) {
        console.error(err);
        setError("Failed to reorder tasks");
      }
    },
    []
  );

  return {
    tasks,
    filteredTasks,
    isLoading,
    error,

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
    reorderTasks,
    getTasksByStatus,
  };
}
