import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {IChartItem} from '../../../interfaces/IChartItem';
import {IServerMostComplexityItem} from '../../../interfaces/IServerMostComplexityItem';
import {IServerData} from '../../../interfaces/IServerData';
import {IDatatableSettings} from '../../../interfaces/IDatatableSettings';
import {WindowBodyComponent} from '../../window-body/window-body.component';
import {HighlevelDbaDashboardComponent} from './highlevel-dba-dashboard/highlevel-dba-dashboard.component';
import {GuidGeneratorService} from '../../../services/guid-generator.service';
import {ServersService} from '../../../services/servers.service';
import {ServerService} from '../../../services/server.service';
import {PdfGeneratorService} from '../../../services/pdf-generator.service';


@Component({
  selector: 'app-executive-dashboard',
  templateUrl: './executive-dashboard.component.html',
  styleUrls: ['./executive-dashboard.component.scss'],
  providers: [GuidGeneratorService, ServersService, ServerService, PdfGeneratorService]
  // entryComponents: [WindowBodyComponent, HighlevelDbaDashboardComponent]
})

export class ExecutiveDashboardComponent implements OnInit {


  @Output() openHighLevelDBADasboardEvent = new EventEmitter();
  // executiveDashboardComponentRef: ComponentRef<WindowBodyComponent>;

  @Input() costsItems: IServerData[];
  filteredServers: IServerData[];

  dataView = 'chartsView';

  // cost reduction
  serverMinCost = 0;
  serverMaxCost = 500000;
  costReductionValue: number;
  // sliderStep = 10000;

  mostExpensiveItems: IChartItem[] = [];
  mostComplexItems: IServerMostComplexityItem[] = [];
  summaryCostReduction: string;

  mainServersDatatableSettings: IDatatableSettings = {showOperations: false, properties: [{
    property: 'name',
    header: 'Server name',
    resizable: true,
    sortable: true,
    width: 500,
  },
  {
    property: 'value',
    header: 'Value',
    resizable: true,
    sortable: true,
    width: 100,
  }
]};

mostComplexServersDatatableSettings: IDatatableSettings = {showOperations: false, properties: [{
  property: 'rank',
  header: 'Rank',
  resizable: true,
  sortable: true,
  width: 100,
},
{
  property: 'name',
  header: 'Name',
  resizable: true,
  sortable: true,
  width: 300,
},
{
  property: 'score',
  header: 'Complexity Score',
  resizable: true,
  sortable: true,
  width: 200,
},
{
  property: 'cost',
  header: 'Cost',
  resizable: true,
  sortable: true,
  width: 300,
}
]};

  constructor(
    private guidGeneratorService: GuidGeneratorService,
    private serversService: ServersService,
    private pdfGeneratorService: PdfGeneratorService) { }

  ngOnInit() {
    // this.fillCostsItems();
    this.fillServerMinAndMaxValues();
    this.fillMostExpensiveItems();
    this.fillMostComplexItems();
    this.fillSummaryCostReduction();
    this.filteredServers = this.costsItems;
    this.fillServerMinAndMaxValues();
  }

  fillMostExpensiveItems() {
    const selectedServers = this.costsItems.map(server => server.name);
    this.serversService.fillTopExpensiveServers(selectedServers);
    this.serversService.mostExpensiveServers.subscribe(resp => {
      this.mostExpensiveItems = resp;
    });
  }

  fillMostComplexItems() {
    const selectedServers = this.costsItems.map(server => server.name);
    this.serversService.fillTopComplexServers(selectedServers);
    this.serversService.mostComplicatedServers.subscribe(resp => {
      this.mostComplexItems = resp;
    });
    // this.mostComplexItems.push({name: 'uext.co.63', value: 55000});
    // this.mostComplexItems.push({name: 'corptek.com.64', value: 35000});
    // this.mostComplexItems.push({name: 'keycast.me.0', value: 35000});
    // this.mostComplexItems.push({name: 'vtgrafix.edu.71', value: 35000});
    // this.mostComplexItems.push({name: 'westgate.com.96', value: 30000});
    // for (let index = 5; index > 0; index--) {
    //   this.mostComplexItems.push({name: 'Server ' + this.getRandomNumber(1, 50), value: 10 * index});
    // }
  }

  fillCostsItems() {
    // console.log("chartItems");
    // console.log(this.costsItems);
    // for (let index = 10; index > 0; index--) {
    //   this.costsItems.push({name: 'Server ' + this.getRandomNumber(1, 50), value: 10 * index});
    // }
  }

  downloadReport() {
    this.pdfGeneratorService.downloadExecutiveReport();
  }
  // testChangeData() {
  //   for (let index = 10; index > 0; index--) {
  //     this.costsItems.push({name: 'Server ' + this.getRandomNumber(1, 50), value: 10 * index});
  //   }
  // }

  getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  changeView() {
    if (this.dataView === 'chartsView') {
      this.dataView = 'tableView';
    } else {
      this.dataView = 'chartsView';
    }
  }

  openHighLevelDBADasboard() {
    const selectedServers = this.costsItems.map(item => item.name);
    this.openHighLevelDBADasboardEvent.emit(selectedServers);
  }

  onChartItemSelect(selectedServer) {
    const selectedServers: string[] = [];
    selectedServers.push(selectedServer);
    this.openHighLevelDBADasboardEvent.emit(selectedServers);
  }

  onDatatableItemSelect(serverName) {
    if (serverName) {
      const selectedServers: string[] = [];
      selectedServers.push(serverName);
      this.openHighLevelDBADasboardEvent.emit(selectedServers);
    }
  }

  fillSummaryCostReduction() {
    const vm = this;
    const serverNames = this.costsItems.map(item => item.name);
    vm.serversService.fillCostReductionSelectedServers(serverNames);
    vm.serversService.costReductionSelectedServers.subscribe(
      costReduction => vm.summaryCostReduction = costReduction.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    );
    // return this.guidGeneratorService.getSumFromArray(values);
  }

  filterServers(costReductionRestiction: number) {
    const vm = this;

    if (!costReductionRestiction) {
      return;
    }
    const filteredServers: IServerData[] = [];
    const sortedServers = vm.costsItems.sort((a, b) => {
      return b.value - a.value;
    });
    let sumOfAllowableCosts = 0;
    for (let index = 0; index < sortedServers.length; index++) {
      const server = sortedServers[index];
      if (server.cost > costReductionRestiction) {
        continue;
      }
      else if ((server.cost + sumOfAllowableCosts) > costReductionRestiction) {
        continue;
      }
      else{
        sumOfAllowableCosts += server.cost;
        filteredServers.push({name: server.name, value: server.value, cost: server.cost});
      }
    }
    vm.filteredServers = filteredServers.sort((a, b) => {
      return a.value - b.value;
    });
    // this.fillServerMinAndMaxValues();
  }

  fillServerMinAndMaxValues() {
    const vm = this;
    if (!vm.filteredServers || vm.filteredServers.length === 0) {
      return;
    }
    else if (vm.filteredServers.length === 1) {
      vm.serverMaxCost = vm.filteredServers[0].cost;
      vm.serverMinCost = 0;
    }
    else {
      const costValues = vm.filteredServers.map(item => item.cost);
      vm.serverMaxCost = vm.guidGeneratorService.getSumFromArray(costValues);
      vm.serverMinCost = vm.guidGeneratorService.getMinValueFromArray(costValues);
    }
  }
}
