import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SitesdetailPage } from './sitesdetail.page';

describe('SitesdetailPage', () => {
  let component: SitesdetailPage;
  let fixture: ComponentFixture<SitesdetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SitesdetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
