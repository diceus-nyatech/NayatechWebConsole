import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { IMultiSelectOption } from "angular-2-dropdown-multiselect";
import { IAdvanceFilterTableItem } from "../../../interfaces/IAdvanceFilterTableItem";
import { IDatatableSettings } from "../../../interfaces/IDatatableSettings";
import { ServerService } from "../../../services/server.service";
import { GuidGeneratorService } from "../../../services/guid-generator.service";
import {IFilterState} from '../../../interfaces/IFilterState';
import * as $ from 'jquery';

@Component({
  selector: "app-advanced-filter",
  templateUrl: "./advanced-filter.component.html",
  styleUrls: ["./advanced-filter.component.scss"],
  providers: [ServerService, GuidGeneratorService]
})
export class AdvancedFilterComponent implements OnInit {
  @Output() showExecutiveDashboardEvent = new EventEmitter();
  @Output() showQuickSearchEvent = new EventEmitter();

  serverData: any[];

  serverList: IMultiSelectOption[] = [];
  featureList: IMultiSelectOption[] = [];
  multiselectFeaturesDisabled = false;
  databaseList: IMultiSelectOption[] = [];
  instanceList: IMultiSelectOption[] = [];
  oracleVersionList: IMultiSelectOption[] = [];
  cpuNumberList: IMultiSelectOption[] = [];
  userSuppliedTagsList: IMultiSelectOption[] = [];

  selectedServerList: string[] = [];
  selectedFeatureList: string[] = [];
  selectedDatabaseList: string[] = [];
  selectedInstanceList: string[] = [];
  selectedOracleVersionList: string[] = [];
  selectedCpuNumberList: string[] = [];
  selectedUserSuppliedTagsList: string[] = [];


  selectedServersInDatatable: any[] = [];

  datatableSource: IAdvanceFilterTableItem[] = [];
  datatableSettings: IDatatableSettings = {
    showOperations: true,
    properties: [
      {
        property: "serverName",
        header: "Server name",
        resizable: true,
        sortable: true,
        width: 200
      },
      {
        property: "instanceName",
        header: "Instance name",
        resizable: true,
        sortable: true,
        width: 200
      },
      {
        property: "databaseName",
        header: "Database Name",
        resizable: true,
        sortable: true,
        width: 200
      }
    ]
  };

  constructor(
    private serverService: ServerService,
    private guidGeneratorService: GuidGeneratorService
  ) {}

  ngOnInit() {
    this.loadServers();
  }

  loadServers() {
    const vm = this;

    vm.serverService.getServers().subscribe(response => {
      vm.serverData = response.servers;
      vm.fillServersList();
      vm.fillFeatureList();
      vm.fillDatabasesList();
      vm.fillInstancesList();

      vm.fillOracleVersionList();
      vm.fillCpuNumberList();
      vm.filluserSuppliedTagsList();

      vm.fillDatatableSource();
    });
  }

  fillServersList() {
    const vm = this;
    const _tempList: IMultiSelectOption[] = [];
    for (let index = 0; index < vm.serverData.length; index++) {
      _tempList.push({
        id: vm.serverData[index].server_name,
        name: vm.serverData[index].server_name
      });
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
    const vm = this;
    const _databaseList: IMultiSelectOption[] = [];
    for (let index = 0; index < vm.serverData.length; index++) {
      const server = vm.serverData[index];
      if (!server.instances) {
        continue;
      }
      for (let i = 0; i < server.instances.length; i++) {
        // _featureList.push()
        const instance = server.instances[i];
        if (!instance.databases) {
          continue;
        }
        for (let k = 0; k < instance.databases.length; k++) {
          const database = instance.databases[k];
          _databaseList.push({
            id: database.name,
            name: database.name
          });
        }
      }
    }
    const uniqueList = vm.guidGeneratorService.retunUniqueArray(_databaseList);
    vm.databaseList = uniqueList;
  }

  fillInstancesList() {
    const vm = this;
    const _instanceList: IMultiSelectOption[] = [];
    for (let index = 0; index < vm.serverData.length; index++) {
      const server = vm.serverData[index];
      for (let i = 0; i < server.instances.length; i++) {
        // _featureList.push()
        const instance = server.instances[i];
        _instanceList.push({
          id: instance.name,
          name: instance.name
        });
      }
    }
    const uniqueList = vm.guidGeneratorService.retunUniqueArray(_instanceList);
    vm.instanceList = uniqueList;
  }

  fillOracleVersionList() {
    // for (let index = 0; index < 10; index++) {
    //   this.oracleVersionList.push({id: index, name: '14.0.0.' + index});
    // }
    const vm = this;
    const _oracleVersionList: IMultiSelectOption[] = [];
    for (let index = 0; index < vm.serverData.length; index++) {
      if (!vm.serverData[index].instances) {
        continue;
      }
      const instances = vm.serverData[index].instances;

      for (let i = 0; i < instances.length; i++) {
        _oracleVersionList.push({
          id: instances[i].oracle_version,
          name: instances[i].oracle_version
        });

      }
    }
    vm.oracleVersionList = vm.guidGeneratorService.retunUniqueArray(
      _oracleVersionList
    );
  }

  fillCpuNumberList() {
    const vm = this;
    const _cpuNumberList: IMultiSelectOption[] = [];
    for (let index = 0; index < vm.serverData.length; index++) {
      _cpuNumberList.push({
        id: vm.serverData[index].cpu_count,
        name: vm.serverData[index].cpu_count
      });
    }
    vm.cpuNumberList = vm.guidGeneratorService.retunUniqueArray(_cpuNumberList);
  }

  filluserSuppliedTagsList() {
    const vm = this;
    const _userSuppliedTagsList: IMultiSelectOption[] = [];
    for (let index = 0; index < vm.serverData.length; index++) {
      const server = vm.serverData[index];
      if (!server.instances) {
        continue;
      }
      for (let i = 0; i < server.instances.length; i++) {
        // _featureList.push()
        const instance = server.instances[i];
        if (!instance.databases) {
          continue;
        }
        for (let k = 0; k < instance.databases.length; k++) {
          if (!instance.databases[k].tags) {
            continue;
          }

          const tags = instance.databases[k].tags;
            for (let n = 0; n < tags.length; n++) {
            _userSuppliedTagsList.push({
              id: tags[n],
            name: tags[n]
           });
          }
        }
      }
    }
    const uniqueList = vm.guidGeneratorService.retunUniqueArray(_userSuppliedTagsList);
    vm.userSuppliedTagsList = uniqueList;
    // const vm = this;
    // const _userSuppliedTagsList: IMultiSelectOption[] = [];
    // for (let index = 0; index < vm.serverData.length; index++) {
    //   if (vm.serverData[index].tags) {
    //     const tags = vm.serverData[index].tags;
    //     for (let i = 0; i < tags.length; i++) {
    //        _userSuppliedTagsList.push({
    //         id: tags[i],
    //        name: tags[i]
    //        });
    //     }
    //   }
    // }
    // vm.userSuppliedTagsList = vm.guidGeneratorService.retunUniqueArray(
    //   _userSuppliedTagsList
    // );
  }

  fillDatatableSource() {
    const vm = this;
    const _datatableSource: IAdvanceFilterTableItem[] = [];
    for (let index = 0; index < vm.serverData.length; index++) {
      const server = vm.serverData[index];
      if (!server.instances) {
        continue;
      }
      for (let i = 0; i < server.instances.length; i++) {
        // _featureList.push()
        const instance = server.instances[i];
        if (!instance.databases) {
          continue;
        }
        for (let k = 0; k < instance.databases.length; k++) {
          _datatableSource.push({
            serverName: vm.serverData[index].server_name,
            instanceName: instance.name,
            databaseName: instance.databases[k].name
          });
        }
      }
    }
    const uniqueList = _datatableSource;
    vm.datatableSource = _datatableSource;


    // const vm = this;
    // const _datatableSource: IAdvanceFilterTableItem[] = [];
    // for (let index = 0; index < vm.serverData.length; index++) {
    //   _datatableSource.push({
    //     serverName: vm.serverData[index].server_name,
    //     instanceName: (index * 10).toString(),
    //     datebaseName: Date.now().toString()
    //   });
    // }
    // this.datatableSource = _datatableSource;
    // console.log("this.datatableSource");
    // console.log(this.datatableSource);



    // for (let index = 0; index < 10; index++) {
    //   this.datatableSource.push({serverName: 'Server' + index, cost: (index * 10).toString(), date: Date.now().toString()});
    // }
  }

  showExecutiveDashboard() {
    const vm = this;
    // const advancedFilterState: any = [];
    // let filterState: IFilterState;
    // advancedFilterState.filterState = filterState;


    let chartItems: any[] = [];
    let selectedServers: string[] = [];
    if (this.selectedServersInDatatable.length) {
      selectedServers = this.selectedServersInDatatable.map(item => item.serverName);
    } else {
      selectedServers = this.datatableSource.map((server) => server.serverName);
    }
    // const uniqSelectedServers = this.guidGeneratorService.retunUniqueArray(selectedServers);

    for (let i1 = 0; i1 < vm.serverData.length; i1++) {
      const server = vm.serverData[i1];
      let serverScore = 0;
      if (!server.instances) {
        continue;
      }

      if (!this.guidGeneratorService.elementWasSelected(server.server_name, selectedServers)) {
        continue;
      }

      for (let i2 = 0; i2 < server.instances.length; i2++) {
        const instance = server.instances[i2];

        if (!vm.guidGeneratorService.elementWasSelected(instance.name, vm.selectedInstanceList)) {
          continue;
        }
        if (!instance.features) {
          continue;
        }
        for (let i3 = 0; i3 < instance.features.length; i3++) {
          const feature = instance.features[i3];
          serverScore += feature.score;
        }
      }
      if (serverScore) {
        chartItems.push({name: server.server_name, value: serverScore});
      }
    }
    chartItems =  chartItems.sort(function(a, b) {
      return a.value - b  .value;
    });

    // advancedFilterState.selectedItems = chartItems;
    // advancedFilterState.selectedServers = vm.selectedServerList;
    // advancedFilterState.selectedFeatures = vm.selectedFeatureList;
    const filterState: IFilterState = {
      selectedItems: chartItems,
      selectedServersInFilter: vm.selectedServerList,
      selectedInstancesInFilter: vm.selectedInstanceList,
      selectedFeaturesInFilter: vm.selectedFeatureList,
    };
    this.showExecutiveDashboardEvent.emit(filterState);
  }

  useSelectedServers(selectedServers) {
    if (selectedServers && selectedServers.length !== 0) {
      this.multiselectFeaturesDisabled = true;
    }
    else{
      this.multiselectFeaturesDisabled = false;
    }
    this.selectedServerList = selectedServers;
  }

  useSelectedInstances(selectedInstances) {
    this.selectedInstanceList = selectedInstances;
  }

  useSelectedDatabases(selectedDatabases) {
    this.selectedDatabaseList = selectedDatabases;
  }

  useSelectedOracleVersions(selectedOracleVersions) {
    this.selectedOracleVersionList = selectedOracleVersions;
  }

  useSelectedCpuNumber(selectedCpuNumber) {
    this.selectedCpuNumberList = selectedCpuNumber;
  }

  useSelectedFeatures(selectedFeatures) {
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

  useSelectedTags(selectedTags) {
    this.selectedUserSuppliedTagsList = selectedTags;
  }

  filterTable() {
    const vm = this;
    const _newdatatableSource: IAdvanceFilterTableItem[] = [];
    for (let index = 0; index < vm.serverData.length; index++) {
      const server = vm.serverData[index];

      if (!vm.guidGeneratorService.elementWasSelected(server.server_name, this.selectedServerList)) {
        continue;
      }

      for (let i = 0; i < server.instances.length; i++) {
        // _featureList.push()
        const instance = server.instances[i];
        // const instanceWasSelected = $.inArray(instance.name, this.selectedInstanceList);
        // if (instanceWasSelected === -1) {
        //   continue;
        // }
        if (!vm.guidGeneratorService.elementWasSelected(instance.name, this.selectedInstanceList)) {
          continue;
        }

        if (!vm.guidGeneratorService.elementWasSelected(instance.oracle_version, this.selectedOracleVersionList)) {
          continue;
        }

        // if (!instance.features) {
        //   continue;
        // }
        if (instance.features && this.selectedFeatureList.length) {
          // let instanceFeaturesWasSelected = false;
          let featuresCount = 0;
          let notSelectedFeaturesCount = 0;
          for (let r = 0; r < instance.features.length; r++) {
            // _featureList.push()
            const featureObject = instance.features[r].name;
            if (typeof(featureObject) === 'string') {
              featuresCount++;
              if (!vm.guidGeneratorService.elementWasSelected(featureObject, this.selectedFeatureList)) {
                notSelectedFeaturesCount++;
              }
            }
          }
          if (notSelectedFeaturesCount === featuresCount) {
            continue;
          }
        } else if (!instance.features && this.selectedFeatureList.length) {
          continue;
        }

        if (!instance.databases) {
          continue;
        }
        for (let k = 0; k < instance.databases.length; k++) {
          // const databaseWasSelected = $.inArray(instance.databases[k].name, this.selectedDatabaseList);
          // if (databaseWasSelected === -1) {
          //   continue;
          // }
          const database = instance.databases[k];
          if (!vm.guidGeneratorService.elementWasSelected(database.name, this.selectedDatabaseList)) {
            continue;
          }

          if (database.tags && this.selectedUserSuppliedTagsList.length) {
            let tagsCount = 0;
            let notSelectedTagsCount = 0;
            for (let s = 0; s < database.tags.length; s++) {
              // _featureList.push()
              const tag = database.tags[s];
              if (typeof(tag) === 'string') {
                tagsCount++;
                if (!vm.guidGeneratorService.elementWasSelected(tag, this.selectedUserSuppliedTagsList)) {
                  notSelectedTagsCount++;
                }
              }
            }
            if (notSelectedTagsCount === tagsCount) {
              continue;
            }
          } else if (!database.tags && this.selectedUserSuppliedTagsList.length) {
            continue;
          }

          _newdatatableSource.push({
            serverName: vm.serverData[index].server_name,
            instanceName: instance.name,
            databaseName: database.name
          });
        }
      }
    }
    this.datatableSource = _newdatatableSource;
  }

  addSelectedServerToList(elem: any) {
    // if (this.elementWasSelected(serverName, this.selectedServersInDatatable)) {
    //   this.selectedServersInDatatable.push(serverName);
    // }
    if (!this.selectedServersInDatatable.length) {
        this.selectedServersInDatatable.push(elem);
    } else {
      if (this.guidGeneratorService.elementIArray(elem.key, this.selectedServersInDatatable.map((item) => item.key))) {
        this.selectedServersInDatatable = $.grep(this.selectedServersInDatatable, (item) => item.key !== elem.key);
      } else {
        this.selectedServersInDatatable.push(elem);
      }
    }
  }

  clearAllFilters() {
    this.selectedServerList = [];
    this.selectedInstanceList = [];
    this.selectedDatabaseList = [];
    this.selectedOracleVersionList = [];
    this.selectedCpuNumberList = [];
    this.selectedFeatureList = [];
    this.multiselectFeaturesDisabled = false;
    this.selectedUserSuppliedTagsList = [];
  }
  returnToQuickSearch() {
    this.showQuickSearchEvent.emit();
  }
}
