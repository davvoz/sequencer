import { Component, OnInit, Input } from '@angular/core';
import { MySampler } from '../../classes/mySampler';
import { Subscription } from 'rxjs/Subscription';
import { MyOscillator } from '../../classes/myOscillator';
import { Preset, Step, StepSampler } from '../../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { TimerService } from '../../services/timerService';
import { SamplesLibraryService } from '../../services/samplesLibraryService';
import { Observable } from 'rxjs/Observable';
import { AudioContext } from 'angular-audio-context';

@Component({
  selector: 'app-stepper-oscillator',
  templateUrl: './stepper-oscillator.component.html',
  styleUrls: ['./stepper-oscillator.component.css']
})
export class StepperOscillatorComponent implements OnInit {
  motion = [
    1700, 1600, 1500, 1400, 1300, 1200, 1100, 1000, 800,
    700, 600, 500, 400, 300, 200, 100,
    100, 200, 300, 400, 500, 600, 700, 800,
    900, 1000, 1100, 1200, 1300, 1400, 1500, 1600
  ];
  @Input() speed: number;

  @Input() myTimer: boolean;
  soundState: boolean;
  @Input() trackIndex: number;
  subscription: Subscription;
  subscriptionIndexTraks: Subscription;
  waveforms = ['sine', 'square', 'triangle', 'sawtooth'];
  masterSubscription: Subscription;
  speedModel;
  generalSustain = 0;
  generalGain = 0;
  isStarted = false;
  oscillators: MyOscillator[] = [];
  stepIndex = 0;
  initialNumberOfStep = 0;
  sustain = 0;
  tune = 0;
  flatPitchMode = 20;
  flatSustainMode = 0;
  presets: Preset[] = [];
  selectedPreset: Preset = { titolo: '', note: [] };
  stepsOscillator: Step[] = [];
  flatGainMode = 0;
  filters = ['allpass', 'bandpass', 'highpass', 'highshelf', 'lowpass', 'lowshelf', 'notch', 'peaking'];
  storage: Preset[] = [this.selectedPreset];
  presetJson;
  isFiltred = false;
  filterGain;
  filterFrequency;
  selectedFilter = 'allpass';
  play = true;
  isMotion = false;
  isMotionPitch = false;
  traksDisplay = [];
  filter;
  patterns = [];
  constructor(
    private audioCtx: AudioContext,
    private http: HttpClient,
    private myTimerService: TimerService
  ) {    
    this.speedModel = this.myTimerService.speed;
    this.stepIndex = 0;
    this.generalSustain = 0;
    this.generalGain = 0;
    this.filterGain = 0;
    this.filterFrequency = 0;
    for (let i = 0; i < 32; i++) {
      this.oscillators[i] = new MyOscillator(this.audioCtx);
    }
  }
  startMotion() {
    !this.isMotion ? this.isMotion = true : this.isMotion = false;
  }
  filterOnOff() {
    this.isFiltred ?
      this.isFiltred = false :
      this.isFiltred = true;
  }
  savePreset() {
    const newPreset: Preset = { titolo: 'User preset' + this.presets.length, note: this.stepsOscillator };
    this.presets = JSON.parse(localStorage.getItem('presetOscillator'));
    this.presets.push(newPreset);
    localStorage.setItem('presetOscillator', JSON.stringify(this.presets));
    this.selectedPreset = newPreset;
    this.presetJson = JSON.stringify(newPreset);
  }

  cambioPreset() {
    this.stepsOscillator = this.selectedPreset.note;
    this.presetJson = JSON.stringify(this.selectedPreset);
  }

  someChange() {
    // this.initJson();
  }
  getJSON(path: string): Observable<any> {
    return this.http.get(path);
  }
  noteOn(index: number) {

    if (this.stepsOscillator[index].play) {
      this.stepsOscillator[index].play = false;
    } else {
      this.stepsOscillator[index].play = true;
    }


  }
  ngOnInit() {
    
    this.getJSON('../../../assets/JSON/preset.JSON').subscribe(
      data => {
        localStorage.setItem('presetOscillator', JSON.stringify(data));
        this.storage = JSON.parse(localStorage.getItem('presetOscillator'));
        this.presets = data;
        this.selectedPreset = this.presets[0];
        this.initialNumberOfStep = this.selectedPreset.note.length;
        this.stepsOscillator = this.selectedPreset.note;
        this.presetJson = JSON.stringify(this.selectedPreset);
        this.storage = data;
        this.subscription = this.myTimerService.trackStateItem$
          .subscribe(res => {
            if (res.traksAreOn[this.trackIndex]) {
              this.playStep(res.timePosition);
            }
          });
      });


  }
  startPitchMotion() {
    !this.isMotionPitch ? this.isMotionPitch = true : this.isMotionPitch = false;
  }
  playStep(index: number) {
    if (this.isMotion) {
      this.filterFrequency = this.motion[index];
    }
    if (this.isMotionPitch) {
      this.tune = this.motion[index];
    }
    this.stepIndex = index;
    this.oscillators[index].play(
      this.stepsOscillator[index].frequency + this.tune,
      this.stepsOscillator[index].sustain + this.generalSustain,
      this.stepsOscillator[index].detune / 10,
      this.stepsOscillator[index].type,
      this.stepsOscillator[index].gain / 10 + this.generalGain,
      this.stepsOscillator[index].play,
      this.isFiltred,
      this.filterGain,
      this.filterFrequency,
      this.selectedFilter
    );
  }

  panic() {
    for (let i = 0; i < this.stepsOscillator.length; i++) {
      const val = Math.floor(Math.random() * 1000) + 20;
      this.stepsOscillator[i].frequency = val;
      const val2 = Math.floor(Math.random() * 500) + 0;
      this.stepsOscillator[i].sustain = val2;
      this.initJson();
    }
  }
  flatPitch() {
    for (let i = 0; i < this.stepsOscillator.length; i++) {
      this.stepsOscillator[i].frequency = this.flatPitchMode;
      this.initJson();
    }
  }
  flatSustain() {
    for (let i = 0; i < this.stepsOscillator.length; i++) {
      this.stepsOscillator[i].sustain = this.flatSustainMode;
      this.initJson();
    }
  }
  flatGain() {
    for (let i = 0; i < this.stepsOscillator.length; i++) {
      this.stepsOscillator[i].gain = this.flatGainMode;
      this.initJson();
    }
  }
  initJson() {
    this.presetJson = JSON.stringify({ titolo: 'JsonPresetOscillator', note: this.stepsOscillator });
  }

}
