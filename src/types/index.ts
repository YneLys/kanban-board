export interface TaskType {
  id: string;
  content: string;
}

export interface ColumnType {
  id: string;
  title: string;
  taskIds: string[];
}

export interface BoardData {
  tasks: { [key: string]: TaskType };
  columns: { [key: string]: ColumnType };
  columnOrder: string[];
}
