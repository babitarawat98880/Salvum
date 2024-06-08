import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignCompanyPage } from './assign-company.page';

describe('AssignCompanyPage', () => {
  let component: AssignCompanyPage;
  let fixture: ComponentFixture<AssignCompanyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AssignCompanyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
