import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordsPage } from './passwords.page';

describe('PasswordsPage', () => {
  let component: PasswordsPage;
  let fixture: ComponentFixture<PasswordsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PasswordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
