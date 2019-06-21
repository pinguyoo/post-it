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
  @Output()
  private readonly save = new EventEmitter<Note>();

  @ViewChild('content', {static: false})
  content: ElementRef;

  @ViewChild('title', {static: false})
  title: ElementRef;

  @ViewChild('noteBdy', {static: false})
  noteBdy: ElementRef;

  @ViewChild('colorPic', {static: false})
  colorPic: ElementRef;

  titleEditing: boolean;
  contentEditing: boolean;

  constructor() { }

  ngOnInit() {
    this.titleEditing = false;
    this.contentEditing = (this.note.title.length === 0 && this.note.content.length === 0) ? true : false;
  }

  ngAfterViewInit() {
    if (this.contentEditing) {
      this.content.nativeElement.focus();
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
    if (this.note.title.length === 0) {
      this.note.title = '未命名';
    }
    this.save.emit(this.note);
  }

  cancel(item) {
    if (item === 'title') {
      this.title.nativeElement.textContent = this.note.title;
      this.titleEditing = false;
    } else {
      this.content.nativeElement.textContent = this.note.content;
      this.contentEditing = false;
    }

    if (this.note.title.length === 0 && this.note.content.length === 0) {
      this.close.emit(true);
    }
  }

  changeNoteColor(event) {
    //console.log(event);
    //this.noteBdy.nativeElement.style.background = event.target.value;
  }
  /*
  blurBehavior(item, value) {
    console.log(this.title.nativeElement.textContent.length);
    if (this.note.title.length === 0 &&
        this.note.content.length === 0 &&
        this.title.nativeElement.textContent.length === 0 &&
        this.content.nativeElement.textContent.length === 0) {
      this.cancel(item);
    } else {
      this.update(item, value);
    }
  }
  */
}
