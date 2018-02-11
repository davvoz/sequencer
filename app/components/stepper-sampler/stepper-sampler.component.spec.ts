import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperSamplerComponent } from './stepper-sampler.component';

describe('StepperSamplerComponent', () => {
  let component: StepperSamplerComponent;
  let fixture: ComponentFixture<StepperSamplerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepperSamplerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperSamplerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
