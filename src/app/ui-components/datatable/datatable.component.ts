import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { DataTableResource } from 'angular-2-data-table';
import {IAdvanceFilterTableItem} from '../../interfaces/IAdvanceFilterTableItem';
import {IDatatableColumnProperty} from '../../interfaces/IDatatableColumnProperty';
import {IDatatableSettings} from '../../interfaces/IDatatableSettings';
import * as $ from 'jquery';

export class Person {
  name: string;
  active: boolean;
  email: string;
  jobTitle: string;
  phoneNumber: string;
  date: string;
}

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit, OnChanges {

  @Input() source: any[];
  @Input() settings: IDatatableSettings;
  @Input() showSelectColumn = false;
  @Input() showHeader = false;
  @Input() limit = 10;
  @Input() indexColumn = false;
  @Input() indexColumnHeader = '';

  @Output() itemWasSelected = new EventEmitter();

// pers2= [{ 'name': 'Aaron 2Moore', 'email': 'Heath44@hotmail.com',
// 'jobTitle': 'Regional Configuration Producer', 'active': true, 'phoneNumber': '611-898-6201', 'date': '2015-11-06T07:21:25.510Z' },
// { 'name': 'Yvonne Conroy Mrs.', 'email': 'Gideon9@yahoo.com',
// 'jobTitle': 'Global Mobility Orchestrator', 'active': false, 'phoneNumber': '115-850-0969', 'date': '2014-12-20T00:48:40.276Z' },
// { 'name': 'Laron Padberg', 'email': 'Laney_Huels@hotmail.com'
// , 'jobTitle': 'Senior Directives Supervisor', 'active': false, 'phoneNumber': '632-654-3034', 'date': '2015-09-29T04:33:38.544Z' }]
  // persons = [{ 'name': 'Server 1', 'email': 'Heath44@hotmail.com',
  //  'jobTitle': 'Regional Configuration Producer', 'active': true, 'phoneNumber': '2015-09-29', 'date': '100 000' },
  // { 'name': 'Server 2', 'email': 'Gideon9@yahoo.com',
  //  'jobTitle': 'Global Mobility Orchestrator', 'active': false, 'phoneNumber': '2015-09-29', 'date': '100 000' },
  // { 'name': 'Server 3', 'email': 'Laney_Huels@hotmail.com'
  // , 'jobTitle': 'Senior Directives Supervisor', 'active': false, 'phoneNumber': '2015-09-29', 'date': '100 000' }];
  selectedItems: string[] = [];
  itemResource: DataTableResource<any>;
  items = [];
  itemCount = 0;
  properties: IDatatableColumnProperty[];

  showOperations = false;

  constructor() {}

  ngOnInit() {
    this.getItemsFromSource();
    console.log('2');
    // if (!this.showHeader) {
    //   $('.table .thead').css('display', 'none');
    // }
  }
  ngOnChanges (changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['source']) {
      console.log('was changes');
      console.log(this.source);
      this.getItemsFromSource();
      $('.refresh-button').click();
        // this.groupPosts = this.groupByCategory(this.data);
    }
  }

  getItemsFromSource() {
    if (this.settings && this.settings.properties) {
      this.properties = this.settings.properties;
      if (this.settings.showOperations) {
        this.showOperations = this.settings.showOperations;
      }
    } else {
      return;
    }
    if (this.source == null) {
      return;
    }

    this.itemResource = new DataTableResource(this.source);
    this.itemResource.count().then(count => this.itemCount = count);
  }

reloadItems(params) {
  if (this.itemResource) {
    this.itemResource.query(params).then(items => this.items = items);
  }
}

// special properties:

rowClick(rowEvent) {
  if (rowEvent.row.item.serverName) {
    console.log('Clicked: ' + rowEvent.row.item.serverName);
    const server = rowEvent.row.item.serverName;
    const instance = rowEvent.row.item.instanceName;
    const database = rowEvent.row.item.databaseName;

    const item = { serverName: server,
                  instance: instance,
                  database: database,
                  key: server + instance + database
                };
    // this.selectedItems.push(rowEvent.row.item.serverName);
    this.itemWasSelected.emit(item);
  }
  if (rowEvent.row.item.name) {
    console.log('Clicked: ' + rowEvent.row.item.name);
    const item = rowEvent.row.item.name;
    // this.selectedItems.push(rowEvent.row.item.serverName);
    this.itemWasSelected.emit(item);
  }

}

rowDoubleClick(rowEvent) {
    // alert('Double clicked: ' + rowEvent.row.item.serverName);
}

rowTooltip(item) { return item.serverName; }

rowColors(item) {
  console.log('!!!!COLORS!!!');
  console.log(item);
  return '#fcf8e3';
}
switchSelect($event) {
  // console.log('switch select event');
  // $event.path[0] = '';
  // console.log($event.path[0]);
  // $event.path[0].text = 'Cancel';
}
}
