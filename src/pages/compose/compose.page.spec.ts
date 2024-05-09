import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComposePage } from './compose.page';

describe('ComposePage', () => {
  let component: ComposePage;
  let fixture: ComponentFixture<ComposePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ComposePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
