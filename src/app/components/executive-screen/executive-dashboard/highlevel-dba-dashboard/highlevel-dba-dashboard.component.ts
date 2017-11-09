import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {IChartItem} from '../../../../interfaces/IChartItem';
import {ServerService} from '../../../../services/server.service';
import {GuidGeneratorService} from '../../../../services/guid-generator.service';
import {IFeature} from '../../../../interfaces/IFeature';
import {PdfGeneratorService} from '../../../../services/pdf-generator.service';
import {IDetailedDBADashboardModel} from '../../../../interfaces/IDetailedDBADashboardModel';

export interface IFeatureChart {
  title: string;
  seriesName: string;
  chartItems: IChartItem[];
}

@Component({
  selector: 'app-highlevel-dba-dashboard',
  templateUrl: './highlevel-dba-dashboard.component.html',
  styleUrls: ['./highlevel-dba-dashboard.component.scss'],
  providers: [ServerService, GuidGeneratorService, PdfGeneratorService]
})

export class HighlevelDbaDashboardComponent implements OnInit {

  @Output() openDetailedDBADashboard = new EventEmitter();
  @Output() closeDetailedDBADashboard = new EventEmitter();

  @Input() selectedServers: string[];
  // @Input() featuresItems: IChartItem[] = [];
  featuresChartsData: IFeatureChart[] = [];
  serverData: any[];

  constructor(
    private serverService: ServerService,
    private guidGeneratorService: GuidGeneratorService,
    private pdfGeneratorService: PdfGeneratorService
    ) { }

  ngOnInit() {
    const vm = this;
    vm.serverService.getServers().subscribe(response => {
      vm.serverData = response.servers;
      vm.fillFeaturesItems();
      vm.guidGeneratorService.scrollWindowToRight();
    });
  }

  fillFeaturesItems() {
    const vm = this;
    const _featureCharts: IFeatureChart[] = [];
    // const selectedServerArr = [];
    // if (vm.selectedServer) {
    //   selectedServerArr.push(vm.selectedServer);
    // }

    for (let index = 0; index < vm.serverData.length; index++) {
      // const server = vm.serverData[index];
      if (!vm.guidGeneratorService.elementWasSelected(vm.serverData[index].server_name, this.selectedServers)) {
         continue;
      }
      if (!vm.serverData[index].instances) {
        continue;
      }
      const instances = vm.serverData[index].instances;

      for (let k = 0; k < instances.length; k++) {
        const instance = instances[k];
        const featureItems: IChartItem[] = [];

        if (!instance.features) {
          continue;
        }

        for (let i = 0; i < instance.features.length; i++) {
          // _featureList.push()
          const featureObject = instance.features[i];
          featureItems.push({name: featureObject.name, value: featureObject.score});
        }
        _featureCharts.push({chartItems: featureItems, seriesName: `${vm.serverData[index].server_name}:${instance.name}`,
           title: `${vm.serverData[index].server_name}:${instance.name}`});
      }
    }
    vm.featuresChartsData = _featureCharts;
    // for (let index = 5; index > 0; index--) {
    //   this.featuresItems.push({name: 'Feature ' + index, value: 10 * index});
    // }
  }

  showAllServersFeatures() {
    this.closeDetailedDBADashboard.emit();
    this.selectedServers = [];
    this.fillFeaturesItems();
  }

  onChartItemSelect(selectedInstances: IFeature) {

    let detailedDBAModel: IDetailedDBADashboardModel;
    detailedDBAModel = this.fillDetailedDBAModel(selectedInstances);
    this.openDetailedDBADashboard.emit(detailedDBAModel);
  }

  downloadReport() {
    this.pdfGeneratorService.downloadHighLevelReport();
  }

  private fillDetailedDBAModel(featureInfo: IFeature): IDetailedDBADashboardModel {
    const vm = this;
    let detailedDBAModel: IDetailedDBADashboardModel = null;
    for (let index = 0; index < vm.serverData.length; index++) {
      const server = vm.serverData[index];
      if (featureInfo.serverName !== server.server_name) {
         continue;
      }
      if (!server.instances) {
        break;
      }

      const instances = server.instances;
      let serverCost = 0;
      for (let index2 = 0; index2 < instances.length; index2++) {
        const instance = instances[index2];
        serverCost += instance.cost;
      }
      detailedDBAModel = {
        hostName: server.server_name,
        cpuNumber: server.cpu_count,
        ipAddress: server.ip,
        oracleVersion: server.instances[0].oracle_version,
        cost: serverCost,
        selectedFeature: featureInfo.featureName
      };
    }
    return detailedDBAModel;
  }
}
