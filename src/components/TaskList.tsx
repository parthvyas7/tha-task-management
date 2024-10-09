import { RxCross1 } from "react-icons/rx";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
interface TaskListProps {
  segregatedTasks: {
    id: string;
    content: string;
    complete: boolean;
  }[];
  handleComplete: (id: string) => void;
  handleDelete: (id: string) => void;
}
const TaskList = ({
  segregatedTasks,
  handleComplete,
  handleDelete,
}: TaskListProps): JSX.Element => {
  return (
    <>
      <ul className="overflow-y-auto max-h-96">
        {segregatedTasks.length === 0 ? (
          <p className="text-lg">No tasks added</p>
        ) : null}
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
    </>
  );
};

export default TaskList;
