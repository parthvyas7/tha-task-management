import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "./components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect,useCallback } from "react";
import { RxCross1 } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import useDebounce from './hooks/useDebounce'
interface Task {
  id: string;
  content: string;
  complete: boolean;
}

type FilterType = "all" | "complete" | "incomplete";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  const [task, setTask] = useState<Task>({
    id: Math.random().toString(36).slice(2, 9),
    content: "",
    complete: false,
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);

  const handleAddTask = () => {
    const newTaskId = Math.random().toString(36).slice(2, 9);
    setTasks([
      ...tasks,
      { id: newTaskId, content: task.content, complete: false },
    ]);
    setTask({ id: newTaskId, content: "", complete: false });
  };
  const segregatedTasks = useCallback(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "complete"
          ? task.complete
          : filter === "incomplete"
          ? !task.complete
          : true;
      const matchesSearch = task.content
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, debouncedSearchTerm])();

  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);
  };
  const handleComplete = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            complete: !task.complete,
          };
        }
        return task;
      })
    );
  };
  const handleDelete = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };
  const handleViewCompleted = () => setFilter("complete");
  const handleViewIncomplete = () => setFilter("incomplete");
  const handleViewAll = () => setFilter("all");

  return (
    <>
      <div className="mx-auto py-4">
        <div className="flex flex-col md:flex-row">
          <h1 className="text-4xl">Today</h1>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              className="rounded-full pl-10 pr-4 py-2 w-full"
            />
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <ToggleGroup size={"lg"} type="single">
            <ToggleGroupItem
              value="all"
              defaultChecked
              aria-label="Toggle all"
              onClick={handleViewAll}
            >
              All
            </ToggleGroupItem>
            <ToggleGroupItem
              value="complete"
              aria-label="Toggle Completed"
              onClick={handleViewCompleted}
            >
              Completed
            </ToggleGroupItem>
            <ToggleGroupItem
              value="incomplete"
              aria-label="Toggle Incomplete"
              onClick={handleViewIncomplete}
            >
              Incomplete
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div>
          <ul>
            {segregatedTasks.map((task) => (
              <>
                <li key={task.id} className="flex flex-row gap-2 rounded border">
                  <Checkbox
                    checked={task.complete}
                    onClick={() => handleComplete(task.id)}
                    className="rounded-full"
                  />
                  <span
                    className={
                      task.complete ? "bg-green-100 line-through" : undefined
                    }
                  >
                    {task.content}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(task.id)}
                    className="rounded-full"
                  >
                    <RxCross1 />
                  </Button>
                </li>
              </>
            ))}
          </ul>
          <Input
            placeholder="Type something..."
            value={task.content}
            onChange={(e) => setTask({ ...task, content: e.target.value })}
            required
          />
          <Button onClick={handleAddTask} disabled={task.content == ""}>
            Add task
          </Button>
        </div>
      </div>
    </>
  );
};

export default App;
