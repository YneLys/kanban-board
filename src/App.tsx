import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Column from "./components/Column";
import { BoardData, ColumnType, TaskType } from "./types";
import { saveToLocalStorage, loadFromLocalStorage } from "./utils/localStorage";

const initialData: BoardData = {
  columns: {
    "column-1": {
      id: "column-1",
      title: "To Do",
      taskIds: ["task-1", "task-2"]
    },
    "column-2": {
      id: "column-2",
      title: "In Progress",
      taskIds: ["task-3"]
    },
    "column-3": {
      id: "column-3",
      title: "Done",
      taskIds: []
    }
  },
  tasks: {
    "task-1": { id: "task-1", content: "Task 1" },
    "task-2": { id: "task-2", content: "Task 2" },
    "task-3": { id: "task-3", content: "Task 3" }
  },
  columnOrder: ["column-1", "column-2", "column-3"]
};

function App() {
  const [boardData, setBoardData] = useState<BoardData>(() => {
    const stored = loadFromLocalStorage("kanbanData");
    return stored || initialData;
  });

  useEffect(() => {
    saveToLocalStorage("kanbanData", boardData);
  }, [boardData]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (type === "column") {
      const newColumnOrder = Array.from(boardData.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      setBoardData({
        ...boardData,
        columnOrder: newColumnOrder
      });
      return;
    }

    const startColumn = boardData.columns[source.droppableId];
    const finishColumn = boardData.columns[destination.droppableId];

    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn: ColumnType = {
        ...startColumn,
        taskIds: newTaskIds
      };

      setBoardData({
        ...boardData,
        columns: {
          ...boardData.columns,
          [newColumn.id]: newColumn
        }
      });
      return;
    }

    // Moving from one column to another
    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStartColumn: ColumnType = {
      ...startColumn,
      taskIds: startTaskIds
    };

    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinishColumn: ColumnType = {
      ...finishColumn,
      taskIds: finishTaskIds
    };

    setBoardData({
      ...boardData,
      columns: {
        ...boardData.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn
      }
    });
  };

  const addTask = (columnId: string) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask: TaskType = {
      id: newTaskId,
      content: "New Task"
    };

    const column = boardData.columns[columnId];
    const newTaskIds = [...column.taskIds, newTaskId];

    const newColumn: ColumnType = {
      ...column,
      taskIds: newTaskIds
    };

    setBoardData({
      ...boardData,
      tasks: {
        ...boardData.tasks,
        [newTaskId]: newTask
      },
      columns: {
        ...boardData.columns,
        [columnId]: newColumn
      }
    });
  };

  const addColumn = () => {
    const newColumnId = `column-${Date.now()}`;
    const newColumn: ColumnType = {
      id: newColumnId,
      title: "New Column",
      taskIds: []
    };

    setBoardData({
      ...boardData,
      columns: {
        ...boardData.columns,
        [newColumnId]: newColumn
      },
      columnOrder: [...boardData.columnOrder, newColumnId]
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Kanban Board</h1>
      <button
        onClick={addColumn}
        className="mb-6 rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
      >
        Add Column
      </button>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-auto">
          {boardData.columnOrder.map((columnId, index) => {
            const column = boardData.columns[columnId];
            const tasks = column.taskIds.map((taskId) => boardData.tasks[taskId]);
            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                index={index}
                addTask={addTask}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
