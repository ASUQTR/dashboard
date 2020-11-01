import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepthMeterComponent } from './depth-meter.component';

describe('DepthMeterComponent', () => {
  let component: DepthMeterComponent;
  let fixture: ComponentFixture<DepthMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepthMeterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepthMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
