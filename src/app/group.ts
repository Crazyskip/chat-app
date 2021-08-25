export interface Group {
  name: string;
  assistant: number;
  members: number[];
  channels: [{ name: string; members: number[] }];
}
