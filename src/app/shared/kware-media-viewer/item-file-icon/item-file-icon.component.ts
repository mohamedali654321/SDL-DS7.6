/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-item-file-icon',
  templateUrl: './item-file-icon.component.html',
  styleUrls: ['./item-file-icon.component.scss']
})
export class ItemFileIconComponent {
  @Input() fileFormat;

  msFilesFormats = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.ms-powerpoint',
    'application/vnd.ms-excel',
  ];

  constructor() { }

}
