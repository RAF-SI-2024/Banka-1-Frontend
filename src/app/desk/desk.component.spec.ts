import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeskComponent } from './desk.component';

describe('DeskComponent', () => {
  let component: DeskComponent;
  let fixture: ComponentFixture<DeskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeskComponent]
    });
    fixture = TestBed.createComponent(DeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
