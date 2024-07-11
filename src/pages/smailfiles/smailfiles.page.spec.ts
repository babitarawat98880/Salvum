import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmailfilesPage } from './smailfiles.page';

describe('SmailfilesPage', () => {
  let component: SmailfilesPage;
  let fixture: ComponentFixture<SmailfilesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SmailfilesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
