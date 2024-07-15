import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobfilePage } from './jobfile.page';

describe('JobfilePage', () => {
  let component: JobfilePage;
  let fixture: ComponentFixture<JobfilePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JobfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
