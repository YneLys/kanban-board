import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Task as TaskType } from "../types";

interface TaskProps {
  task: TaskType;
  index: number;
}

const Task: React.FC<TaskProps> = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`bg-white rounded p-3 mb-2 shadow ${
            snapshot.isDragging ? "bg-blue-100" : ""
          }`}
        >
          {task.content}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
