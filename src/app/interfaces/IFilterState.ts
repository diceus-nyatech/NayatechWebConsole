import { IMultiSelectOption } from "angular-2-dropdown-multiselect";
import {IChartItem} from './IChartItem';

export interface IFilterState {
  selectedItems: IChartItem[];
  selectedServersInFilter: string[];
  selectedFeaturesInFilter: string[];
  selectedInstancesInFilter: string[];
}
