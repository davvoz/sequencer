import { AudioContext } from 'angular-audio-context';
import { Injectable } from '@angular/core';
@Injectable()
export class SamplesLibraryService {
    public buffers = [];
    constructor(private _audioContext: AudioContext) {
        this.loadSounds('../../assets/WAV/57527__dolfeus__catbeat-hit.wav'); // hit
        this.loadSounds('../../assets/WAV/332364__soneproject__hats1.wav');
        this.loadSounds('../../assets/WAV/clap.wav');
        this.loadSounds('../../assets/WAV/kick.wav');
        this.loadSounds('../../assets/WAV/276575__serylis__nana-vox.wav');
        this.loadSounds('../../assets/WAV/212208__alexthegr81__tapesnare-15.wav');
    }

    private loadSounds(path): void {
        const request = new XMLHttpRequest();
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';
        const context = this._audioContext;
        request.onload = () => {
            context.decodeAudioData(
                request.response,
                buffer => {
                    if (!buffer) {
                        alert('error decoding file data: ' + path);
                        return;
                    }
                    this.buffers.push(buffer);
                    console.log(this.buffers);
                },
                error => {
                    console.error('decodeAudioData error', error);
                }

            );
        };
        request.onerror = () => {
            alert('BufferLoader: XHR error');
        };
        request.send();
    }
}
