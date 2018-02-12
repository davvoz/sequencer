import { Component, Output, ViewChild } from '@angular/core';
import { EventEmitter } from 'events';
import { TimerService } from '../app/services/timerService';
import { MasterComponent } from '../app/components/master/master.component';
import { SamplesLibraryService } from './services/samplesLibraryService';
import { AudioContext } from 'angular-audio-context';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mano amica is a saw';
  samplesLibrary: SamplesLibraryService;
  patternOsc;
  patternSmp;
  constructor(private _audioContext: AudioContext,private http: HttpClient) {
    this.samplesLibrary = new SamplesLibraryService(_audioContext);
   }
}
