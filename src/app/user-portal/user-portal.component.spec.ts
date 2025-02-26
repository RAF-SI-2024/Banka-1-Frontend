import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPortalComponent } from './user-portal.component';

describe('UserPortalComponent', () => {
  let component: UserPortalComponent;
  let fixture: ComponentFixture<UserPortalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPortalComponent]
    });
    fixture = TestBed.createComponent(UserPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
