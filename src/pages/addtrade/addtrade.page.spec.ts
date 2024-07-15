import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddtradePage } from './addtrade.page';

describe('AddtradePage', () => {
  let component: AddtradePage;
  let fixture: ComponentFixture<AddtradePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddtradePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
