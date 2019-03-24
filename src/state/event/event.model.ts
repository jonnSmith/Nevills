// List item data structure with checkbox param
export interface iTodo {
  checked: boolean;
  description: string;
}

// Event data structure
export interface iEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  time: string;
  datestamp: string;
  photo: string;
  sound: string;
  token: string;
  list: Array<iTodo>
}

// Dummy item for dynamic list extend
export const emptyTodo = {
  description: '',
  checked: false
};
