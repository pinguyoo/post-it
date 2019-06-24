import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Note } from '../../note';
import { cloneDeep as _cloneDeep } from 'lodash';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  @Input() note: Note;

  @Output()
  private readonly close = new EventEmitter<number>();
  @Output()
  private readonly save = new EventEmitter<Note>();

  @ViewChild('content', {static: false})
  content: ElementRef;

  @ViewChild('title', {static: false})
  title: ElementRef;

  titleEditing: boolean;
  contentEditing: boolean;

  constructor() { }

  ngOnInit() {
    this.titleEditing = false;
    this.contentEditing = (this.note.content.length === 0) ? true : false;
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

  onEnter() {
    this.diableEditing();
  }

  onEsc(item) {
    this.diableEditing();
    this.restore(item);
  }

  onBlur(event) {
    const value = event.target.textContent;
    const item = event.target.classList[0];

    if (this.titleEditing || this.contentEditing) {
      this.diableEditing();
    }

    if (this.note.content.length === 0 && value.length === 0) {
      this.close.emit(parseInt(event.target.parentElement.id));
    }

    if (item === 'title') {
      this.note.title = value;
    } else {
      this.note.content = value;
    }

    this.save.emit(this.note);
    this.restore(item);
  }

  private diableEditing() {
    this.titleEditing = false;
    this.contentEditing = false;
  }

  private restore(item: string) {
    if (item === 'title') {
      this.title.nativeElement.textContent = this.note.title;
    } else {
      this.content.nativeElement.textContent = this.note.content;
    }
  }

  changeNoteColor(event) {
    this.note.color = event.target.value;
    this.save.emit(this.note);
  }

  // blurBehavior(item, value) {
  //   console.log('enter');
  //   //console.log("U0 note:"+this.note.content+"; html:" + this.content.nativeElement.textContent+";");
  //   if (this.note.title.length === 0 &&
  //       this.note.content.length === 0 &&
  //       this.title.nativeElement.textContent.length === 0 &&
  //       this.content.nativeElement.textContent.length === 0) {
  //     this.cancel(item);
  //   } else {
  //     //console.log("U1 note:"+this.note.content+"; html:" + this.content.nativeElement.textContent+";");
  //     this.update(item, value);
  //     //console.log("U2 note:"+this.note.content+"; html:" + this.content.nativeElement.textContent+";");
  //   }
  // }
}
