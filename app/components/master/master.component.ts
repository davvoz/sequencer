import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { TimerService } from '../../services/timerService';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Track, TOStepSequencerComponentType } from '../../interfaces/interfaces';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { StepperOscillatorComponent } from '../stepper-oscillator/stepper-oscillator.component';
import { StepperSamplerComponent } from '../stepper-sampler/stepper-sampler.component';
export interface TrackStyle {
  display: string;
  background: string;
}
@Injectable()
@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {
  @ViewChild('stepSequencer') stepper: StepperSamplerComponent;
  trackModel: Track = { track: this.stepper, tipo: 'oscillator' };
  isStarted = false;
  speed = 106;
  tracks = [];
  muteOnOffArray = [];
  selectTrackArray = [];
  trackStyle: TrackStyle[] = [];
  selectedTrack = 0;
  unselectedBorder = '3px solid black';
  selectedBorder = '3px solid orangered';
  public isPlayed: boolean;
  private timer;
  private step: boolean;
  public steps: number;
  mutedChannels = [];
  maxStepModel ;
  triggers = [false, false, false];
  constructor(public timerService: TimerService) {
    this.timerService.speed = this.speed;
    this.isPlayed = false;
    this.step = false;
    this.steps = 0;
  }
  trigger(index: number) {
    switch (index) {
      case 0: this.timerService.maxStep = 0;
        break;
      case 1: this.timerService.maxStep = 1;
        break;
      case 2: this.timerService.maxStep = 2;
        break;
    }


  }
  muteTrack(index: number) {
    this.muteOnOffArray[index] ?
      (this.muteOnOffArray[index] = false, this.trackStyle[index].background = 'red') :
      (this.muteOnOffArray[index] = true, this.trackStyle[index].background = 'yellowgreen');
    this.timerService.muteTrack(index, this.muteOnOffArray[index]);
  }
  start() {
    !this.isStarted ?
      (this.isStarted = true, this.timerService.play()) :
      (this.isStarted = false, this.timerService.stop());
  }
  addTrack(tipo: string) {
    switch (tipo) {
      case 'oscillator': this.tracks[this.tracks.length] = { track: this.stepper, tipo: tipo };
        break;
      case 'sampler': this.tracks[this.tracks.length] = { track: this.stepper, tipo: tipo };
        break;
    }
    this.trackStyle.push({ background: 'yellowgreen', display: 'block' });
    this.selectTrackArray.push(this.selectTrackArray.length);
    this.muteOnOffArray.push(true);
    this.viewTrack(this.trackStyle.length - 1);
    this.timerService.addTrack();
    this.timerService.muteTrack(this.tracks.length - 1, true);
  }
  viewTrack(displayedTrackIndex: number) {
    this.selectedTrack = displayedTrackIndex;

    for (let i = 0; i < this.trackStyle.length; i++) {
      displayedTrackIndex === i ? this.trackStyle[i].display = 'block' : this.trackStyle[i].display = 'none';
    }
  }
  // removeTrack(index: number) {
  //   this.tracks.splice(index, 1);
  //   this.muteOnOffArray.splice(index, 1);
  //   this.timerService.removeTrack(index);
  // }
  ngOnInit() {
    this.maxStepModel = this.timerService.maxStep ;
  }

}
