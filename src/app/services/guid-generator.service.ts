/*jshint bitwise: false*/
import { Injectable } from '@angular/core';
import * as $ from 'jquery';


@Injectable()
export class GuidGeneratorService {
  constructor() {}
  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  retunUniqueArray(list) {
    const vm = this;
    const result = [];
    $.each(list, function(i, elem) {
        if ($.inArray(elem.name, vm.getArrayOfNameProp(result)) === -1) {
          result.push(elem);
        }
    });
    return result;
  }
  elementWasSelected(element: any, array: any[]): boolean {
    if (!array || !array.length) {
      return true;
    }
    return this.elementIArray(element, array);
  }

  elementIArray(element: any, array: any[]) {
    const elementWasInArray = $.inArray(element, array);
    if (elementWasInArray >= 0) {
      return true;
    } else {
      return false;
    }
  }

  scrollWindowToRight(){
    $('.container-window').scrollLeft(1000);
  }

  getMaxValueFromArray(arr: number[]) {
    return Math.max.apply(Math, arr);
  }

  getMinValueFromArray(arr: number[]) {
    return Math.min.apply(Math, arr);
  }

  getSumFromArray(arr: number[]) {
    return arr.reduce((a, b) => a + b, 0);
  }

  slice(arr: any[], startIndex: number, endIndex: number) {
    return arr.slice(startIndex, endIndex);
  }

  private getArrayOfNameProp (data: any[]) {
    return data.map((elem) => elem.name);
  }
}
