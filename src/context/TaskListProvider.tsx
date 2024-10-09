import { useState, useEffect } from "react";
import { TasksListContext } from "./store";

const TasksListContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <TasksListContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TasksListContext.Provider>
  );
};

export default TasksListContextProvider;
