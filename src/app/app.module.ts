import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WindowComponent } from './window/window.component';
import { ListComponent } from './window/list/list.component';
import { BoardComponent } from './window/board/board.component';
import { NoteComponent } from './window/board/note/note.component';

@NgModule({
  declarations: [
    AppComponent,
    WindowComponent,
    ListComponent,
    BoardComponent,
    NoteComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
