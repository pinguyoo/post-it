import { Injectable } from '@angular/core';

import { Note } from './note';
import { Observable, of } from 'rxjs';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  notes: Note[];
/*
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
*/

  constructor() { }

  getNotes(): Observable<Note[]> {
    if (this.notes) {
      return of(this.notes);
    }
    let cacheStr: string = localStorage.getItem('notes');
    if (!cacheStr) {
      this.notes = [];
      return of([]);
    }
    let cache: Note[] = Array.from(JSON.parse(cacheStr)) || [];
    this.notes = cache;
    return of(cache);
  }

  saveNotes(): void {
    if (!this.notes) {
      this.getNotes();
    }
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  upsertNote(note: Note): Note {
    if (!this.notes) {
      this.getNotes();
    }
    let targetNote: Note = _.find(this.notes, ['id', note.id]);
    let newNote: Note;
    if (!targetNote) {
      // create
      let id = this.getValidId(note.id);
      newNote = new Note(id);
      newNote.title = note.title || '';
      newNote.content = note.content || '';
      newNote.coordinate = note.coordinate || {};
      newNote.coordinate.x = note.coordinate.x || 0;
      newNote.coordinate.y = note.coordinate.y || 0;
      newNote.coordinate.z = note.coordinate.z || 0;
      this.notes.push(newNote);
    } else {
      // update
      _.forEach(note, (value, key) => {
        targetNote[key] = value;
      });
    }
    this.saveNotes();
    return targetNote ? targetNote : newNote;
  }

  getValidId(id: number): number {
    if (!id || _.find(this.notes, ['id', id]) !== undefined) {
      return (_.max(_.map(this.notes, 'id')) || 0) + 1;
    }
    return id;
  }
}
