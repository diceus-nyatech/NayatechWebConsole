import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-window-body',
  templateUrl: './window-body.component.html',
  styleUrls: ['./window-body.component.scss']
})
export class WindowBodyComponent implements OnInit {

  @Output() deleteMeEvent = new EventEmitter();
  @Input() name: string;

  constructor() { }

  ngOnInit() {
  }

  deleteMyself() {
    this.deleteMeEvent.emit();
  }
}
