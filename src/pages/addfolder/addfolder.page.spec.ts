import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddfolderPage } from './addfolder.page';

describe('AddfolderPage', () => {
  let component: AddfolderPage;
  let fixture: ComponentFixture<AddfolderPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddfolderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
