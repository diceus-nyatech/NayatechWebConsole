import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-window-header',
  templateUrl: './window-header.component.html',
  styleUrls: ['./window-header.component.scss']
})
export class WindowHeaderComponent implements OnInit {

  @Input() name: string;
  @Input() stylingClass = 'bg-window-header-azure';

  @Output() deleteMeEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  private deleteMyself(): void {
    this.deleteMeEvent.emit();
  }
}
