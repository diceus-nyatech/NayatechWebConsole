import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {ISelectOption} from '../../../interfaces/ISelectOption';
import {ServerService} from '../../../services/server.service';
import {GuidGeneratorService} from '../../../services/guid-generator.service';
import {ServersService} from '../../../services/servers.service';
import {IFilterState} from '../../../interfaces/IFilterState';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.scss'],
  providers: [ServerService, GuidGeneratorService, ServersService]
})
export class QuickSearchComponent implements OnInit {

  @Output() deleteMeEvent = new EventEmitter();
  @Output() openAdvancedFilterEvent = new EventEmitter();
  @Output() openExecutiveDashboardEvent = new EventEmitter();
  // hideAdvancedFilter = true;
  @Input() selectedServers: string[] = [];
  multiselectFeaturesDisabled = false;
  @Input() selectedFeatures: string[] = [];
  @Input() selectedInstances: string[] = [];



  serverData: any[];

  serverList: IMultiSelectOption[] = [];
  featureList: IMultiSelectOption[] = [];
  databaseList: IMultiSelectOption[] = [];
  instanceList: IMultiSelectOption[] = [];

  selectedServerList: string[] = [];
  selectedFeatureList: string[] = [];

  oracleVersionList: ISelectOption[] = [];
  cpuNumberList: ISelectOption[] = [];
  userSuppliedTagsList: ISelectOption[] = [];




  constructor(
    private httpService: ServerService,
    private guidGeneratorService: GuidGeneratorService,
    private serversService: ServersService) { }

  ngOnInit() {

   this.loadServers();
   console.log(this.serverData);
  }

  // toggleAdvancedFilterVisability() {
  //   this.hideAdvancedFilter = !this.hideAdvancedFilter;
  // }
  loadServers() {
    const vm = this;

    vm.httpService.getServers().subscribe((response) => {
      vm.serverData = response.servers;
      vm.fillServersList();
      vm.fillFeatureList();

      // vm.fillServerSumAndMinCosts();
      // vm.fillDatabasesList();
      // vm.fillInstancesList();

      // vm.fillOracleVersionList();
      // vm.fillCpuNumberList();
      // vm.filluserSuppliedTagsList();
      });

  }

  fillServersList() {
    const vm = this;
    const _tempList: IMultiSelectOption[] = [];
    for (let index = 0; index < vm.serverData.length; index++) {
      _tempList.push({id: vm.serverData[index].server_name, name: vm.serverData[index].server_name});
    }
    vm.serverList = _tempList;
  }

  fillFeatureList() {
    const vm = this;
    const _featureList: IMultiSelectOption[] = [];
    for (let index = 0; index < vm.serverData.length; index++) {
      // const server = vm.serverData[index];
      if (!vm.serverData[index].instances) {
        continue;
      }
      const instances = vm.serverData[index].instances;

      for (let k = 0; k < instances.length; k++) {
        const instance = instances[k];

        if (!instance.features) {
          continue;
        }

        for (let i = 0; i < instance.features.length; i++) {
          // _featureList.push()
          const featureObject = instance.features[i].name;
            _featureList.push({id: featureObject, name: featureObject});
        }
      }
    }
    const uniqueList = vm.guidGeneratorService.retunUniqueArray(_featureList);
    vm.featureList = uniqueList;
  }

  fillDatabasesList() {
    for (let index = 0; index < 10; index++) {
      this.databaseList.push({id: index, name: 'Database ' + index});
    }
  }

  fillInstancesList() {
    for (let index = 0; index < 10; index++) {
      this.instanceList.push({id: index, name: 'Instance ' + index});
    }
  }

  fillOracleVersionList() {
    for (let index = 0; index < 10; index++) {
      this.oracleVersionList.push({id: index, text: '14.0.0.' + index});
    }
  }

  fillCpuNumberList() {
    for (let index = 0; index < 10; index++) {
      this.cpuNumberList.push({id: index, text: '' + index * 2});
    }
  }

  filluserSuppliedTagsList() {
    for (let index = 0; index < 10; index++) {
      this.userSuppliedTagsList.push({id: index, text: 'Dev' + index + ' servers'});
    }
  }

  deleteMyself() {
    this.deleteMeEvent.emit();
  }

  openAdvanedFilter() {
    this.openAdvancedFilterEvent.emit();
  }

  useSelectedServers(selectedServers) {
    // this.fillServerSumAndMinCosts();
    if (selectedServers && selectedServers.length !== 0) {
      this.multiselectFeaturesDisabled = true;
    }
    else{
      this.multiselectFeaturesDisabled = false;
    }

    this.selectedServerList = selectedServers;

  }

  useSelectedFeatures(selectedFeatures) {
    // this.fillServerSumAndMinCosts();
    const vm = this;
    const _tempList: IMultiSelectOption[] = [];
    for (let index1 = 0; index1 < vm.serverData.length; index1++) {
      const server = vm.serverData[index1];
      if (!server.instances) {
        continue;
      }
      let instanceHasFeature = false;
      for (let index2 = 0; index2 < server.instances.length; index2++) {
        const instance = server.instances[index2];
        if (!instance.features) {
          continue;
        }
        for (let index3 = 0; index3 < instance.features.length; index3++) {
          const feature = instance.features[index3];
          if (!vm.guidGeneratorService.elementWasSelected(feature.name, selectedFeatures)) {
            continue;
          }
          else {
            instanceHasFeature = true;
            break;
          }
        }
      }
      if (instanceHasFeature) {
        _tempList.push({id: vm.serverData[index1].server_name, name: vm.serverData[index1].server_name});
      }
      // _tempList.push({id: vm.serverData[index].server_name, name: vm.serverData[index].server_name});
    }
    vm.serverList = _tempList;
    this.selectedFeatureList = selectedFeatures;
  }

  openExecutiveDashboard(cost) {
    const vm = this;

    // this.costReductionValue = cost;
    // if (cost) {
    //   return;
    // }
    // else if (!cost) {
    //   cost = vm.serverMinCost;
    // }
    let chartItems: any[] = [];
    chartItems = vm.getChartItems(cost);
    chartItems =  chartItems.sort(function(a, b) {
      return a.value - b.value;
    });
    const filterState: IFilterState = {
      selectedItems: chartItems,
      selectedServersInFilter: vm.selectedServerList,
      selectedInstancesInFilter: null,
      selectedFeaturesInFilter: vm.selectedFeatureList,
    };
    this.openExecutiveDashboardEvent.emit(filterState);
  }

  getChartItems(costReductionRestiction?) {
    const vm = this;
    const chartItems: any[] = [];
    let tempServers: any[] = [];

    // let selectedServers: string[] = [];
    // if (this.selectedServersInDatatable) {
    //   selectedServers = this.selectedServersInDatatable.map(item => item.serverName);
    // } else {
    //   selectedServers = this.datatableSource.map((server) => server.serverName);
    // }
    // const uniqSelectedServers = this.guidGeneratorService.retunUniqueArray(selectedServers);

    for (let i1 = 0; i1 < vm.serverData.length; i1++) {
      const server = vm.serverData[i1];
      let serverScore = 0;
      let serverCost = 0;
      if (!server.instances) {
        continue;
      }

      if (!vm.guidGeneratorService.elementWasSelected(server.server_name, vm.selectedServerList)) {
        continue;
      }

      for (let i2 = 0; i2 < server.instances.length; i2++) {
        const instance = server.instances[i2];

        if (!vm.guidGeneratorService.elementWasSelected(instance.name, vm.selectedInstances)) {
          continue;
        }

        serverCost += instance.cost;
        // if (instance.cost > costReductionRestiction) {
        //   continue;
        // }
        // else if ((sumOfAllowableCosts + instance.cost) > costReductionRestiction) {
        //   continue;
        // }
        // else {
        //   sumOfAllowableCosts += instance.cost;
        // }

        if (!instance.features) {
          continue;
        }

        if (instance.features) {
          // let instanceFeaturesWasSelected = false;
          let featuresCount = 0;
          let notSelectedFeaturesCount = 0;
          for (let r = 0; r < instance.features.length; r++) {
            // _featureList.push()
            const featureObject = instance.features[r];
              featuresCount++;
              if (!vm.guidGeneratorService.elementWasSelected(featureObject.name, this.selectedFeatureList)) {
                notSelectedFeaturesCount++;
              }
              serverScore += featureObject.score;
          }
          if (notSelectedFeaturesCount === featuresCount) {
            continue;
          }
          else if (serverScore) {
            tempServers.push({name: server.server_name, score: serverScore, cost: serverCost});
          }
        } else if (!instance.features && this.selectedFeatureList.length) {
          continue;
        }
      }

    }
    // filtering by score and cost reduction restriction
    tempServers = tempServers.sort((a, b) => {
      return b.score - a.score;
    });
    console.log('tempServers');
    console.log(tempServers);

    let sumOfAllowableCosts = 0;
    for (let index = 0; index < tempServers.length; index++) {
      const server = tempServers[index];
      if (server.cost > costReductionRestiction) {
        continue;
      }
      else if ((sumOfAllowableCosts + server.cost) > costReductionRestiction) {
        continue;
      }
      else {
        sumOfAllowableCosts += server.cost;
        chartItems.push({name: server.name, value: server.score, cost: server.cost});
      }
    }
    return chartItems;
  }

  clearAllFilters() {
    this.selectedFeatures = [];
    this.selectedServers = [];
    this.multiselectFeaturesDisabled = false;
  }
  // fillServerSumAndMinCosts() {
  //   const vm = this;
  //   vm.serversService.fillServersWithCost();
  //   vm.serversService.serversWithCost.subscribe((resp) => {
  //     const chartItems: any[] = resp;
  //     const values = chartItems.map(item => item.value);
  //     // vm.serverMaxCost = vm.guidGeneratorService.getSumFromArray(values);
  //     // vm.serverMinCost = vm.guidGeneratorService.getMinValueFromArray(values);
  //   });
  // }
}
