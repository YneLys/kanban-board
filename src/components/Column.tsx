import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";
import { Column as ColumnType, Task as TaskType } from "../types";

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
  onAddTask: (columnId: string, content: string) => void;
}

const Column: React.FC<ColumnProps> = ({ column, tasks, onAddTask }) => {
  const [newTaskContent, setNewTaskContent] = useState("");

  const handleAddTask = () => {
    const trimmed = newTaskContent.trim();
    if (trimmed) {
      onAddTask(column.id, trimmed);
      setNewTaskContent("");
    }
  };

  return (
    <div className="bg-gray-100 rounded p-4 flex flex-col w-80 max-w-full">
      <h2 className="font-bold mb-4">{column.title}</h2>
      <Droppable droppableId={column.id} type="task">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col min-h-[100px] ${
              snapshot.isDraggingOver ? "bg-blue-50" : ""
            }`}
          >
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Add new task"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddTask();
          }}
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Column;
