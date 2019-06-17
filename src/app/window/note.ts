export class Note {
  readonly id: number;
  title: string;
  content: string;
  color: string;
  coordinate: any;
  selected: boolean;

  constructor(id: number) {
    this.id = id;
  }
}
