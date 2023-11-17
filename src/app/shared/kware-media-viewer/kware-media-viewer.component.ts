/* eslint-disable unused-imports/no-unused-imports */
import { MediaViewerService } from './services/media-viewer.service';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  HostListener,
} from '@angular/core';
import { LocaleService } from 'src/app/core/locale/locale.service';
import { Item } from 'src/app/core/shared/item.model';
import {
  BreakpointObserver,
  Breakpoints,
} from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, concatMap, map, take } from 'rxjs';
import { Bitstream } from 'src/app/core/shared/bitstream.model';
import { TranslateService } from '@ngx-translate/core';
import { BitstreamDataService } from 'src/app/core/data/bitstream-data.service';
import { hasValue } from '../empty.util';
import { NotificationsService } from '../notifications/notifications.service';
import { FileService } from 'src/app/core/shared/file.service';

@Component({
  selector: 'ds-kware-media-viewer',
  templateUrl: './kware-media-viewer.component.html',
  styleUrls: ['./kware-media-viewer.component.scss'],
})
export class KwareMediaViewerComponent implements OnInit, OnDestroy {
  @Input() item: Item;
  bitstreams$: BehaviorSubject<Bitstream[]>;
  isLoading: boolean;
  totalElements: number;
  pageNumber: number;
  pageSize = 25;

  isLastPage: boolean;

  localeCode = '';
  fileMeta = {
    format: '',
    name: '',
    canDownload: null,
    canRequestACopy: null,
    bitstreamPath: null,
    contentLink: null,
    formatLink: null
  };

  fileUrl: any;
  fileFormat: string;
  isMobile: boolean;
  isViewerOpen = false;

  filesMenuWidth: string;

  viewerPanelsStatus = {
    isFilesMenuOpen: true,
    isViewerPanelOpen: true,
  };

  /** Detetct mobile device when window resize  */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = this.breakpointObserver.isMatched([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait,
    ]);
    if (this.isMobile) {
      this.viewerService.setViewerPanelsStatus({
        isFilesMenuOpen: true,
        isViewerPanelOpen: false,
      });

      this.filesMenuWidth = '100%';
    } else {
      this.viewerService.setViewerPanelsStatus({
        isFilesMenuOpen: true,
        isViewerPanelOpen: true,
      });
      this.filesMenuWidth = '25%';
    }
  }

  constructor(
    private viewerService: MediaViewerService,
    private localeService: LocaleService,
    private breakpointObserver: BreakpointObserver,
    private httpClient: HttpClient,
    protected bitstreamDataService: BitstreamDataService,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
    public fileService: FileService,
  ) {
    this.isMobile = this.breakpointObserver.isMatched([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait,
    ]);
  }

  ngOnInit() {
    this.localeCode = this.localeService.getCurrentLanguageCode();
    this.viewerService.fileMetadata.subscribe((meta) => {
      if (this.fileMeta !== meta) {
        this.fileMeta = meta;
        this.fileFormat = meta.format;
        this.fileUrl = this.fileService.retrieveFileDownloadLink(
          meta.contentLink
        );
      }
    });
    this.viewerService.viewerPanelsStatus.subscribe(viewerStatus => {
      if (this.viewerPanelsStatus !== viewerStatus) {
        this.viewerPanelsStatus = viewerStatus;
      }
    });
    this.isMobile = this.breakpointObserver.isMatched(Breakpoints.Handset);

    /** fetch bitstreams */
    this.onFetchBitstreams();
  }

  onFetchBitstreams() {
    this.isLoading = true;

    if (this.pageNumber === undefined) {
      this.pageNumber = 0;
      this.bitstreams$ = new BehaviorSubject([]);
    } else {
      this.pageNumber++;
    }

    this.httpClient
      .get(this.item?._links?.bundles?.href)
      .pipe(
        map((bundles: any) =>
          bundles?._embedded?.bundles?.find(
            (bundle) => bundle.name === 'ORIGINAL'
          )
        ),
        concatMap((res: any) =>
          this.httpClient.get(
            `${res?._links?.bitstreams?.href}?page=${this.pageNumber}&size=${this.pageSize}`
          )
        )
      )
      .subscribe((res: any) => {
        const current: Bitstream[] = this.bitstreams$.getValue();
        if (hasValue(res?._embedded?.bitstreams)) {
          res?._embedded?.bitstreams.forEach(bitstream => {
            bitstream.name = bitstream?.name.replace(/\.[^/.]+$/, '');
            this.httpClient.get(bitstream?._links?.format?.href).pipe(take(1)).subscribe((file: any) => {
              bitstream.format = file.mimetype;
            });
          });
          this.bitstreams$.next([...current, ...res._embedded.bitstreams].sort((a, b) => a.name.localeCompare(b.name)));
        }
        this.totalElements = res?.page.totalElements;
        this.isLoading = false;
        this.isLastPage = this.pageNumber + 1 === res?.page.totalPages;
      });
  }

  onScrollingFinished() {
    this.onFetchBitstreams();
  }

  openViewer() {
    this.isViewerOpen = true;
    if (this.isMobile) {
      this.viewerService.setViewerPanelsStatus({
        isFilesMenuOpen: true,
        isViewerPanelOpen: false,
      });
      this.filesMenuWidth = '100%';
    } else {
      this.viewerService.setViewerPanelsStatus({
        isFilesMenuOpen: true,
        isViewerPanelOpen: true,
      });
      this.filesMenuWidth = '25%';
    }
  }

  closeViewer = (): void => {
    this.isViewerOpen = false;
    this.viewerService.setFileMetadata({
      format: null,
      name: '',
      canDownload: null,
      canRequestACopy: null,
      bitstreamPath: null,
      contentLink: null,
      formatLink: null
    });
    this.viewerService.setViewerPanelsStatus({
      isFilesMenuOpen: false,
      isViewerPanelOpen: false,
    });
  };

  ngOnDestroy(): void {
    this.viewerService.setFileMetadata({
      format: null,
      name: '',
      canDownload: null,
      canRequestACopy: null,
      bitstreamPath: null,
      contentLink: null,
      formatLink: null
    });
    this.viewerService.setViewerPanelsStatus({
      isFilesMenuOpen: false,
      isViewerPanelOpen: false,
    });
  }
}
