import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlLqrDebugInfoComponent } from './control-lqr-debug-info.component';

describe('ControlLqrDebugInfoComponent', () => {
  let component: ControlLqrDebugInfoComponent;
  let fixture: ComponentFixture<ControlLqrDebugInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlLqrDebugInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlLqrDebugInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
