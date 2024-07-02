import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddpasswordPage } from './addpassword.page';

describe('AddpasswordPage', () => {
  let component: AddpasswordPage;
  let fixture: ComponentFixture<AddpasswordPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddpasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
