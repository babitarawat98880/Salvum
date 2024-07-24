import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddeventPage } from './addevent.page';

describe('AddeventPage', () => {
  let component: AddeventPage;
  let fixture: ComponentFixture<AddeventPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddeventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
