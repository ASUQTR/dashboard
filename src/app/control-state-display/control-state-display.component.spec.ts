import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlStateDisplayComponent } from './control-state-display.component';

describe('ControlStateDisplayComponent', () => {
  let component: ControlStateDisplayComponent;
  let fixture: ComponentFixture<ControlStateDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlStateDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlStateDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
