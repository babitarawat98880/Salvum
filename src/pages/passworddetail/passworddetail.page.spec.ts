import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PassworddetailPage } from './passworddetail.page';

describe('PassworddetailPage', () => {
  let component: PassworddetailPage;
  let fixture: ComponentFixture<PassworddetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PassworddetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
