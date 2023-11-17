/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable lodash/import-scope */
import { MediaViewerService } from '../services/media-viewer.service';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { Item } from '../../../core/shared/item.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from 'src/app/core/data/feature-authorization/feature-id';
import { isNotEmpty } from '../../empty.util';
import { hasValue } from 'src/app/shared/empty.util';
import {
  getBitstreamDownloadRoute,
  getBitstreamRequestACopyRoute,
} from 'src/app/app-routing-paths';
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ds-viewer-file',
  templateUrl: './viewer-file.component.html',
  styleUrls: ['./viewer-file.component.scss'],
})
export class ViewerFileComponent implements OnInit {
  @Input() bitstream: Bitstream;
  @Input() item: Item;
  @Input() fileIndex;
  @Input() currentFileIndex: number;
  @Output() selectedFileEmitter = new EventEmitter<number>();
  @ViewChild('selectedFileRef') selectedFileRef: ElementRef<any>;
  @Input() isMobile: boolean;
  // @Input() preFetchedFiles: [];

  bitstreamPath$: Observable<{
    routerLink: string;
    queryParams: any;
  }>;

  canDownload$: Observable<boolean>;
  canRequestACopy$: Observable<boolean>;

  constructor(
    private authorizationService: AuthorizationDataService,
    private viewerService: MediaViewerService
  ) { }

  ngOnInit() {
    this.canDownload$ = this.authorizationService.isAuthorized(
      FeatureID.CanDownload,
      isNotEmpty(this.bitstream)
        ? this.bitstream?._links?.self?.href
        : undefined
    );
    this.canRequestACopy$ = this.authorizationService.isAuthorized(
      FeatureID.CanRequestACopy,
      isNotEmpty(this.bitstream)
        ? this.bitstream?._links?.self?.href
        : undefined
    );
    this.bitstreamPath$ = observableCombineLatest([
      this.canDownload$,
      this.canRequestACopy$,
    ]).pipe(
      map(([canDownload, canRequestACopy]) =>
        this.getBitstreamPath(canDownload, canRequestACopy)
      ),
    );

    if (this.currentFileIndex === 0 && this.fileIndex === 0) {
      this.emitMediaViewerSwitcher();
    }
  }

  emitMediaViewerSwitcher() {
    this.viewerService.setFileMetadata({
      format: this.bitstream?.format,
      name: this.bitstream?.name,
      canDownload: this.canDownload$,
      canRequestACopy: this.canRequestACopy$,
      bitstreamPath: this.bitstreamPath$,
      contentLink: this.bitstream?._links?.content?.href,
      formatLink: this.bitstream?._links?.format?.href,
    });
    this.selectedFileEmitter.emit(this.fileIndex);
    this.scrollToView();

    if (this.isMobile) {
      this.viewerService.setViewerPanelsStatus({
        isFilesMenuOpen: false,
        isViewerPanelOpen: true,
      });
    } else {
      this.viewerService.setViewerPanelsStatus({
        isFilesMenuOpen: true,
        isViewerPanelOpen: true,
      });
    }
  }

  getBitstreamPath(canDownload: boolean, canRequestACopy: boolean) {
    if (!canDownload && canRequestACopy && hasValue(this.item)) {
      return getBitstreamRequestACopyRoute(this.item, this.bitstream);
    }
    return this.getBitstreamDownloadPath();
  }

  getBitstreamDownloadPath() {
    return {
      routerLink: getBitstreamDownloadRoute(this.bitstream),
      queryParams: {},
    };
  }

  scrollToView() {
    this.selectedFileRef?.nativeElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }
}
