import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobCalendarPage } from './job-calendar.page';

describe('JobCalendarPage', () => {
  let component: JobCalendarPage;
  let fixture: ComponentFixture<JobCalendarPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JobCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
