import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditsitePage } from './editsite.page';

describe('EditsitePage', () => {
  let component: EditsitePage;
  let fixture: ComponentFixture<EditsitePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditsitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
