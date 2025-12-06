export type Priority = 'High' | 'Medium' | 'Low' | 'None';
export type Status = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedVoiceInput {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  status: Status;
}

export interface VoiceParseResponse {
  transcript: string;
  parsed: ParsedVoiceInput;
  confidence: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
  status?: Status;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  _id: string;
}
