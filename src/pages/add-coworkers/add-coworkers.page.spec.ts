import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCoworkersPage } from './add-coworkers.page';

describe('AddCoworkersPage', () => {
  let component: AddCoworkersPage;
  let fixture: ComponentFixture<AddCoworkersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddCoworkersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
