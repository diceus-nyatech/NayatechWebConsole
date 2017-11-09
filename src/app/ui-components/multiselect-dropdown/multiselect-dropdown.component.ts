import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-multiselect-dropdown',
  templateUrl: './multiselect-dropdown.component.html',
  styleUrls: ['./multiselect-dropdown.component.scss']
})
export class MultiselectDropdownComponent implements OnInit, OnChanges {

  @Input() name: string;
  @Input() multiselectOptions: IMultiSelectOption[];
  @Input() selectedItems: string[];
  @Input() disabled = false;
  @Input() marginBottomClass = 'mb-3';

  @Output() selectItemEvent = new EventEmitter();

  optionsModel: string[];
  // multiselectOptions: IMultiSelectOption[];
  multiselectSettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true,
    showCheckAll: true,
    showUncheckAll: true
  };

  multiselectTexts: IMultiSelectTexts = {
    defaultTitle: 'Select',
};

  constructor() {
  }

  ngOnInit() {
    const vm = this;
    vm.multiselectTexts.defaultTitle = 'Select ' + vm.name.toLowerCase();

    // vm.selectedItems.forEach(selectedItem => vm.optionsModel.push(selectedItem));
  }

  ngOnChanges (changes: SimpleChanges) {
    // only run when property "data" changed
    const vm = this;
    if (changes['selectedItems']) {
      console.log('vm.selectedItems');
      console.log(vm.selectedItems);
      if (vm.selectedItems) {
        vm.optionsModel = [];
        vm.selectedItems.forEach(selectedItem => vm.optionsModel.push(selectedItem));
      }
        // this.groupPosts = this.groupByCategory(this.data);
    }
  }

  onChange(event: any) {
    console.log('selcted items');
    console.log(this.optionsModel);
    // this.optionsModel.push('celmax.biz.3');
    this.selectItemEvent.emit(this.optionsModel);
  }

  test()  {
    alert('hop');
  }
}
