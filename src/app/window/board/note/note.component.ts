import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Note } from '../../note';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  @Input() note: Note;

  @ViewChild('content', {static: false})
  content: ElementRef;

  @ViewChild('title', {static: false})
  title: ElementRef;

  titleEditing: boolean;
  contentEditing: boolean;

  constructor() { }

  ngOnInit() {
    this.titleEditing = false;
    this.contentEditing = false;
  }

  edit(item) {
    if (item === 'title') {
      this.titleEditing = true;
      setTimeout(() => this.title.nativeElement.focus(), 0); // TODO
    } else {
      this.contentEditing = true;
      setTimeout(() => this.content.nativeElement.focus(), 0); // TODO
    }
  }

  update(item, value) {
    if (item === 'title') {
      this.note.title = value;
      this.titleEditing = false;
    } else {
      this.note.content = value;
      this.contentEditing = false;
    }
  }

  cancel(item) {
    if (item === 'title') {
      this.title.nativeElement.textContent = this.note.title;
      this.titleEditing = false
    } else {
      this.content.nativeElement.textContent = this.note.content;
      this.contentEditing = false
    }
  }

}
