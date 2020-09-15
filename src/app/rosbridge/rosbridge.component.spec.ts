import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosbridgeComponent } from './rosbridge.component';

describe('RosbridgeComponent', () => {
  let component: RosbridgeComponent;
  let fixture: ComponentFixture<RosbridgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosbridgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosbridgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
