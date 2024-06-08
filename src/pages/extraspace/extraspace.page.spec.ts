import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtraspacePage } from './extraspace.page';

describe('ExtraspacePage', () => {
  let component: ExtraspacePage;
  let fixture: ComponentFixture<ExtraspacePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExtraspacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
