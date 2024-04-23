import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagejobPage } from './managejob.page';

describe('ManagejobPage', () => {
  let component: ManagejobPage;
  let fixture: ComponentFixture<ManagejobPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManagejobPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
