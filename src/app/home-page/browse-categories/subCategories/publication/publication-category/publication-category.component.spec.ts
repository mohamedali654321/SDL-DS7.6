import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationCategoryComponent } from './publication-category.component';

describe('PublicationCategoryComponent', () => {
  let component: PublicationCategoryComponent;
  let fixture: ComponentFixture<PublicationCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicationCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicationCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
