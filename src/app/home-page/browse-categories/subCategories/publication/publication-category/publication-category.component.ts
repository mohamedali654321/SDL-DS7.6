import { Component, OnDestroy, OnInit } from '@angular/core';
import { BrowseEntrySearchOptions } from 'src/app/core/browse/browse-entry-search-options.model';
import { BrowseService } from 'src/app/core/browse/browse.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Item } from 'src/app/core/shared/item.model';
import { RemoteData } from 'src/app/core/data/remote-data';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { PaginationService } from 'src/app/core/pagination/pagination.service';
import { PaginationComponentOptions } from 'src/app/shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from 'src/app/core/cache/models/sort-options.model';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from 'src/app/core/shared/search/search.service';
import { DSpaceObjectType } from 'src/app/core/shared/dspace-object-type.model';
import { PaginatedSearchOptions } from 'src/app/shared/search/models/paginated-search-options.model';
import { toDSpaceObjectListRD } from 'src/app/core/shared/operators';
import { BrowseEntry } from 'src/app/core/shared/browse-entry.model';

@Component({
  selector: 'ds-publication-category',
  templateUrl: './publication-category.component.html',
  styleUrls: ['./publication-category.component.scss']
})
export class PublicationCategoryComponent implements OnInit, OnDestroy {
  pubCategories = [];
  pubCategoriesConfig = {
    'All': { icon: 'fa-solid fa-book-open' },
    'Article | مقال': { icon: 'fa-solid fa-newspaper' },
    'Book | كتاب': { icon: 'fa-solid fa-book' },
    'Image | صورة': { icon: 'fa-solid fa-image' },
    'Research and Studies | بحث ودراسات': { icon: 'fa-solid fa-magnifying-glass' },
    'Research | بحث': { icon: 'fa-solid fa-magnifying-glass' },
    'Manuscript | مخطوطة': { icon: 'fa-solid fa-receipt' },
    'University Dissertations | رسالة جامعية': { icon: 'fa-solid fa-receipt' },
    'Presentation | عرض تقديمي': { icon: '' },
    'Video | فيديو': { icon: 'fa-solid fa-video' },
    'Dataset | بيانات': { icon: '' },
    'Quran | مصحف': { icon: 'fa-solid fa-book-quran' },
    'Oral Recording | تسجيل شفوي': { icon: 'fa-solid fa-microphone' },
    'Recording acoustical | تسجيل صوتي': { icon: 'fa-solid fa-microphone' },
    'Report | تقرير': { icon: 'fa-solid fa-file-pen' },
    'Software | برمجيات': { icon: '' },
    'Study | دراسة': { icon: 'fas fa-chart-pie' },
    'E-Book | كتاب إلكتروني': { icon: '' },
    'Musical Score | نوتة موسيقية': { icon: '' },
    'Map | خريطة': { icon: '' },
    'Rare Book | كتاب نادر': { icon: 'fa-solid fa-book' },
    'Precious Possession | مقتنى ثمين': { icon: 'fa-solid fa-gem' },
    'Microfilm | فيلم مصغر': { icon: '' },
    'Compact Disc | قرص مضغوط': { icon: '' },
    'Cassette Tape | شريط (كاسيت)': { icon: '' },
    'Newspaper | صحيفة ورقية': { icon: '' },
    'Painting | لوحة فنية': { icon: '' },
    'Ancient Relics | آثار قديمة': { icon: '' }
  };
  items$ = new BehaviorSubject([]);
  paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;
  selectedCategory = 0;
  allPub: BrowseEntry;

  itemRD$: Observable<RemoteData<PaginatedList<Item>>>;

  constructor(
    private browseService: BrowseService,
    private paginationService: PaginationService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    protected router: Router,
  ) {
    this.paginationConfig = Object.assign(new PaginationComponentOptions(), {
      id: 'hp',
      pageSize: 5,
      currentPage: 1,
      maxSize: 1
    });
    this.sortConfig = new SortOptions(environment.homePage.recentSubmissions.sortField, SortDirection.DESC);
  }

  ngOnInit() {
    this.browseService.getBrowseEntriesFor(
      new BrowseEntrySearchOptions('itemtype')
    ).subscribe(entities => {
      this.pubCategories = entities?.payload?.page;
      this.pubCategories.unshift({ type: 'browseEntry', value: 'All' });
      this.route.queryParams
        .subscribe(params => {
          const currentIndex = entities?.payload?.page.findIndex(cat => cat.value === params.subCategory);
          if (currentIndex && currentIndex !== -1) {
            this.selectedCategory = currentIndex;
          } else {
            this.selectedCategory = 0;
          }
        }
        );
      void this.router.navigate([], {
        queryParams: { 'subCategory': entities?.payload?.page[this.selectedCategory].value },
        queryParamsHandling: 'merge'
      });
    });
  }

  getPubCategoryItems(categoryValue: string): Observable<RemoteData<PaginatedList<Item>>> {
    if (categoryValue === 'All') {
      return this.searchService.search(
        new PaginatedSearchOptions(
          {
            pagination: this.paginationConfig,
            dsoTypes: [DSpaceObjectType.ITEM],
            sort: this.sortConfig,
            query: 'dspace.entity.type:Publication',
            fixedFilter: 'f.entityType=Publication,equals'
          }
        ),
        undefined,
        undefined,
        undefined,
      ).pipe(
        toDSpaceObjectListRD()
      ) as Observable<RemoteData<PaginatedList<Item>>>;
    } else {
      return this.searchService.search(
        new PaginatedSearchOptions({
          pagination: this.paginationConfig,
          dsoTypes: [DSpaceObjectType.ITEM],
          sort: this.sortConfig,
          query: `dc.type:${categoryValue}`,
          fixedFilter: `f.itemtype=${categoryValue},equals`
        },),
        undefined,
        undefined,
        undefined,
      ).pipe(
        toDSpaceObjectListRD()
      ) as Observable<RemoteData<PaginatedList<Item>>>;
    }
  }

  setSelectedCategoryItems = (catItems: Observable<RemoteData<PaginatedList<Item>>>) => {
    this.itemRD$ = catItems;
  };

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.paginationConfig.id);
    // void this.router.navigate([], {
    //   queryParams: { 'subCategory': null },
    //   queryParamsHandling: 'merge'
    // });
  }
}
