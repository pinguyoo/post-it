import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NoteService } from '../note.service';
import { Note } from '../note';
import { fromEvent, merge } from 'rxjs';
import { concatAll, map, takeUntil, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  notes: Note[];

  @ViewChild('notesDOM', {static: false})
  notesDOM: ElementRef;
  
  @ViewChild('board', {static: false})
  board: ElementRef;

  constructor(private noteService: NoteService) { }

  ngOnInit() {
    this.getNotes();
  }

  getNotes() {
    this.noteService.getNotes()
      .subscribe(notes => this.notes = notes);
  }

  ngAfterViewInit() {
    this.createEventHandler();
  }

  createEventHandler() {
    const mouseUp$ = merge(fromEvent(this.notesDOM.nativeElement, 'mouseup'), fromEvent(this.board.nativeElement, 'mouseup'));
    const mouseMove$ = fromEvent(this.board.nativeElement, 'mousemove');
    const mouseDown$ = fromEvent(this.notesDOM.nativeElement, 'mousedown');

    const source$ = mouseDown$.pipe(
      map(event => mouseMove$.pipe(
        takeUntil(mouseUp$),
      )),
      concatAll(),
      withLatestFrom(mouseDown$, (move: MouseEvent, down: MouseEvent) => {
        return { 
          x: move.clientX - down.offsetX, 
          y: move.clientY - down.offsetY,
          target: event.target as HTMLElement 
        }
      }),
    );

    source$.subscribe((element) => {
      if (element.target.className === 'bar') {
        element.target.parentElement.style.left = element.x + 'px';
        element.target.parentElement.style.top = element.y + 'px';
      }
    });
  } 

}
