export class Note {
  readonly id: number;
  title: string;
  content: string;
  color: string;
  coordinate: any;
  selected: boolean;
  maxHeight: number;

  constructor(id: number) {
    this.id = id;
  }
}
