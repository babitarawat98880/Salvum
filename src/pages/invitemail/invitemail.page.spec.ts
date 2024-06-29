import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvitemailPage } from './invitemail.page';

describe('InvitemailPage', () => {
  let component: InvitemailPage;
  let fixture: ComponentFixture<InvitemailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InvitemailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
