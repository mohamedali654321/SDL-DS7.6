/* eslint-disable unused-imports/no-unused-imports */
import {
  Component,
  Input,
} from '@angular/core';
import { MediaViewerService } from '../services/media-viewer.service';

@Component({
  selector: 'ds-viewer-panel',
  templateUrl: './viewer-panel.component.html',
  styleUrls: ['./viewer-panel.component.scss'],
})
export class ViewerPanelComponent {
  @Input() localeCode: string;
  @Input() isMobile: boolean;
  @Input() viewerPanelsStatus: any;
  @Input() fileMeta: any;
  @Input() fileUrl: any;
  @Input() fileFormat: string;
  @Input() closeViewer: () => void;

  msFilesFormats = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.ms-powerpoint',
    'application/vnd.ms-excel',
  ];

  constructor(private viewerService: MediaViewerService) { }
}
