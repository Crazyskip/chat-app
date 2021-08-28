import { Channel } from './channel';

export interface Group {
  id: number;
  name: string;
  assistants: number[];
  members: number[];
  channels: Channel[];
}
