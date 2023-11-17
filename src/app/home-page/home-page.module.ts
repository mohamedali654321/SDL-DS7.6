import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeNewsComponent } from './home-news/home-news.component';
import { HomePageRoutingModule } from './home-page-routing.module';

import { HomePageComponent } from './home-page.component';
import { TopLevelCommunityListComponent } from './top-level-community-list/top-level-community-list.component';
import { StatisticsModule } from '../statistics/statistics.module';
import { ThemedHomeNewsComponent } from './home-news/themed-home-news.component';
import { ThemedHomePageComponent } from './themed-home-page.component';
import { RecentItemListComponent } from './recent-item-list/recent-item-list.component';
import { JournalEntitiesModule } from '../entity-groups/journal-entities/journal-entities.module';
import { ResearchEntitiesModule } from '../entity-groups/research-entities/research-entities.module';
import { ThemedTopLevelCommunityListComponent } from './top-level-community-list/themed-top-level-community-list.component';
import { TopSectionComponent } from './top-section/top-section.component';
// import { CategoryItemsComponent } from './browse-categories/items/category-items.component';
// import { BrowseCategoryComponent } from './browse-categories/category/browse-category.component';
// import { CategoryItemComponent } from './browse-categories/item/category-item.component';
// import { BrowseSubCategoriesComponent } from './browse-categories/browse-sub-categories/browse-sub-categories.component';
// import { BrowseSubCategoryComponent } from './browse-categories/browse-sub-categories/sub-category/browse-sub-category.component';
import { BrowseCategoriesComponent } from './browse-categories/browse-categories.component';
import { CategoriesComponent } from './browse-categories/components/categories/categories.component';
import { CategoryComponent } from './browse-categories/components/category/category.component';
import { CategoryContentComponent } from './browse-categories/components/category-content/category-content.component';
import { PublicationCategoryComponent } from './browse-categories/subCategories/publication/publication-category/publication-category.component';

const DECLARATIONS = [
  HomePageComponent,
  ThemedHomePageComponent,
  TopLevelCommunityListComponent,
  ThemedTopLevelCommunityListComponent,
  ThemedHomeNewsComponent,
  HomeNewsComponent,
  TopSectionComponent,
  RecentItemListComponent,
  BrowseCategoriesComponent,
  CategoriesComponent,
    CategoryComponent,
    CategoryContentComponent,
    PublicationCategoryComponent,
  // BrowseCategoryComponent,
  // CategoryItemsComponent,
  // CategoryItemComponent,
  // BrowseSubCategoriesComponent,
  // BrowseSubCategoryComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule.withEntryComponents(),
    JournalEntitiesModule.withEntryComponents(),
    ResearchEntitiesModule.withEntryComponents(),
    HomePageRoutingModule,
    StatisticsModule.forRoot()
  ],
  declarations: [
    ...DECLARATIONS,
    
  ],
  exports: [
    ...DECLARATIONS,
  ],
})
export class HomePageModule {

}
