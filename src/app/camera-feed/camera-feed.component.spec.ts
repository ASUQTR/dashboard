import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraFeedComponent } from './camera-feed.component';

describe('CameraFeedComponent', () => {
  let component: CameraFeedComponent;
  let fixture: ComponentFixture<CameraFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
