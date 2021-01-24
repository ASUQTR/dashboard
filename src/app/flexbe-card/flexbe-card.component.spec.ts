import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexbeCardComponent } from './flexbe-card.component';

describe('FlexbeCardComponent', () => {
  let component: FlexbeCardComponent;
  let fixture: ComponentFixture<FlexbeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlexbeCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexbeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
