import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditpassPage } from './editpass.page';

describe('EditpassPage', () => {
  let component: EditpassPage;
  let fixture: ComponentFixture<EditpassPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditpassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
