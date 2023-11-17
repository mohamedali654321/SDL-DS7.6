/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Input, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { CategoryComponent } from '../category/category.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { Item } from 'src/app/core/shared/item.model';

@Component({
  selector: 'ds-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  @Input() categoryContentTemplate: TemplateRef<any>;

  @ViewChildren(CategoryComponent) categoriesIds: QueryList<CategoryComponent>;
  @Input() categories = [];
  @Input() categoriesConfigs = [];
  @Input() setSelectedCategoryItems: (catItems: Observable<RemoteData<PaginatedList<Item>>>) => void;
  @Input() getCategoryItems: (categoryValue: string) => Observable<RemoteData<PaginatedList<Item>>>;

  @Input() queryOptions = {};
  @Input() selectedCategory: number;
  @Input() translatePipe: string;
  @Input() categoryParam: string;

  constructor(protected router: Router, private route: ActivatedRoute
  ) { }

  handleCurrentCategoryItmes() {
    const categoryElementRef = this.categoriesIds.toArray().find(cat => cat.categoryIndex === this.selectedCategory);
    this.setSelectedCategoryItems(categoryElementRef.fetchedItems);
    categoryElementRef.scrollToView();
    this.updateUrl();
  }

  setSelectedCategory(index: number) {
    this.selectedCategory = index;
    this.handleCurrentCategoryItmes();
    this.updateUrl();
  }

  updateUrl() {
    void this.router.navigate([], {
      queryParams: { [this.categoryParam]: this.categories[this.selectedCategory].value },
      queryParamsHandling: 'merge'
    });
  }

  getNextCategory() {
    if (!this.selectedCategory && this.selectedCategory !== 0 || this.selectedCategory === this.categories.length - 1) {
      this.selectedCategory = 0;
    } else {
      this.selectedCategory++;
    }
    this.handleCurrentCategoryItmes();
  }

  getPrevCategory() {
    if (this.selectedCategory === 0) {
      this.selectedCategory = this.categories.length - 1;
    } else {
      this.selectedCategory--;
    }
    this.handleCurrentCategoryItmes();
  }
}
