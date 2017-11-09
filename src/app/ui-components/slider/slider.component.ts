import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {ColorPickerService} from '../../services/color-picker.service';
// import {} from 'bootstrap-slider';
import * as $ from 'jquery';
import 'bootstrap-slider';
// import * as slider from 'bootstrap-slider';
// import * as _ from 'bootstrap-slider';
// declare var slider: any;

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  providers: [ColorPickerService]
})
export class SliderComponent implements OnInit, OnChanges {

  @Output() onChangeSliderValueEvent = new EventEmitter();
  // @Output() onSwitchToggleEvent = new EventEmitter();

  @Input() minValue: number;
  @Input() maxValue: number;
  @Input() step: number;
  // @Input() showToggleSwitch = false;

  sliderValue: number;
  // toggleSwitchColor: string;

  constructor(private colorPicker: ColorPickerService) { }

  ngOnInit() {
    const vm = this;
    vm.sliderValue = vm.minValue;
    // vm.toggleSwitchColor = vm.colorPicker.selectColor('CuriousBlue');
    const sliderElem = $('#ex1');
    sliderElem.slider(
      {
        min: vm.minValue,
        max: vm.maxValue,
        value: vm.sliderValue,
        formatter: function(value) {
          return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
      }
    ).on('change', (event: any) => {
      if (!event || !event.value || !event.value.newValue) {
        return;
      }
      const newValue = event.value.newValue;
      vm.onChangeSliderValue(newValue);
    });
    vm.setStyles();
    // sliderElem.css('opacity', 1);
    // console.log('elem');
    // console.log(elem);
    // elem.slider({
    //   max: 10000,
    //   tooltip: 'true'
    // });
  }

  setStyles() {
    const sliderFilledColor = this.colorPicker.selectColor('DodgerBlue');
    const sliderNotFilledColor = this.colorPicker.selectColor('WildSand');
    const tooltipBackColor = this.colorPicker.selectColor('White');
    const tooltipColor = this.colorPicker.selectColor('Black');

    $('.tooltip.tooltip-main.top').css({
      'opacity': 1,
      'margin-top': '21px',
      'font-weight': 'bold'
    });
    $('div.slider-selection').css('background', sliderFilledColor);
    $('div.slider-track-high').css('background', sliderNotFilledColor);
    // $('div.slider-track-high').css('background-color', sliderColor);
    $('.slider-handle.round').css({
      'border-radius': '25%',
      'background-image': 'none',
      'background-color': sliderFilledColor
    });
    $('.slider.slider-horizontal .slider-track').css({
      'height': '5px',
      'margin-top': '-2px'
    });
    $('.tooltip-inner').css({
      'background-color': tooltipBackColor,
      'color': tooltipColor
    });
    // $('.tooltip.tooltip-main.top').addClass('custom-slider');
  }

  ngOnChanges() {
    // this.sliderValue = this.minValue;
  }

  onChangeSliderValue(newValue) {
    // if (this.showToggleSwitch) {
      if (!newValue) {
        return;
      }
      const sliderValue = newValue;
      this.onChangeSliderValueEvent.emit(sliderValue);
    // }
  }

  // switchToggleState() {
  //   const vm = this;
  //   vm.showToggleSwitch = !vm.showToggleSwitch;
  //   if (vm.showToggleSwitch) {
  //     vm.onSwitchToggleEvent.emit(vm.showToggleSwitch);
  //   }
  // }

}
