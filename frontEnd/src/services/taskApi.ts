// src/services/taskApi.ts

import axios from "axios";
import { toast } from "sonner";
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  Status
} from "@/types/task";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  // withCredentials: true,
});


function handleApiError(error: any, fallbackMessage: string) {
  console.error("API Error:", error);

  const message =
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage;

  toast.error(message);
  throw new Error(message);
}



export async function fetchTasks(): Promise<Task[]> {
  try {
    const res = await api.get("/tasks");
    return res.data.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch tasks");
  }
}


export async function createTaskApi(input: CreateTaskInput): Promise<Task> {
  try {
    const res = await api.post("/tasks", input);
    toast.success("Task created successfully");
    return res.data.data;
  } catch (error) {
    handleApiError(error, "Failed to create task");
  }
}


export async function updateTaskApi(input: UpdateTaskInput): Promise<Task> {
  try {
    const res = await api.put(`/tasks/${input._id}`, input);
    toast.success("Task updated");
    return res.data.data;
  } catch (error) {
    handleApiError(error, "Failed to update task");
  }
}


export async function deleteTaskApi(id: string): Promise<{ success: boolean }> {
  try {
    const res = await api.delete(`/tasks/${id}`);
    toast.success("Task deleted");
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to delete task");
  }
}


export async function moveTaskApi(
  taskId: string,
  newStatus: Status
): Promise<Task> {
  try {
    const res = await api.patch(`/tasks/${taskId}/status`, {
      status: newStatus
    });
    toast.success("Task status updated");
    return res.data.data;
  } catch (error) {
    handleApiError(error, "Failed to move task");
  }
}

export async function reorderTaskApi(
  taskId: string,
  newIndex: number,
  status: Status
): Promise<{ success: boolean }> {
  try {
    const res = await api.patch(`/tasks/${taskId}/reorder`, {
      newIndex,
      status
    });
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to reorder tasks");
  }
}



  export async function parseVoice(
trancriptBody
): Promise<{ success: boolean }> {
  try {
    const res = await api.post(`/tasks/parse-voice`, trancriptBody);
    return res.data.data;
  } catch (error) {
    handleApiError(error, "Failed to reorder tasks");
  }
}



  

