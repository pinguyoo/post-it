import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Note } from '../../note';
import { cloneDeep as _cloneDeep } from 'lodash';

declare var tinycolor: any;

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
  darkMode: boolean;

  constructor() { }

  ngOnInit() {
    this.titleEditing = false;
    this.contentEditing = (this.note.content.length === 0) ? true : false;
    this.darkMode = tinycolor(this.note.color).isDark();
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

  onEnter(event) {
    this.diableEditing();
  }

  onEnterDown(event) {
    event.preventDefault();
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
      this.close.emit(parseInt(event.target.parentElement.parentElement.id));
      return;
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
    this.darkMode = tinycolor(this.note.color).isDark();
    this.save.emit(this.note);
  }
}
