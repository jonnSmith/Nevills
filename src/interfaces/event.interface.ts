export interface iTodo {
  checked: boolean;
  description: string;
}

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

export const emptyTodo = {
  description: '',
  checked: false
}
