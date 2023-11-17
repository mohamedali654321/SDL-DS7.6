/* eslint-disable unused-imports/no-unused-imports */
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SortOptions } from 'src/app/core/cache/models/sort-options.model';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { RemoteData } from 'src/app/core/data/remote-data';
import { Item } from 'src/app/core/shared/item.model';

@Component({
  selector: 'ds-category-content',
  templateUrl: './category-content.component.html',
  styleUrls: ['./category-content.component.scss']
})
export class CategoryContentComponent {
  @Input() paginationConfig = {};
  @Input() sortConfig: SortOptions;
  @Input() objects: Observable<RemoteData<PaginatedList<Item>>>;
  @Input() loadMoreLink: string;
  @Input() loadMoreParams = {
    value: '',
    view: '',
    source: ''
  };
}
