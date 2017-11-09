import { Component, OnInit, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef, ViewChild } from '@angular/core';
declare var require: any;

@Component({
  selector: 'app-playbook',
  templateUrl: './playbook.component.html',
  styleUrls: ['./playbook.component.scss']
})
export class PlaybookComponent implements OnInit {

  @ViewChild('windowBodyContainer', { read: ViewContainerRef }) container;
  componentRef: ComponentRef<any>;

  htmlTemplate = require('./html-templates/oracle -anonymous-block/oracle-anonymous-block.html');

  showSearch = true;
  showBody = true;

  constructor(private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
  }

  destroySearch() {
    this.showSearch = false;
  }

  destroyBody() {
    this.showBody = false;
  }


}
