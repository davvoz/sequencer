import { Component, Output, ViewChild } from '@angular/core';
import { EventEmitter } from 'events';
import { TimerService } from '../app/services/timerService';
import { MasterComponent } from '../app/components/master/master.component';
import { SamplesLibraryService } from './services/samplesLibraryService';
import { AudioContext } from 'angular-audio-context';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Izi Loops';
  samplesLibrary: SamplesLibraryService;
  constructor(private _audioContext: AudioContext) {
    this.samplesLibrary = new SamplesLibraryService(_audioContext);
   }
}
