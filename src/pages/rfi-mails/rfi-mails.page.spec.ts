import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RfiMailsPage } from './rfi-mails.page';

describe('RfiMailsPage', () => {
  let component: RfiMailsPage;
  let fixture: ComponentFixture<RfiMailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RfiMailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
