import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperOscillatorComponent } from './stepper-oscillator.component';

describe('StepperOscillatorComponent', () => {
  let component: StepperOscillatorComponent;
  let fixture: ComponentFixture<StepperOscillatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepperOscillatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperOscillatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
