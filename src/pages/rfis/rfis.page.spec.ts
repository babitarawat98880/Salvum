import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RfisPage } from './rfis.page';

describe('RfisPage', () => {
  let component: RfisPage;
  let fixture: ComponentFixture<RfisPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RfisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
