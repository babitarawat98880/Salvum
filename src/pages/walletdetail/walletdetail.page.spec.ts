import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WalletdetailPage } from './walletdetail.page';

describe('WalletdetailPage', () => {
  let component: WalletdetailPage;
  let fixture: ComponentFixture<WalletdetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WalletdetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
