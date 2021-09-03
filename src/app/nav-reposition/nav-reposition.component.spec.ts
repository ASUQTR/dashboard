import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavRepositionComponent } from './nav-reposition.component';

describe('NavRepositionComponent', () => {
  let component: NavRepositionComponent;
  let fixture: ComponentFixture<NavRepositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavRepositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavRepositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
