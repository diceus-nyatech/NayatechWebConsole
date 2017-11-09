import { Component, Input, OnInit } from '@angular/core';
import {ISelectOption} from '../../interfaces/ISelectOption';

@Component({
  selector: 'app-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.scss']
})
export class SelectDropdownComponent implements OnInit {

  @Input() name: string;

  @Input() selectOptions: ISelectOption[];

  @Input() textPlaceholder: string;

  constructor() { }

  ngOnInit() {
  }

  selected(value: any): void {
    console.log('Selected value is: ', value);
  }
}
