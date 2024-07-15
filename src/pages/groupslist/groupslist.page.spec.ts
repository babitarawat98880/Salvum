import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupslistPage } from './groupslist.page';

describe('GroupslistPage', () => {
  let component: GroupslistPage;
  let fixture: ComponentFixture<GroupslistPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GroupslistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
