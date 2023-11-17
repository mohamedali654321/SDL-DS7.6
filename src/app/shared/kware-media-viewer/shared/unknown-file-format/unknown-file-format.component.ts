/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable unused-imports/no-unused-imports */
import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'ds-unknown-file-format',
  templateUrl: './unknown-file-format.component.html',
  styleUrls: ['./unknown-file-format.component.scss'],
  // encapsulation: ViewEncapsulation.Emulated,
})
export class UnknownFileFormatComponent {
  @Input() fileMeta;
  @Input() isMobile: boolean;
  @Input() closeViewer: () => void;
  @Input() viewerPanelsStatus: any;
  @Input() enableFullScreen = false;

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
