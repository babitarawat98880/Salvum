import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BidjobsPage } from './bidjobs.page';

describe('BidjobsPage', () => {
  let component: BidjobsPage;
  let fixture: ComponentFixture<BidjobsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BidjobsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
