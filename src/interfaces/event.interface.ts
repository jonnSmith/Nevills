export interface iEvent {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
  time: string;
  allDay: boolean;
  repeat: boolean;
  photo: string;
  list: Array<String>
}
