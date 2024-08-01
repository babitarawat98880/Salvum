import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAdendumPage } from './add-adendum.page';

describe('AddAdendumPage', () => {
  let component: AddAdendumPage;
  let fixture: ComponentFixture<AddAdendumPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddAdendumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
