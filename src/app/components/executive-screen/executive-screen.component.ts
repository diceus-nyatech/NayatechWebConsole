import { Component, NgModule, Input, ComponentFactory, ComponentRef, ComponentFactoryResolver,
  ViewContainerRef, ChangeDetectorRef, TemplateRef, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import {WindowBodyComponent} from '../window-body/window-body.component';
import {AdvancedFilterComponent} from './advanced-filter/advanced-filter.component';
import {ExecutiveDashboardComponent} from './executive-dashboard/executive-dashboard.component';
import {HighlevelDbaDashboardComponent} from './executive-dashboard/highlevel-dba-dashboard/highlevel-dba-dashboard.component';
import {DetailedDbaDashboardComponent} from './executive-dashboard/highlevel-dba-dashboard/detailed-dba-dashboard/detailed-dba-dashboard.component';
import {IFilterState} from '../../interfaces/IFilterState';

@Component({
  selector: 'app-executive-screen',
  templateUrl: './executive-screen.component.html',
  styleUrls: ['./executive-screen.component.scss'],
  entryComponents: [
    WindowBodyComponent,
    AdvancedFilterComponent,
    ExecutiveDashboardComponent,
    HighlevelDbaDashboardComponent,
    DetailedDbaDashboardComponent
  ]
})
export class ExecutiveScreenComponent implements OnInit {

  @ViewChild('advancedFilterComponent', { read: ViewContainerRef }) advancedFilterContainer;
  @ViewChild('executiveWindowBodyComponent', { read: ViewContainerRef }) executiveContainer;
  @ViewChild('dbaWindowBodyComponent', { read: ViewContainerRef }) dbaContainer;
  @ViewChild('dbaDetailedWindowBodyComponent', { read: ViewContainerRef }) dbaDetailedContainer;
  filterComponentRef: ComponentRef<WindowBodyComponent>;
  executiveDashboardComponentRef: ComponentRef<WindowBodyComponent>;
  highlevelDbaDashboardComponentRef: ComponentRef<WindowBodyComponent>;
  detailedDbaDashboardComponentRef: ComponentRef<WindowBodyComponent>;

  showSearch = true;
  showFilter = false;

  // quick filters selected items
  selectedServers: string[];
  selectedFeatures: string[];
  selectedInstances: string[];

  // executiveDashboardWasOpened;

  constructor(private resolver: ComponentFactoryResolver, private vcRef: ViewContainerRef) { }

  ngOnInit() {
  }

  hideSearchSidebar() {
    this.showSearch = false;
  }

  showSearchSidebar() {
    this.advancedFilterContainer.clear();
    this.showSearch = true;
  }

  destroyFilter() {
    this.showFilter = false;
  }

  openAdvancedFilter(name) {
    this.hideSearchSidebar();
    this.executiveContainer.clear();
    this.dbaContainer.clear();
    this.dbaDetailedContainer.clear();

    const windowBodyContentFactory: ComponentFactory<AdvancedFilterComponent> =
          this.resolver.resolveComponentFactory(AdvancedFilterComponent);
    const windowBodyFactory: ComponentFactory<WindowBodyComponent> =
          this.resolver.resolveComponentFactory(WindowBodyComponent);

    const filterContentRef = this.vcRef.createComponent(windowBodyContentFactory);
    filterContentRef.instance.showExecutiveDashboardEvent.subscribe(event => this.openExecutiveDashboard(event));
    filterContentRef.instance.showQuickSearchEvent.subscribe(event => this.showSearchSidebar());

    this.filterComponentRef = this.advancedFilterContainer.createComponent(windowBodyFactory, 0, undefined,
       [[filterContentRef.location.nativeElement]]);
    this.filterComponentRef.instance.name = name;
    this.filterComponentRef.instance.deleteMeEvent.subscribe(event => this.filterComponentRef.destroy());
    // this.componentRef.instance.type = type;

    // this.componentRef.instance.output.subscribe(event => console.log(event));

  }

  openExecutiveDashboard(advancedFilterState: IFilterState) {
    let itemsToDisplay;
    this.setSelectedItemsForQuickFilter(advancedFilterState);
    if (advancedFilterState.selectedItems) {
      itemsToDisplay = advancedFilterState.selectedItems;
    }
    else {
      return;
    }

    if (!this.showSearch) {
      this.showSearchSidebar();
    }
    if (this.filterComponentRef) {
      this.filterComponentRef.destroy();
    }
    this.executiveContainer.clear();
    this.dbaContainer.clear();
    this.dbaDetailedContainer.clear();

    const windowBodyContentFactory: ComponentFactory<ExecutiveDashboardComponent> =
                this.resolver.resolveComponentFactory(ExecutiveDashboardComponent);
    const windowBodyFactory: ComponentFactory<WindowBodyComponent> =
                this.resolver.resolveComponentFactory(WindowBodyComponent);

    const executiveDashboardContentRef = this.vcRef.createComponent(windowBodyContentFactory);
    executiveDashboardContentRef.instance.costsItems = itemsToDisplay;
    executiveDashboardContentRef.instance.openHighLevelDBADasboardEvent.subscribe(event => this.openHighLevelDBADasboard(event));

    this.executiveDashboardComponentRef = this.executiveContainer.createComponent(windowBodyFactory, 0, undefined,
       [[executiveDashboardContentRef.location.nativeElement]]);
    this.executiveDashboardComponentRef.instance.name = 'Database Migration Score';
    this.executiveDashboardComponentRef.instance.deleteMeEvent.subscribe(event => this.executiveDashboardComponentRef.destroy());

    // this.executiveDashboardWasOpened = true;
  }

  openHighLevelDBADasboard(selectedServers) {
    this.dbaContainer.clear();
    this.dbaDetailedContainer.clear();

    const windowBodyContentFactory: ComponentFactory<HighlevelDbaDashboardComponent> =
          this.resolver.resolveComponentFactory(HighlevelDbaDashboardComponent);
    const windowBodyFactory: ComponentFactory<WindowBodyComponent> =
          this.resolver.resolveComponentFactory(WindowBodyComponent);

    const highlevelDbaDashboardContentRef = this.vcRef.createComponent(windowBodyContentFactory);
    highlevelDbaDashboardContentRef.instance.selectedServers = selectedServers;
    highlevelDbaDashboardContentRef.instance.openDetailedDBADashboard.subscribe(event => this.openDetailedDBADashboard(event));
    highlevelDbaDashboardContentRef.instance.closeDetailedDBADashboard.subscribe(event => this.dbaDetailedContainer.clear());

    this.highlevelDbaDashboardComponentRef = this.dbaContainer.createComponent(windowBodyFactory, 0, undefined,
      [[highlevelDbaDashboardContentRef.location.nativeElement]]);
    this.highlevelDbaDashboardComponentRef.instance.name = 'High-Level DBA Dashboard';
    this.highlevelDbaDashboardComponentRef.instance.deleteMeEvent.subscribe(event => this.highlevelDbaDashboardComponentRef.destroy());
  }
  // ngOnDestroy() {
  //   this.componentRef.destroy();
  // }
  openDetailedDBADashboard(detailedDBAModel) {
    const vm = this;
    vm.dbaDetailedContainer.clear();

    const windowBodyContentFactory: ComponentFactory<DetailedDbaDashboardComponent> =
    this.resolver.resolveComponentFactory(DetailedDbaDashboardComponent);
    const windowBodyFactory: ComponentFactory<WindowBodyComponent> =
        this.resolver.resolveComponentFactory(WindowBodyComponent);

    const detailedDbaDashboardContentRef = this.vcRef.createComponent(windowBodyContentFactory);
    detailedDbaDashboardContentRef.instance.detailedDBAModel = detailedDBAModel;

    this.detailedDbaDashboardComponentRef = this.dbaDetailedContainer.createComponent(windowBodyFactory, 0, undefined,
    [[detailedDbaDashboardContentRef.location.nativeElement]]);
    this.detailedDbaDashboardComponentRef.instance.name = 'Detailed DBA Dashboard';
    this.detailedDbaDashboardComponentRef.instance.deleteMeEvent.subscribe(event => this.detailedDbaDashboardComponentRef.destroy());

  }

  setSelectedItemsForQuickFilter(advancedFilterState: IFilterState) {
    if (!advancedFilterState) {
      return;
    }
    if (advancedFilterState.selectedServersInFilter) {
      this.selectedServers = advancedFilterState.selectedServersInFilter;
    }
    if (advancedFilterState.selectedFeaturesInFilter) {
      this.selectedFeatures = advancedFilterState.selectedFeaturesInFilter;
    }
    if (advancedFilterState.selectedInstancesInFilter) {
      this.selectedInstances = advancedFilterState.selectedInstancesInFilter;
    }
  }
}
