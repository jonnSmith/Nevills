export interface iEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  time: string;
  allDay: boolean;
  repeat: boolean;
  photo: string;
  token: string;
  list: Array<String>
}
