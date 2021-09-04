import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavGetPositionComponent } from './nav-get-position.component';

describe('NavGetPositionComponent', () => {
  let component: NavGetPositionComponent;
  let fixture: ComponentFixture<NavGetPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavGetPositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavGetPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
