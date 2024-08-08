import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AskEnggPage } from './ask-engg.page';

describe('AskEnggPage', () => {
  let component: AskEnggPage;
  let fixture: ComponentFixture<AskEnggPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AskEnggPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
