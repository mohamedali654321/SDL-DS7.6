
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { fadeIn, fadeInOut } from '../../shared/animations/fade';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { Item } from '../../core/shared/item.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { PaginationService } from '../../core/pagination/pagination.service';
import { SearchService } from '../../core/shared/search/search.service';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { environment } from '../../../environments/environment';
import { ViewMode } from '../../core/shared/view-mode.model';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { toDSpaceObjectListRD } from '../../core/shared/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { followLink, FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { APP_CONFIG, AppConfig } from '../../../config/app-config.interface';
import { isPlatformBrowser } from '@angular/common';
import { setPlaceHolderAttributes } from '../../shared/utils/object-list-utils';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';
import {
  HttpHeaders,
  HttpClient,
  HttpResponse
} from '@angular/common/http';
import { DSpaceObjectDataService } from 'src/app/core/data/dspace-object-data.service';
@Component({
  selector: 'ds-top-section',
  templateUrl: './top-section.component.html',
  styleUrls: ['./top-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut
  ]
})
export class TopSectionComponent implements OnInit {
  itemRD$: Observable<RemoteData<PaginatedList<Item>>>;
  paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;
  itemsRD$ =new BehaviorSubject<any[]>([]);
  itemIds=[];
  
  /**
 * The view-mode we're currently on
 * @type {ViewMode}
 */
  viewMode = ViewMode.GridElement;

  @Input() showViewModes = true; //kware-edit
  @Input() viewModeList: ViewMode[]; //kware-edit
  @Input() siteId : string;
  private _placeholderFontClass: string;

  constructor(
    // private searchService: SearchService,
    private paginationService: PaginationService,
    // public searchConfigurationService: SearchConfigurationService,
    // protected elementRef: ElementRef,
    protected dsoService: DSpaceObjectDataService,
    private httpClient: HttpClient,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    // @Inject(PLATFORM_ID) private platformId: Object,
  ) {

    this.paginationConfig = Object.assign(new PaginationComponentOptions(), {
      id: 'hp',
      pageSize: 5,
      currentPage: 1,
      maxSize: 1
    });
    this.sortConfig = new SortOptions(environment.homePage.recentSubmissions.sortField, SortDirection.DESC);
  }
  ngOnInit(): void {
    const linksToFollow: FollowLinkConfig<Item>[] = [];
    if (this.appConfig.browseBy.showThumbnails) {
      linksToFollow.push(followLink('thumbnail'));
    }


this.getMostViewsItems(this.siteId).then((items) => {
  items.subscribe((item) => {
    item['_embedded'].usagereports[0]?.points?.sort(
      (p1, p2) => (p1.values.views < p2.values.views) ? 1 : (p1.values.views > p2.values.views) ? -1 : 0).forEach(async(point) => {
      let itemId =await point.id;
      this.itemIds.push(point.id);

      await this.dsoService.findById(itemId)?.subscribe( async item=>{
        if(item.payload?.id == point?.id){
          await this.itemsRD$.next(this.itemsRD$.getValue().concat([item]))

        }
      })
    })
  })
})
  }
  
  async getMostViewsItems(siteId: string) : Promise<any>{
    const  data= await this.httpClient.get(`${environment.rest.baseUrl}/api/statistics/usagereports/search/object?&uri=${environment.rest.baseUrl}/api/core/site/${siteId}`);
    return await data;

  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.paginationConfig.id);
  }

  // onLoadMore(): void {
  //   this.paginationService.updateRouteWithUrl(this.searchConfigurationService.paginationID, ['search'], {
  //     sortField: environment.homePage.recentSubmissions.sortField,
  //     sortDirection: 'DESC' as SortDirection,
  //     page: 1
  //   });
  // }

  // get placeholderFontClass(): string {
  //   if (this._placeholderFontClass === undefined) {
  //     if (isPlatformBrowser(this.platformId)) {
  //       const width = this.elementRef.nativeElement.offsetWidth;
  //       this._placeholderFontClass = setPlaceHolderAttributes(width);
  //     } else {
  //       this._placeholderFontClass = 'hide-placeholder-text';
  //     }
  //   }
  //   return this._placeholderFontClass;
  // }

}


