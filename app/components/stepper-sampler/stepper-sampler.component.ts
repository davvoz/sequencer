import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Preset, StepSampler, PresetSampler } from '../../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { TimerService } from '../../services/timerService';
import { SamplesLibraryService } from '../../services/samplesLibraryService';
import { MySampler } from '../../classes/mySampler';
import { Observable } from 'rxjs/Observable';
import { AudioContext } from 'angular-audio-context';
@Component({
  selector: 'app-stepper-sampler',
  templateUrl: './stepper-sampler.component.html',
  styleUrls: ['./stepper-sampler.component.css']
})
export class StepperSamplerComponent implements OnInit {

  @Input() speed: number;
  @Input() tipo: string;
  @Input() myTimer: boolean;
  soundState: boolean;
  @Input() trackIndex: number;
  motion = [
    1700, 1600, 1500, 1400, 1300, 1200, 1100, 1000, 800,
    700, 600, 500, 400, 300, 200, 100,
    100, 200, 300, 400, 500, 600, 700, 800,
    900, 1000, 1100, 1200, 1300, 1400, 1500, 1600
  ];
  runtimeLibrary = [
    { nome: 'hit', index: 0 },
    { nome: 'clap', index: 1 },
    { nome: 'kick', index: 2 },
    { nome: 'snare', index: 3 },
    { nome: 'metalhat', index: 4 },
    { nome: 'vox', index: 5 }];

  subscription: Subscription;
  subscriptionIndexTraks: Subscription;
  waveforms = ['sine', 'square', 'triangle', 'sawtooth'];
  masterSubscription: Subscription;
  hit = 'assets/WAV/57527__dolfeus__catbeat-hit.wav';
  tracks = [1, 2, 3, 4];
  speedModel;
  generalSustain = 0;
  generalGain = 0;
  isStarted = false;
  samplers: MySampler[] = [];
  stepIndex = 0;
  initialNumberOfStep = 0;
  sustain = 0;
  tune = 0;
  flatPitchMode = 20;
  flatSustainMode = 0;
  presets: PresetSampler[] = [];
  selectedPreset: PresetSampler = { titolo: '', note: [] };
  flatGainMode = 0;
  stepsSampler: StepSampler[] = [];
  count;
  selectedSample = this.runtimeLibrary[0].index;
  storage: PresetSampler[] = [this.selectedPreset];
  timer;
  presetJson;
  selectedSampleIndex: number;
  filterGain = 0;
  filterFrequency = 0;
  filterType;
  filters = ['allpass', 'bandpass', 'highpass', 'highshelf', 'lowpass', 'lowshelf', 'notch', 'peaking'];
  selectedFilter;
  play = true;
  isFiltred = false;
  isMotion = false;
  emptyPattern: StepSampler[] = [];
  isRecordingMotion = false;

  constructor(
    private audioCtx: AudioContext,
    private http: HttpClient,
    private myTimerService: TimerService,
    private library: SamplesLibraryService
  ) {
    this.speedModel = this.myTimerService.speed;
    this.stepIndex = 0;
    this.selectedSampleIndex = 0;
    for (let i = 0; i < 32; i++) {
      this.samplers[i] = new MySampler(this.audioCtx, this.library);
      this.stepsSampler[i] = {
        gain: 0.5,
        samplePath: '',
        sampleTune: 0.5,
        filterFrequency: 0,
        filterGain: 0,
        play: false,
        duration: 0.5
      };
    }

  }
  
  enableRecMotion() {
    this.isRecordingMotion ? this.isRecordingMotion = false : this.isRecordingMotion = true;

  }
  cambioPreset() {
    this.stepsSampler = this.selectedPreset.note;
    this.presetJson = JSON.stringify(this.selectedPreset);
  }
  savePreset() {
    const newPreset: PresetSampler = { titolo: 'User preset' + this.presets.length, note: this.stepsSampler };
    this.presets = JSON.parse(localStorage.getItem('presetSampler'));
    this.presets.push(newPreset);
    localStorage.setItem('presetSampler', JSON.stringify(this.presets));
    this.selectedPreset = newPreset;
    this.presetJson = JSON.stringify(newPreset);
  }
  startMotion() {
    !this.isMotion ? this.isMotion = true : this.isMotion = false;
  }
  filterOnOff() {
    this.isFiltred ? this.isFiltred = false : this.isFiltred = true;
  }

  changeSample(event) {
    // tslint:disable-next-line:radix
    const parsedValue = parseInt(event.target.value.substr(2));
    this.selectedSample = this.runtimeLibrary[parsedValue].index;
  }

  getJSON(path: string): Observable<any> {
    return this.http.get(path);
  }
  noteOn(index: number) {
    if (this.stepsSampler[index].play) {
      this.stepsSampler[index].play = false;
    } else {
      this.stepsSampler[index].play = true;
    }
  }
  ngOnInit() {
    this.selectedFilter = 'allpass';
    this.getJSON('../../../assets/JSON/presetSampler.JSON').subscribe(
      data => {
        localStorage.setItem('presetSampler', JSON.stringify(data));
        this.presets = data;
        this.selectedPreset = this.presets[0];
        this.initialNumberOfStep = this.selectedPreset.note.length;
        this.stepsSampler = this.selectedPreset.note;
        this.presetJson = JSON.stringify(this.selectedPreset);
        this.subscription = this.myTimerService.trackStateItem$
          .subscribe(res => {
            if (this.isRecordingMotion) {
              this.motion[res.timePosition] = this.filterFrequency;
            }
            if (res.traksAreOn[this.trackIndex]) {
              this.playStep(res.timePosition, res.audioContextTime);
            }  
          });
      });
  }
  playStep(index: number, audioContextTime: number) {
    if (this.isMotion) {
      this.filterFrequency = this.motion[index];
    }
    this.stepIndex = index;
    if (this.stepsSampler[index].play) {
      this.samplers[index].play(
        this.stepsSampler[index].gain + this.generalGain,
        this.stepsSampler[index].sampleTune + this.tune,
        this.selectedSample,
        this.stepsSampler[index].play,
        this.stepsSampler[index].duration,
        this.filterFrequency,
        this.filterGain,
        this.selectedFilter,
        this.isFiltred,
        audioContextTime);
    }

  }

  flatPitch() {
    for (let i = 0; i < this.stepsSampler.length; i++) {
      this.stepsSampler[i].sampleTune = this.flatPitchMode;
      this.initJson();
    }
  }
  flatSustain() {
    for (let i = 0; i < this.stepsSampler.length; i++) {
      this.stepsSampler[i].duration = this.flatSustainMode;
      this.initJson();
    }
  }
  flatGain() {
    for (let i = 0; i < this.stepsSampler.length; i++) {
      this.stepsSampler[i].gain = this.flatGainMode;
      this.initJson();
    }
  }
  initJson() {
    this.presetJson = JSON.stringify({ titolo: 'JsonPresetSampler', note: this.stepsSampler });
  }

}
