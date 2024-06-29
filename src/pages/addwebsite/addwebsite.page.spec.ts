import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddwebsitePage } from './addwebsite.page';

describe('AddwebsitePage', () => {
  let component: AddwebsitePage;
  let fixture: ComponentFixture<AddwebsitePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddwebsitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
