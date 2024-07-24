import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TradeContactsPage } from './trade-contacts.page';

describe('TradeContactsPage', () => {
  let component: TradeContactsPage;
  let fixture: ComponentFixture<TradeContactsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TradeContactsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
