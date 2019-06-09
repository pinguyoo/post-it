import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    if (typeof Storage !== 'undefined') {
    } else {
      alert("This browser not suppot LocalStorage");
    }
  }

}
