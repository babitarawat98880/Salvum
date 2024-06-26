import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TradeDashboardPage } from './trade-dashboard.page';

describe('TradeDashboardPage', () => {
  let component: TradeDashboardPage;
  let fixture: ComponentFixture<TradeDashboardPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TradeDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
