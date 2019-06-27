import { Component, ElementRef, OnInit, ViewChildren, QueryList } from '@angular/core';
import { NoteService } from '../note.service';
import { Note } from '../note';
import { maxBy as _maxBy, find as _find } from 'lodash';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  notes: Note[]

  @ViewChildren('notesDOM')
  notesDOM: QueryList<ElementRef>;

  constructor(private noteService: NoteService) { }

  ngOnInit() {
    this.getNotes();
  }

  ngAfterViewInit() {
    this.noteService.scrollSubject.subscribe(id => {
      this.notesDOM.forEach(dom => {
        if (dom.nativeElement.id === id.toString()) {
          dom.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      })
    });
  }

  getNotes() {
    this.noteService.getNotes()
      .subscribe(notes => this.notes = notes);
  }

  onClick(index: number) {
    this.notes.forEach(note => note.selected = false);
    const toppest = _maxBy(this.notes, function(note) {
      return note.coordinate.z;
    });
    this.notes[index].coordinate.z = toppest.coordinate.z + 1;
    this.notes[index].selected = true;
    this.noteService.upsertNote(this.notes[index]).subscribe();
  }

  deleteNote(note: Note) {
    this.noteService.deleteNote(note.id)
      .subscribe((deletedNotes) => {
        console.log('deleted', deletedNotes);
      });
  }
}
