import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileManagerPage } from './file-manager.page';

describe('FileManagerPage', () => {
  let component: FileManagerPage;
  let fixture: ComponentFixture<FileManagerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FileManagerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
