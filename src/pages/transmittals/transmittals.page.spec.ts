import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransmittalsPage } from './transmittals.page';

describe('TransmittalsPage', () => {
  let component: TransmittalsPage;
  let fixture: ComponentFixture<TransmittalsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TransmittalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
