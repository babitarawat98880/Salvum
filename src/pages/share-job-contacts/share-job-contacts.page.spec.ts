import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShareJobContactsPage } from './share-job-contacts.page';

describe('ShareJobContactsPage', () => {
  let component: ShareJobContactsPage;
  let fixture: ComponentFixture<ShareJobContactsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShareJobContactsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
