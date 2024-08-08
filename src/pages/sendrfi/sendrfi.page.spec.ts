import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SendrfiPage } from './sendrfi.page';

describe('SendrfiPage', () => {
  let component: SendrfiPage;
  let fixture: ComponentFixture<SendrfiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SendrfiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
