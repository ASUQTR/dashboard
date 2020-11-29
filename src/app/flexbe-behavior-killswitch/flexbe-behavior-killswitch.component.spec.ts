import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexbeBehaviorKillswitchComponent } from './flexbe-behavior-killswitch.component';

describe('FlexbeBehaviorKillswitchComponent', () => {
  let component: FlexbeBehaviorKillswitchComponent;
  let fixture: ComponentFixture<FlexbeBehaviorKillswitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlexbeBehaviorKillswitchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexbeBehaviorKillswitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
