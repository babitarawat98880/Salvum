import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagegroupPage } from './managegroup.page';

describe('ManagegroupPage', () => {
  let component: ManagegroupPage;
  let fixture: ComponentFixture<ManagegroupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManagegroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
