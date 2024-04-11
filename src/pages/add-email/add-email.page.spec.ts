import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEmailPage } from './add-email.page';

describe('AddEmailPage', () => {
  let component: AddEmailPage;
  let fixture: ComponentFixture<AddEmailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
