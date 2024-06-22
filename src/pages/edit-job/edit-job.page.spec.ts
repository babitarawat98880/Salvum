import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditJobPage } from './edit-job.page';

describe('EditJobPage', () => {
  let component: EditJobPage;
  let fixture: ComponentFixture<EditJobPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditJobPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
