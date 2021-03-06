import { Injectable } from '@angular/core';

import { Note } from './note';
import { BehaviorSubject, Observable, of } from 'rxjs';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  notes: Note[];
  private subject = new BehaviorSubject(0);
  scrollSubject = this.subject.asObservable();

  constructor() { }

  getNotes(): Observable<Note[]> {
    if (this.notes) {
      return of(this.notes);
    }
    let cacheStr: string = localStorage.getItem('notes');
    let cache: Note[] = cacheStr ? (Array.from(JSON.parse(cacheStr)) || []) : [];
    this.notes = cache;
    return of(cache);
  }

  saveNotes(): void {
    if (!this.notes) {
      this.getNotes();
    }
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  upsertNote(note: Note): Observable<Note> {
    if (!this.notes) {
      this.getNotes();
    }

    let selectedNote: Note = _.find(this.notes, function(item) {
      return item.selected && item.id !== note.id;
    });

    if (selectedNote) {
      selectedNote.selected = false;
    }

    let targetNote: Note = _.find(this.notes, ['id', note.id]);
    let newNote: Note;
    if (!targetNote) {
      // create
      let id = this.getValidId(note.id);
      newNote = new Note(id);
      newNote.title = note.title || '';
      newNote.content = note.content || '';
      newNote.color = note.color || '';
      newNote.coordinate = note.coordinate || {};
      newNote.coordinate.x = note.coordinate.x || 0;
      newNote.coordinate.y = note.coordinate.y || 0;
      newNote.coordinate.z = note.coordinate.z || 0;
      newNote.selected = note.selected || false;
      this.notes.push(newNote);
    } else {
      // update
      _.forEach(note, (value, key) => {
        targetNote[key] = value;
      });
    }
    this.saveNotes();
    return targetNote ? of(targetNote) : of(newNote);
  }

  getValidId(id?: number): number {
    if (!id || _.find(this.notes, ['id', id]) !== undefined) {
      return (_.max(_.map(this.notes, 'id')) || 0) + 1;
    }
    return id;
  }

  deleteNote(id: number): Observable<Note[]> {
    let movedArray = _.remove(this.notes, (note) => {
      return note.id === id;
    });
    this.saveNotes();
    return of(movedArray);
  }

  scrollToNote(id: number) {
    this.subject.next(id);
  }
}
