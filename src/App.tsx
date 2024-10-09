import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "./components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect, useCallback, useRef } from "react";
import { RxCross1 } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import useDebounce from "./hooks/useDebounce";

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
  const inputRef = useRef(null);
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    inputRef.current?.focus();
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
  const handleAddTaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask({ ...task, content: e.currentTarget.value });
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };
  const handleDelete = (id: string) => {
    const userConfirmation = confirm(
      "Are you sure you want to delete this task?"
    );
    if (userConfirmation) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };
  const handleViewCompleted = () => setFilter("complete");
  const handleViewIncomplete = () => setFilter("incomplete");
  const handleViewAll = () => setFilter("all");

  return (
    <>
      <div className="mx-auto p-4 md:px-0 md:w-3/4">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-between">
          <h1 className="text-4xl font-bold">Today</h1>
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              className="rounded-full pl-10 pr-4 py-2 w-full text-lg"
            />
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <ToggleGroup
            size={"lg"}
            type="single"
            variant={"outline"}
            defaultValue="all"
          >
            <ToggleGroupItem
              value="all"
              aria-label="Toggle all"
              onClick={handleViewAll}
              className={"text-lg"}
            >
              All
            </ToggleGroupItem>
            <ToggleGroupItem
              value="complete"
              aria-label="Toggle Completed"
              onClick={handleViewCompleted}
              className={"text-lg"}
            >
              Completed
            </ToggleGroupItem>
            <ToggleGroupItem
              value="incomplete"
              aria-label="Toggle Incomplete"
              onClick={handleViewIncomplete}
              className={"text-lg"}
            >
              Incomplete
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="my-2">
          <ul className="overflow-y-auto max-h-96">
            {segregatedTasks.map((task) => (
              <>
                <li
                  key={task.id}
                  className={`flex flex-row gap-2 rounded border items-center ${
                    task.complete ? "border-green-300 bg-green-50" : null
                  } p-2 my-2 justify-between`}
                >
                  <div className="space-x-2 items-center flex">
                    <Checkbox
                      checked={task.complete}
                      onClick={() => handleComplete(task.id)}
                      className={"rounded-full w-6 h-6"}
                    />
                    <span className={"text-lg"}>{task.content}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(task.id)}
                    className="rounded-full hover:text-red-500"
                  >
                    <RxCross1 />
                  </Button>
                </li>
              </>
            ))}
          </ul>
          <div className="space-y-2 my-2">
            <Input
              placeholder="Type something (Press Enter to add)"
              type="text"
              className={"w-full text-lg"}
              value={task.content}
              onChange={handleAddTaskInputChange}
              onKeyDown={handleKeyPress}
              required
              ref={inputRef}
            />
            <Button
              onClick={handleAddTask}
              disabled={task.content == ""}
              className={"w-full text-lg"}
            >
              Add task
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
