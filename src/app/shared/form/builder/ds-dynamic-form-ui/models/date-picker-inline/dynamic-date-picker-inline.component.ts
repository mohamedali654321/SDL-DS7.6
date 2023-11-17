import { TranslationWidth } from '@angular/common';
import { Component, EventEmitter, Injectable, Input, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NgbDatepicker, NgbDatepickerConfig, NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicDatePickerModel,
  DynamicFormControlComponent,
  DynamicFormControlLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';
import { hasValue } from 'src/app/shared/empty.util'; // kware-edit

// const WEEKDAYS_AR = ['إث', 'ثل', 'أر', 'خم', 'جم', 'سب', 'أح'];
const WEEKDAYS_AR = ['الإثنين', 'الثلاثاء', 'الإربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];
const MONTHS_AR = [
	'يناير',
	'فبراير',
	'مارس',
	'أبريل',
	'مايو',
	'يونيو',
	'يوليو',
	'أغسطس',
	'سبتمبر',
	'أكتوبر',
	'نوفمبر',
	'ديسمبر',
];


const WEEKDAYS_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS_EN = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];


export class CustomDatepickerI18n extends NgbDatepickerI18n {


	getWeekdayLabel(weekday: number): string {
		return (typeof window === 'object' && hasValue(window.localStorage)) && window.localStorage.getItem('selectedLangCode')  === 'ar' ?  WEEKDAYS_AR[weekday - 1] : WEEKDAYS_EN[weekday - 1];
	}

	getMonthShortName(month: number): string {
    return (typeof window === 'object' && hasValue(window.localStorage)) && window.localStorage.getItem('selectedLangCode')  === 'ar' ?  MONTHS_AR[month - 1] : MONTHS_EN[month - 1] ;

	}
	getMonthFullName(month: number): string {
		return (typeof window === 'object' && hasValue(window.localStorage)) && window.localStorage.getItem('selectedLangCode')  === 'ar' ?  MONTHS_AR[month - 1] : MONTHS_EN[month - 1] ;
	}
	getDayAriaLabel(date: NgbDateStruct): string {
		return `${date.day}-${date.month}-${date.year}`;
	}
}

@Component({
  selector: 'ds-dynamic-date-picker-inline',
  templateUrl: './dynamic-date-picker-inline.component.html',
  providers: [ { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }],
})
export class DsDatePickerInlineComponent extends DynamicFormControlComponent {

  @Input() bindId = true;
  @Input() group: UntypedFormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicDatePickerModel;

  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();

  @ViewChild(NgbDatepicker) ngbDatePicker: NgbDatepicker;
  
  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              public config: NgbDatepickerConfig,
              ) {

    super(layoutService, validationService);
    
  }
  
 
}
