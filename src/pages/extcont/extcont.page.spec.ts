import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtcontPage } from './extcont.page';

describe('ExtcontPage', () => {
  let component: ExtcontPage;
  let fixture: ComponentFixture<ExtcontPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExtcontPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
