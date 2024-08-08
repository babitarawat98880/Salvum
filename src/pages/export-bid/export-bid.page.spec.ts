import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportBidPage } from './export-bid.page';

describe('ExportBidPage', () => {
  let component: ExportBidPage;
  let fixture: ComponentFixture<ExportBidPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExportBidPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
