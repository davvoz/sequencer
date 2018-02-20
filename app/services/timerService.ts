import { Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TickResponse } from '../interfaces/interfaces';
import * as workerTimers from 'worker-timers'; // 30+% cpu cheaper
import { AudioContext } from 'angular-audio-context';
@Injectable()
export class TimerService {
    numberOfTraks = 0;
    maxStep = 31;
    startTime = 0;
    noteTime = 0;
    timeoutId;
    tic = 0;
    private firstStep = false;
    public speed: number;
    public isPlayed: boolean;
    private timer;
    private step: boolean;
    public steps: number;
    private numberOfTraksSource = new BehaviorSubject<number>(0);
    private trackStateModel: TickResponse = { traksAreOn: [], timePosition: 0, isStarted: true, audioContextTime: 0 };
    private trackStateSource = new BehaviorSubject<TickResponse>(this.trackStateModel);
    trackStateItem$ = this.trackStateSource.asObservable();
    public audioContext: AudioContext;
    constructor() {

        this.audioContext = new AudioContext();
        this.startTime = this.audioContext.currentTime + 0.005;
        this.isPlayed = false;
        this.step = false;
        this.steps = 0;
        this.speed = 1;
    }
    addTrack() {
        this.numberOfTraks++;
    }
    muteTrack(index: number, state: boolean) {
        this.trackStateModel.traksAreOn[index] = state;
    }
    removeTrack(index: number) {
        this.numberOfTraks--;
        this.numberOfTraksSource.next(index);
        //  this.trackStateSource.next({ soundOn: this.trackStateModel.soundOn, trackIndex: this.steps })
    }
    play() {

        this.isPlayed = true;
        this.audioContext.resume();
        this.scheduleNote();
    }
    stop() {
        this.isPlayed = false;
        clearTimeout(this.timer);
    }

    private scheduleNote() {
        let contextPlayTime;
        let currentTime = this.audioContext.currentTime;
        currentTime -= this.startTime;
        while (this.noteTime < currentTime + 0.200) {
            contextPlayTime = this.noteTime + this.startTime;
            this.changeStateTrack(contextPlayTime);
            this.nextNote();
        }
        this.timer = setTimeout(this.scheduleNote.bind(this), 0);
        // this.timeoutId = requestAnimationFrame(this.scheduleNote);
    }
    private nextNote() {
        let secondsPerBeat = 60.0 / this.speed;
        // 0.25 because each square is a 16th note
        this.noteTime += 0.25 * secondsPerBeat;
        secondsPerBeat = null;
    }
    private changeStateTrack(pt) {
        this.trackStateSource.next({
            traksAreOn: this.trackStateModel.traksAreOn,
            timePosition: this.steps,
            isStarted: true,
            audioContextTime: pt
        });
        this.steps >= this.maxStep ? (this.step = true, this.steps = 0) : (this.step = true, this.steps++);
    }


}
