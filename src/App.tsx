import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";

type Task = {
  id: string;
  content: string;
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

type Columns = {
  [key: string]: Column;
};

const App: React.FC = () => {
  const [columns, setColumns] = useState<Columns>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("kanban-data");
    if (stored) {
      const parsed = JSON.parse(stored);
      setColumns(parsed.columns);
      setColumnOrder(parsed.columnOrder);
    } else {
      const initialCols: Columns = {
        [uuidv4()]: {
          id: uuidv4(),
          title: "To Do",
          tasks: [
            { id: uuidv4(), content: "Task 1" },
            { id: uuidv4(), content: "Task 2" },
          ],
        },
        [uuidv4()]: {
          id: uuidv4(),
          title: "In Progress",
          tasks: [{ id: uuidv4(), content: "Task 3" }],
        },
        [uuidv4()]: {
          id: uuidv4(),
          title: "Done",
          tasks: [],
        },
      };
      setColumns(initialCols);
      setColumnOrder(Object.keys(initialCols));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "kanban-data",
      JSON.stringify({ columns, columnOrder })
    );
  }, [columns, columnOrder]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const [movedTask] = sourceCol.tasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCol.tasks.splice(destination.index, 0, movedTask);
      setColumns({ ...columns, [source.droppableId]: sourceCol });
    } else {
      destCol.tasks.splice(destination.index, 0, movedTask);
      setColumns({
        ...columns,
        [source.droppableId]: sourceCol,
        [destination.droppableId]: destCol,
      });
    }
  };

  const addTask = (colId: string, content: string) => {
    const newTask: Task = { id: uuidv4(), content };
    const col = columns[colId];
    col.tasks.push(newTask);
    setColumns({ ...columns, [colId]: col });
  };

  const addColumn = () => {
    const newId = uuidv4();
    const newCol: Column = { id: newId, title: "New Column", tasks: [] };
    setColumns({ ...columns, [newId]: newCol });
    setColumnOrder([...columnOrder, newId]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <button
          onClick={addColumn}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Add Column
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto">
          {columnOrder.map((colId) => {
            const column = columns[colId];
            return (
              <div
                key={colId}
                className="bg-white rounded-lg p-4 shadow-md min-w-[250px] flex-shrink-0"
              >
                <h2 className="font-semibold text-lg mb-3">{column.title}</h2>
                <Droppable droppableId={colId}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3 min-h-[50px]"
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className="bg-gray-50 p-3 rounded shadow-sm hover:shadow-md border"
                            >
                              {task.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <form
                  className="mt-4 flex"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem(
                      "task"
                    ) as HTMLInputElement;
                    if (input.value.trim()) {
                      addTask(colId, input.value.trim());
                      input.value = "";
                    }
                  }}
                >
                  <input
                    name="task"
                    placeholder="Add new task"
                    className="flex-1 border rounded-l px-2 py-1 text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 py-1 text-sm rounded-r hover:bg-blue-700"
                  >
                    Add
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;
