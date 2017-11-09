import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {ISelectOption} from '../../../interfaces/ISelectOption';


@Component({
  selector: 'app-playbook-search',
  templateUrl: './playbook-search.component.html',
  styleUrls: ['./playbook-search.component.scss']
})
export class PlaybookSearchComponent implements OnInit {

  @Output() deleteMeEvent = new EventEmitter();

  featureList: ISelectOption[] = [];

  constructor() { }

  ngOnInit() {
    this.fillFeatureList();
  }

  fillFeatureList() {
    // for (let index = 0; index < 10; index++) {
    //   this.featureList.push({id: index, text: 'Feature ' + index});
    // }
    this.featureList.push({id: 1, text: 'Oracle Anonymous Block'});
  }

  showFeatureInfo() {

  }

  deleteMyself() {
    this.deleteMeEvent.emit();
  }

}
