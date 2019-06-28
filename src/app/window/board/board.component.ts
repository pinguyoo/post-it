import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy  } from '@angular/core';
import { NoteService } from '../note.service';
import { Note } from '../note';
import { fromEvent } from 'rxjs';
import {  map, takeUntil, flatMap, finalize } from 'rxjs/operators';
import { maxBy as _maxBy, find as _find, remove as _remove } from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

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

  ngOnDestroy() {

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
    this.noteService.scrollToNote(this.notes[index].id);
  }

  private setMoveHandler() {
    const mouseUp$ = fromEvent(this.notesDOM.nativeElement, 'mouseup');
    const mouseMove$ = fromEvent(this.board.nativeElement, 'mousemove');
    const mouseDown$ = fromEvent(this.notesDOM.nativeElement, 'mousedown');

    const source$ = mouseDown$.pipe(
      flatMap((downEvent: MouseEvent) => {
        const startX = downEvent.offsetX;
        const startY = downEvent.offsetY;
        const downEventTarget = downEvent.target as HTMLElement;
        const moveTarget = downEventTarget.classList[0] === 'bar' ? downEventTarget.parentElement : downEventTarget.parentElement.parentElement;

        return mouseMove$.pipe(
          map((moveEvent: MouseEvent) => {
            moveEvent.preventDefault();
            return {
              left: moveEvent.clientX - startX,
              top: moveEvent.clientY - startY,
              target: moveTarget,
            };
          }),
          finalize(() => {
            const toppest = _maxBy(this.notes, function(note) {
              return note.coordinate.z;
            });
            let note = _find(this.notes, { 'id': parseInt(moveTarget.id) });
            if (note) {
              note.coordinate.x = parseInt(moveTarget.style.left.substring(0, moveTarget.style.left.length - 1));
              note.coordinate.y = parseInt(moveTarget.style.top.substring(0, moveTarget.style.top.length - 1));
              note.coordinate.z = toppest.coordinate.z + 1;
              note.selected = true;
              this.onSave(note);
            }
          }),
          takeUntil(mouseUp$),
        )
      }),
      untilDestroyed(this),
    )

    source$.subscribe((element) => {
      const parent = this.board.nativeElement;
      const target = element.target;

      const left = element.left < 0 ? 0 : Math.min(element.left, parent.offsetWidth - target.offsetWidth);
      const top = element.top < 0 ? 0 : Math.min(element.top, parent.offsetHeight - target.offsetHeight);
      target.style.left = (left / window.innerWidth) * 100  + '%';
      target.style.top = (top / window.innerHeight) * 100 + '%';
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
          x: (x / window.innerWidth) * 100,
          y: (y / window.innerHeight) * 100,
          target: event.target as HTMLElement,
          maxHeight: (parent.offsetHeight - y) + 'px',
        }
      }),
      untilDestroyed(this),
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
