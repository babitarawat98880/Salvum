import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddrfiPage } from './addrfi.page';

describe('AddrfiPage', () => {
  let component: AddrfiPage;
  let fixture: ComponentFixture<AddrfiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddrfiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
