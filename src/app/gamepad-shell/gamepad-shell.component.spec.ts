import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamepadShellComponent } from './gamepad-shell.component';

describe('GamepadShellComponent', () => {
  let component: GamepadShellComponent;
  let fixture: ComponentFixture<GamepadShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamepadShellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamepadShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
