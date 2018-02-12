import { AudioContext } from 'angular-audio-context';
import { SamplesLibraryService } from '../services/samplesLibraryService';

export class MySampler {

    constructor(private _audioContext: AudioContext, private library: SamplesLibraryService) {

    }
    play(
        volume: number,
        tune: number,
        libIndex: number,
        playing: boolean,
        duration: number,
        filterFrequency: number,
        filterGain: number,
        filterType: string,
        isFiltred: boolean

    ): void {
        const gainNode = this._audioContext.createGain();
        const biquadFilter = this._audioContext.createBiquadFilter();
        const source = this._audioContext.createBufferSource();
        source.buffer = this.library.buffers[libIndex];
        source.playbackRate.setTargetAtTime(tune, this._audioContext.currentTime, 0) ;
        gainNode.gain.setTargetAtTime(volume, this._audioContext.currentTime, 0);
        if (playing) {
            if (isFiltred) {
                switch (filterType) {
                    case 'allpass': biquadFilter.type = 'allpass';
                        break;
                    case 'highpass': biquadFilter.type = 'highpass';
                        break;
                    case 'highshelf': biquadFilter.type = 'highshelf';
                        break;
                    case 'lowpass': biquadFilter.type = 'lowpass';
                        break;
                    case 'lowshelf': biquadFilter.type = 'lowshelf';
                        break;
                    case 'notch': biquadFilter.type = 'notch';
                        break;
                    case 'peaking': biquadFilter.type = 'peaking';
                        break;
                }
                biquadFilter.frequency.setTargetAtTime(filterFrequency, this._audioContext.currentTime, 0);
                biquadFilter.gain.setTargetAtTime(filterGain, this._audioContext.currentTime, 0);
                source.start(0);
                source.connect(biquadFilter);
                biquadFilter.connect(gainNode);
            } else {
                source.start(0);
                source.connect(gainNode);
            }
            gainNode.connect(this._audioContext.destination);
            source.stop(this._audioContext.currentTime + duration);
        }
    }

}
