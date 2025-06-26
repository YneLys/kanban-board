import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import { ColumnType, TaskType } from "./types";
import { saveToLocalStorage, loadFromLocalStorage } from "./utils/localStorage";

const DEFAULT_COLUMNS: ColumnType[] = [
  { id: "backlog", title: "Backlog", taskIds: [] },
  { id: "doing", title: "Doing", taskIds: [] },
  { id: "review", title: "Review", taskIds: [] },
  { id: "done", title: "Done", taskIds: [] }
];

export default function App() {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [tasks, setTasks] = useState<Record<string, TaskType>>({});
  const [newTasks, setNewTasks] = useState<Record<string, string>>({});
  const [newColumnTitle, setNewColumnTitle] = useState("");

  useEffect(() => {
    const saved = loadFromLocalStorage("kanban-board");
    if (saved) {
      setColumns(saved.columns);
      setTasks(saved.tasks);
    } else {
      setColumns(DEFAULT_COLUMNS);
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage("kanban-board", { columns, tasks });
  }, [columns, tasks]);

  const addTask = (columnId: string) => {
    const content = newTasks[columnId];
    if (!content?.trim()) return;

    const id = uuid();
    const newTask: TaskType = { id, content };
    setTasks((prev) => ({ ...prev, [id]: newTask }));
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, taskIds: [...col.taskIds, id] } : col
      )
    );
    setNewTasks((prev) => ({ ...prev, [columnId]: "" }));
  };

  const addColumn = () => {
    if (!newColumnTitle.trim()) return;
    const id = uuid();
    const newCol: ColumnType = { id, title: newColumnTitle.trim(), taskIds: [] };
    setColumns((prev) => [...prev, newCol]);
    setNewColumnTitle("");
  };

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    setColumns((prev) => {
      const updated = [...prev];
      const srcCol = updated.find((col) => col.id === source.droppableId);
      const destCol = updated.find((col) => col.id === destination.droppableId);
      if (!srcCol || !destCol) return prev;

      srcCol.taskIds.splice(source.index, 1);
      destCol.taskIds.splice(destination.index, 0, draggableId);

      return [...updated];
    });
  };

  return (
    <div>
      <h1>Kanban Board</h1>
      <div className="add-column-section">
        <input
          type="text"
          placeholder="New column title"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
        />
        <button onClick={addColumn}>Add Column</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {columns.map((column) => (
            <div key={column.id} className="column">
              <div className="column-title">{column.title}</div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ minHeight: "20px" }}
                  >
                    {column.taskIds.map((taskId, index) => {
                      const task = tasks[taskId];
                      return (
                        <Draggable key={taskId} draggableId={taskId} index={index}>
                          {(provided) => (
                            <div
                              className="task"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {task.content}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <div className="add-task">
                <input
                  type="text"
                  placeholder="Add new task"
                  value={newTasks[column.id] || ""}
                  onChange={(e) =>
                    setNewTasks((prev) => ({ ...prev, [column.id]: e.target.value }))
                  }
                />
                <button onClick={() => addTask(column.id)}>Add</button>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
