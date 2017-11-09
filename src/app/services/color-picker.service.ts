import { Injectable } from '@angular/core';

class ColorSet {
  name: string;
  color: string;
}

@Injectable()
export class ColorPickerService {
  colors: ColorSet[] = [
    {name: 'Seagull', color: '#7CB5E9'},
    {name: 'Red', color: 'red'},
    {name: 'Christi', color: '#3FB618'},
    {name: 'CuriousBlue', color: '#2780E3'},
    {name: 'DodgerBlue', color: '#15A9FB'},
    {name: 'Atlantis', color: '#B2D237'},
    {name: 'RedOrange', color: '#FD333B'},
    {name: 'White', color: '#FFFFFF'},
    {name: 'Black', color: '#000'},
    {name: 'WildSand', color: '#F6F6F6'}
  ];
  constructor() { }

  selectColor(name: string) {
    const selectedColor = this.colors.filter((color) => color.name === name);
    if (selectedColor === undefined || selectedColor == null
       || selectedColor[0] === undefined || selectedColor[0] == null) {
      selectedColor[0] = this.colors[0];
    }
    return selectedColor[0].color;
  }
}
