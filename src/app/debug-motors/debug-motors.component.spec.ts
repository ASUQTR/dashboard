import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugMotorsComponent } from './debug-motors.component';

describe('DebugMotorsComponent', () => {
  let component: DebugMotorsComponent;
  let fixture: ComponentFixture<DebugMotorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebugMotorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugMotorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
