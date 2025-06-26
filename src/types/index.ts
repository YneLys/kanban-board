export type TaskType = {
  id: string;
  content: string;
};

export type ColumnType = {
  id: string;
  title: string;
  taskIds: string[];
};

export type BoardData = {
  columns: ColumnType[];
  tasks: Record<string, TaskType>;
};
