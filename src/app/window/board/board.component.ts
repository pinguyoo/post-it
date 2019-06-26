import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef  } from '@angular/core';
import { NoteService } from '../note.service';
import { Note } from '../note';
import { fromEvent } from 'rxjs';
import {  map, takeUntil, flatMap, finalize } from 'rxjs/operators';
import { maxBy as _maxBy, find as _find, remove as _remove } from 'lodash';

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

  constructor(private noteService: NoteService, private changeDetectorRef: ChangeDetectorRef) { }

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

  onDiscardNote(id: number): void {
    if (id) {
      _remove(this.notes, { id: id });
      this.changeDetectorRef.detectChanges();
    }
  }

  onSave(note: Note): void {
    this.noteService.upsertNote(note)
      .subscribe(newNote => {});
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
          finalize(() => {
            const mouseUpEvent = event as MouseEvent;
            const target = event.target as HTMLElement;
            const toppest = _maxBy(this.notes, function(note) {
              return note.coordinate.z;
            });
            let note = _find(this.notes, { 'id': parseInt(target.id) });
            if (note) {
              note.coordinate.x = mouseUpEvent.clientX - startX;
              note.coordinate.y = mouseUpEvent.clientY - startY;
              note.coordinate.z = toppest.coordinate.z + 1;
              note.selected = true;
              this.onSave(note);
            }
          }),
          takeUntil(mouseUp$),
        )
      }),
    )

    source$.subscribe((element) => {
      const parent = this.board.nativeElement;
      const target = element.target.parentElement;

      const left = element.left < 0 ? 0 : Math.min(element.left, parent.offsetWidth - target.offsetWidth);
      const top = element.top < 0 ? 0 : Math.min(element.top, parent.offsetHeight - target.offsetHeight);
      target.style.left = left + 'px';
      target.style.top = top + 'px';
    });
  }

  private setBoardClickHandler() {
    const click$ = fromEvent(this.board.nativeElement, 'click');
    const source$ = click$.pipe(
      map((event: MouseEvent) => {
        const parent = this.board.nativeElement;
        const x = event.clientX + 200 > parent.offsetWidth ? event.clientX - 200 : event.clientX;
        const y = event.clientY + 130 > parent.offsetHeight ? event.clientY - 130 : event.clientY;
        return {
          x: x,
          y: y,
          target: event.target as HTMLElement,
          maxHeight: (parent.offsetHeight - y) + 'px',
        }
      }),
    );

    source$.subscribe(element => {
      if (element.target.className === 'board') {
        this.createNote({ x: element.x, y: element.y, z: 0 }, element.maxHeight);
      }
    });
  }

  private createNote(coordinate, maxHeight) {
    this.cancelSelected();
    const newNote = {
      id: this.noteService.getValidId(),
      title: '未命名',
      content: '',
      color: '#ffffa5',
      coordinate: coordinate,
      selected: true,
      maxHeight: maxHeight,
    };
    this.notes.push(newNote);
  }

  private cancelSelected() {
    this.notes.forEach(note => note.selected = false);
  }
}
