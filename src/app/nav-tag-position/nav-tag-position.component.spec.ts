import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavTagPositionComponent } from './nav-tag-position.component';

describe('NavTagPositionComponent', () => {
  let component: NavTagPositionComponent;
  let fixture: ComponentFixture<NavTagPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavTagPositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavTagPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
