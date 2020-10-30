import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorGraphComponent } from './motor-graph.component';

describe('MotorGraphComponent', () => {
  let component: MotorGraphComponent;
  let fixture: ComponentFixture<MotorGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotorGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotorGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
