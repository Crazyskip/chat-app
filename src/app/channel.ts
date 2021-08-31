import { Message } from './message';

export interface Channel {
  id: number;
  name: string;
  members: number[];
  messages: Message[];
}
