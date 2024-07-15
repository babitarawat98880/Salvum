import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadfilePage } from './uploadfile.page';

describe('UploadfilePage', () => {
  let component: UploadfilePage;
  let fixture: ComponentFixture<UploadfilePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UploadfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
