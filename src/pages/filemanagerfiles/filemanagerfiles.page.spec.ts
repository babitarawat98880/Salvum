import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilemanagerfilesPage } from './filemanagerfiles.page';

describe('FilemanagerfilesPage', () => {
  let component: FilemanagerfilesPage;
  let fixture: ComponentFixture<FilemanagerfilesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FilemanagerfilesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
