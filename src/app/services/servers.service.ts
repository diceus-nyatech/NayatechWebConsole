import { Injectable } from '@angular/core';
import {ServerService} from './server.service';
import {GuidGeneratorService} from './guid-generator.service';
import {IChartItem} from '../interfaces/IChartItem';
import {IServerMostComplexityItem} from '../interfaces/IServerMostComplexityItem';
import { Subject} from 'rxjs/Subject';

@Injectable()
export class ServersService {

  mostExpensiveServers: Subject<IChartItem[]> = new Subject<IChartItem[]>();
  mostComplicatedServers: Subject<IServerMostComplexityItem[]> = new Subject<IServerMostComplexityItem[]>();
  serversWithCost: Subject<IChartItem[]> = new Subject<IChartItem[]>();
  costReductionSelectedServers: Subject<number> = new Subject<number>();

  constructor(private httpService: ServerService, private guidGeneratorService: GuidGeneratorService) { }

  fillTopExpensiveServers(selectedServers: string[]) {
    const vm = this;
    return vm.httpService.getServers().subscribe(response => {
      const servers = response.servers;
      let serversWithCost: IChartItem[] = [];
      for (let i1 = 0; i1 < servers.length; i1++) {
        const server = servers[i1];
        if (!vm.guidGeneratorService.elementWasSelected(server.server_name, selectedServers)) {
          continue;
        }
        if (!server.instances) {
          continue;
        }
        let serverCost = 0;
        for (let i2 = 0; i2 < server.instances.length; i2++) {
          const instance = server.instances[i2];
          serverCost += instance.cost;
        }
        if (serverCost) {
          serversWithCost.push({name: server.server_name, value: serverCost});
        }
      }
      serversWithCost = serversWithCost.sort((a, b) => {
        return b.value - a.value;
      });
      serversWithCost = this.guidGeneratorService.slice(serversWithCost, 0, 5);
      this.mostExpensiveServers.next(serversWithCost);
    });
  }

  fillTopComplexServers(selectedServers: string[]) {
    const vm = this;
    return vm.httpService.getServers().subscribe(response => {
      const servers = response.servers;
      let serversWithScore: IServerMostComplexityItem[] = [];
      for (let i1 = 0; i1 < servers.length; i1++) {
        const server = servers[i1];
        if (!vm.guidGeneratorService.elementWasSelected(server.server_name, selectedServers)) {
          continue;
        }
        if (!server.instances) {
          continue;
        }
        let serverScore = 0;
        let serverCost = 0;
        for (let i2 = 0; i2 < server.instances.length; i2++) {
          const instance = server.instances[i2];
          serverCost += instance.cost;
          if (!instance.features) {
            continue;
          }
          for (let i3 = 0; i3 < instance.features.length; i3++) {
            const feature = instance.features[i3];
            serverScore += feature.score;
          }
        }
        serversWithScore.push({name: server.server_name, score: serverScore, cost: serverCost, rank: i1 + 1});
      }
      serversWithScore = serversWithScore.sort((a, b) => {
        return b.score - a.score;
      });
      // serversWithScore = this.guidGeneratorService.slice(serversWithScore, 0, 5);
      this.mostComplicatedServers.next(serversWithScore);
    });
  }

  fillServersWithCost() {
    const vm = this;
    return vm.httpService.getServers().subscribe(response => {
      const servers = response.servers;
      let serversWithCost: IChartItem[] = [];
      for (let i1 = 0; i1 < servers.length; i1++) {
        const server = servers[i1];
        if (!server.instances) {
          continue;
        }
        let serverCost = 0;
        for (let i2 = 0; i2 < server.instances.length; i2++) {
          const instance = server.instances[i2];
          serverCost += instance.cost;
        }
        if (serverCost) {
          serversWithCost.push({name: server.server_name, value: serverCost});
        }
      }
      serversWithCost = serversWithCost.sort((a, b) => {
        return b.value - a.value;
      });
      this.serversWithCost.next(serversWithCost);
    });
  }

  fillCostReductionSelectedServers(selectedServers: string[]) {
    const vm = this;
    return vm.httpService.getServers().subscribe(response => {
      const servers = response.servers;
      // const serversWithCost: IChartItem[] = [];
      let serverCost = 0;
      for (let i1 = 0; i1 < servers.length; i1++) {
        const server = servers[i1];
        if (!vm.guidGeneratorService.elementWasSelected(server.server_name, selectedServers)) {
          continue;
        }
        if (!server.instances) {
          continue;
        }
        for (let i2 = 0; i2 < server.instances.length; i2++) {
          const instance = server.instances[i2];
          serverCost += instance.cost;
        }
        // if (serverCost) {
        //   serversWithCost.push({name: server.server_name, value: serverCost});
        // }
      }

      vm.costReductionSelectedServers.next(serverCost);
    });
  }
}
