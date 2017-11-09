import { Component, OnInit } from '@angular/core';
declare var require: any;

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  public imgLogo = require('../../../assets/images/logo-2.png');

  constructor() { }

  ngOnInit() {
  }

}
