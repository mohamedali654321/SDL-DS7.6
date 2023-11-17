import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruncatableModalComponent } from './truncatable-modal.component';

describe('TruncatableModalComponent', () => {
  let component: TruncatableModalComponent;
  let fixture: ComponentFixture<TruncatableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruncatableModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TruncatableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
