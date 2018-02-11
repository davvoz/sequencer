import { Injectable, Output, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TickResponse } from '../interfaces/interfaces';

@Injectable()
export class TimerService {
    numberOfTraks = 0;
    maxStep = 31;
    private firstStep = false;
    public speed: number;
    public isPlayed: boolean;
    private timer;
    private step: boolean;
    public steps: number;
    private numberOfTraksSource = new BehaviorSubject<number>(0);
    private trackStateModel: TickResponse = { traksAreOn: [], timePosition: 0, isStarted: true };
    private trackStateSource = new BehaviorSubject<TickResponse>(this.trackStateModel);
    trackStateItem$ = this.trackStateSource.asObservable();
    constructor() {
        this.isPlayed = false;
        this.step = false;
        this.steps = 0;
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
        this.tick();
    }
    stop() {
        this.isPlayed = false;
        clearTimeout(this.timer);
    }
    private tick() {

        this.trackStateSource.next({
            traksAreOn: this.trackStateModel.traksAreOn,
            timePosition: this.steps,
            isStarted: true
        });     
        this.timer = setTimeout(this.tick.bind(this), this.speed);
        this.steps >=this.maxStep ? (this.step = true, this.steps = 0) : (this.step = true, this.steps++);      
    }
}
