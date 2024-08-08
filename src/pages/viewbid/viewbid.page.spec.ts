import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewbidPage } from './viewbid.page';

describe('ViewbidPage', () => {
  let component: ViewbidPage;
  let fixture: ComponentFixture<ViewbidPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewbidPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
