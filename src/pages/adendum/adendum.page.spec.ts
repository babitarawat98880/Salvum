import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdendumPage } from './adendum.page';

describe('AdendumPage', () => {
  let component: AdendumPage;
  let fixture: ComponentFixture<AdendumPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdendumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
