import { Component, OnInit } from '@angular/core';
import { NoteService } from '../note.service';
import { Note } from '../note';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  notes: Note[]

  constructor(private noteService: NoteService) { }

  ngOnInit() {
    this.getNotes();
  }

  getNotes() {
    this.noteService.getNotes()
      .subscribe(notes => this.notes = notes);
  }

  onClick(index: number) {
    this.notes.forEach(note => note.selected = false);
    this.notes[index].selected = true;
  }

  deleteNote(note: Note) {
    this.noteService.deleteNote(note.id)
      .subscribe((deletedNotes) => {
        console.log('deleted', deletedNotes);
      });
  }
}
