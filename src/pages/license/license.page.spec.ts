import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LicensePage } from './license.page';

describe('LicensePage', () => {
  let component: LicensePage;
  let fixture: ComponentFixture<LicensePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LicensePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
