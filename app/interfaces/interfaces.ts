
import { StepperOscillatorComponent } from '../components/stepper-oscillator/stepper-oscillator.component';
import { StepperSamplerComponent } from '../components/stepper-sampler/stepper-sampler.component';

export interface Step {
    sustain: number;
    gain: number;
    type: string;
    frequency: number;
    detune: number;
    play: boolean;
}
export interface StepSampler {
    gain: number;
    samplePath: string;
    sampleTune: number;
    filterFrequency: number;
    filterGain: number;
    play: boolean;
    duration: number;
}
export interface PresetSampler {
    titolo: string;
    note: StepSampler[];
}
export interface Preset {
    titolo: string;
    note: Step[];
}
export declare type TOStepSequencerComponentType = 'oscillator' | 'sampler';
export interface Track {
    track: StepperSamplerComponent ;
    tipo: TOStepSequencerComponentType ;
    destroy: boolean;
}
export interface TrackOsc {
    track:  StepperOscillatorComponent ;
    tipo: TOStepSequencerComponentType;
}

export interface TickResponse {
    traksAreOn: boolean[];
    timePosition: number;
    isStarted: boolean;
    audioContextTime: number;
}
