import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactslistPage } from './contactslist.page';

describe('ContactslistPage', () => {
  let component: ContactslistPage;
  let fixture: ComponentFixture<ContactslistPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ContactslistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
