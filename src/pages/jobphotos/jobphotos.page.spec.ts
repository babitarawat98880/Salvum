import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobphotosPage } from './jobphotos.page';

describe('JobphotosPage', () => {
  let component: JobphotosPage;
  let fixture: ComponentFixture<JobphotosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JobphotosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
