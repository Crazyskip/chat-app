import { Channel } from './channel';

export interface Group {
  id: number;
  name: string;
  assistant: number;
  members: number[];
  channels: Channel[];
}
