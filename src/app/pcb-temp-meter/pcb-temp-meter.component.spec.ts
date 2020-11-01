import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcbTempMeterComponent } from './pcb-temp-meter.component';

describe('PcbTempMeterComponent', () => {
  let component: PcbTempMeterComponent;
  let fixture: ComponentFixture<PcbTempMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcbTempMeterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PcbTempMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
