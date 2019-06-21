import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NoteService } from '../note.service';
import { Note } from '../note';
import { fromEvent } from 'rxjs';
import {  map, takeUntil, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  notes: Note[];
  newNote: Note;

  @ViewChild('notesDOM', {static: false})
  notesDOM: ElementRef;

  @ViewChild('board', {static: false})
  board: ElementRef;

  @ViewChild('newDOM', {static: false})
  newDOM: ElementRef;

  constructor(private noteService: NoteService) { }

  ngOnInit() {
    this.getNotes();
  }

  getNotes() {
    this.noteService.getNotes()
      .subscribe(notes => this.notes = notes);
  }

  ngAfterViewInit() {
    this.setMoveHandler();
    this.setBoardClickHandler();
  }

  onDiscardNote(isClose: boolean): void {
    if (isClose) {
      delete this.newNote;
    }
  }

  onSave(note: Note): void {
    this.noteService.upsertNote(note)
      .subscribe(newNote => {
        delete this.newNote;
      });
  }

  onClick(index: number) {
    this.cancelSelected();
    this.notes[index].selected = true;
  }

  private setMoveHandler() {
    const mouseUp$ = fromEvent(this.notesDOM.nativeElement, 'mouseup');
    const mouseMove$ = fromEvent(this.board.nativeElement, 'mousemove');
    const mouseDown$ = fromEvent(this.notesDOM.nativeElement, 'mousedown');

    const source$ = mouseDown$.pipe(
      flatMap((downEvent: MouseEvent) => {
        const startX = downEvent.offsetX;
        const startY = downEvent.offsetY;

        return mouseMove$.pipe(
          map((moveEvent: MouseEvent) => {
            moveEvent.preventDefault();
            return {
              left: moveEvent.clientX - startX,
              top: moveEvent.clientY - startY,
              target: downEvent.target as HTMLElement,
            };
          }),
          takeUntil(mouseUp$),
        )
      }),
    )

    source$.subscribe((element) => {
      element.target.parentElement.style.left = element.left + 'px';
      element.target.parentElement.style.top = element.top + 'px';
    });
  }

  private setBoardClickHandler() {
    const click$ = fromEvent(this.board.nativeElement, 'click');
    const source$ = click$.pipe(
      map((event: MouseEvent) => {
        return {
          x: event.clientX,
          y: event.clientY,
          target: event.target as HTMLElement,
        }
      }),
    );

    source$.subscribe(element => {
      if (element.target.className === 'board') {
        this.createNote({ x: element.x, y: element.y });
      }
    });
  }

  private createNote(coordinate) {
    this.cancelSelected();
    this.newNote = {
      id: this.notes.length + 1,
      title: '',
      content: '',
      color: 'yellow',
      coordinate: coordinate,
      selected: true,
    };
  }

  private cancelSelected() {
    this.notes.forEach(note => note.selected = false);
  }
}
