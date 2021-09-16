import { Channel } from './channel';

export interface Group {
  _id: string;
  name: string;
  assistants: number[];
  members: number[];
  channels: Channel[];
}
