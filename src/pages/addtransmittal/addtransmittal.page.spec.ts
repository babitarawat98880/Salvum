import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddtransmittalPage } from './addtransmittal.page';

describe('AddtransmittalPage', () => {
  let component: AddtransmittalPage;
  let fixture: ComponentFixture<AddtransmittalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddtransmittalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
