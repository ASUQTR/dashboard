import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorTableComponent } from './motor-table.component';

describe('MotorTableComponent', () => {
  let component: MotorTableComponent;
  let fixture: ComponentFixture<MotorTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotorTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
