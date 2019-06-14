import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Note } from '../../note';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  @Input() note: Note;

  @Output()
  private readonly close = new EventEmitter<boolean>();

  @ViewChild('content', {static: false})
  content: ElementRef;

  @ViewChild('title', {static: false})
  title: ElementRef;

  titleEditing: boolean;
  contentEditing: boolean;

  constructor() { }

  ngOnInit() {
    this.titleEditing = this.note.title.length === 0 ? true : false;
    this.contentEditing = false;
  }

  ngAfterViewInit() {
    if (this.titleEditing) {
      this.title.nativeElement.focus();
    }
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
      if (this.note.title.length === 0) {
        this.close.emit(true);
      } else {
        this.title.nativeElement.textContent = this.note.title;
        this.titleEditing = false;
      }
    } else {
      this.content.nativeElement.textContent = this.note.content;
      this.contentEditing = false;
    }
  }
}
