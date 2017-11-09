import { Component, OnInit, Input } from '@angular/core';
import {ServerService} from '../../../../../services/server.service';
import {GuidGeneratorService} from '../../../../../services/guid-generator.service';
import {IFeature} from '../../../../../interfaces/IFeature';
import {IDetailedDBADashboardModel} from '../../../../../interfaces/IDetailedDBADashboardModel';

export interface IFeatureTreeItem {
  id: number;
  name: string;
  children: IFeatureTreeItem[];
}

@Component({
  selector: 'app-detailed-dba-dashboard',
  templateUrl: './detailed-dba-dashboard.component.html',
  styleUrls: ['./detailed-dba-dashboard.component.scss'],
  providers: [ServerService, GuidGeneratorService]
})
export class DetailedDbaDashboardComponent implements OnInit {

  @Input() detailedDBAModel: IDetailedDBADashboardModel;
  // selectedFeatures: IFeature[] = [];

  serverData: any[];
  // featureItems: IFeature[];
  featureTreeItems: IFeatureTreeItem[];


  // nodes = [
  //   {
  //     id: 1,
  //     name: 'root1',
  //     children: [
  //       { id: 2, name: 'child1' },
  //       { id: 3, name: 'child2' }
  //     ]
  //   },
  //   {
  //     id: 4,
  //     name: 'root2',
  //     children: [
  //       { id: 5, name: 'child2.1' },
  //       {
  //         id: 6,
  //         name: 'child2.2',
  //         children: [
  //           { id: 7, name: 'subsub' }
  //         ]
  //       }
  //     ]
  //   }
  // ];

  constructor(private serverService: ServerService, private guidGeneratorService: GuidGeneratorService) { }

  ngOnInit() {
    const vm = this;
    vm.serverService.getServers().subscribe(response => {
      vm.serverData = response.servers;
      vm.fillFeatureItems();
      vm.guidGeneratorService.scrollWindowToRight();
    });
  }

  fillFeatureItems() {
    const vm = this;
    const _featureTreeItems: IFeatureTreeItem[] = [];
    const selectedServer = vm.detailedDBAModel.hostName;
    // const selectedInstances = vm.selectedFeatures.map(f => f.instanceName);
    const selectedFeature = vm.detailedDBAModel.selectedFeature;

    for (let index = 0; index < vm.serverData.length; index++) {
      const server = vm.serverData[index];
      if (selectedServer !== server.server_name) {
         continue;
      }
      if (!server.instances) {
        continue;
      }
      const instances = server.instances;

      for (let k = 0; k < instances.length; k++) {
        const instance = instances[k];
        // if (!vm.guidGeneratorService.elementWasSelected(instance.name, selectedInstances)) {
        //   continue;
        // }
        // const featureItems: IChartItem[] = [];

        if (!instance.features) {
          continue;
        }

        for (let i = 0; i < instance.features.length; i++) {
          // _featureList.push()
          const featureObject = instance.features[i];
          if (featureObject.name === selectedFeature) {
            featureObject.isExpanded = true;
            if (featureObject.children) {
              for (let i2 = 0; i2 < featureObject.children.length; i2++) {
                const child = featureObject.children[i2];
                child.isExpanded = true;
              }
              console.log('featureObject.children');
              console.log(featureObject.children);
            }
          }
          else {
            featureObject.isExpanded = false;
          }
          // if (!vm.guidGeneratorService.elementWasSelected(featureObject.name, selectedFeatures)) {
          //   continue;
          // }
          _featureTreeItems.push(featureObject);
        }
      }
    }
    vm.featureTreeItems = _featureTreeItems;
    console.log('featureTreeItems');
    console.log(vm.featureTreeItems);
  }

  // getFilledFeatureTreeItem(feature: any) {
  //   if (!feature.children || !feature.children.length || !feature.name || !feature.id) {
  //     return;
  //   }
  //   const name = feature.name;
  //   const id = feature.id;
  //   const treeFeatureItem: IFeatureTreeItem[] = [];
  //   treeFeatureItem.push()

  // }
}
