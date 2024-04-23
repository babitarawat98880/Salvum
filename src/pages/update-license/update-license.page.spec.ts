import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateLicensePage } from './update-license.page';

describe('UpdateLicensePage', () => {
  let component: UpdateLicensePage;
  let fixture: ComponentFixture<UpdateLicensePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UpdateLicensePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
