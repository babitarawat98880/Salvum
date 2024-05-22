import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmallInboxPage } from './small-inbox.page';

describe('SmallInboxPage', () => {
  let component: SmallInboxPage;
  let fixture: ComponentFixture<SmallInboxPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SmallInboxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
