import { Injectable } from '@angular/core';

import { Note } from './note';
import { Observable, of } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class NoteService {

  notes: Note[] = [
    {
      id: 1,
      title: 'title1title1title1title1title1title1title1title1title1title1',
      content: 'content1',
      color: 'red',
      coordinate: {
        x: 100,
        y: 100,
      }
    },
    {
      id: 2,
      title: 'title2',
      content: 'content2',
      color: 'blue',
      coordinate: {
        x: 400,
        y: 400,
      }
    }
  ];

  constructor() { }

  getNotes(): Observable<Note[]> {
    return of(this.notes);
  }
}
