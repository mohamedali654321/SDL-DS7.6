/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable unused-imports/no-unused-imports */
import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'ds-request-a-copy',
  templateUrl: './request-a-copy.component.html',
  styleUrls: ['./request-a-copy.component.scss'],
})
export class RequestACopyComponent {
  @Input() fileMeta;
  @Input() isMobile: boolean;
  @Input() closeViewer: () => void;
  @Input() viewerPanelsStatus: any;

  constructor() {
  }

  downloadOtherFileFormat() {
    let link = document.createElement('a');
    link.href = this.fileMeta?.url;
    let fileName = this.fileMeta?.name;
    link.download = fileName;
    link.click();
  }
}
