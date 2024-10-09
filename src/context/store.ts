import { createContext } from 'react'

interface Task {
  id: string;
  content: string;
  complete: boolean;
}

interface TasksListContextValue {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export const TasksListContext = createContext<TasksListContextValue | null>(null);