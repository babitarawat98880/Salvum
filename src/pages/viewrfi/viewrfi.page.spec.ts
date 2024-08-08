import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewrfiPage } from './viewrfi.page';

describe('ViewrfiPage', () => {
  let component: ViewrfiPage;
  let fixture: ComponentFixture<ViewrfiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewrfiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
