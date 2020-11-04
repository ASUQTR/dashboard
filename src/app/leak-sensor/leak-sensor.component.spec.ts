import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeakSensorComponent } from './leak-sensor.component';

describe('LeakSensorComponent', () => {
  let component: LeakSensorComponent;
  let fixture: ComponentFixture<LeakSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeakSensorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeakSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
