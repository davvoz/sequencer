import { AudioContext } from 'angular-audio-context';
import { TBiquadFilterType } from 'standardized-audio-context';
import { MyFilter } from './myFilter';

export class MyOscillator {

    constructor(private _audioContext: AudioContext) {

    }
    play(
        frequency: number,
        sustain: number,
        detune: number,
        waveform: string,
        gain: number,
        play: boolean,
        isFiltred: boolean,
        filterGain: number,
        filterFrequency: number,
        filterType: string

    ): void {
        if (play) {
            const oscillator = this._audioContext.createOscillator();
            const gainNode = this._audioContext.createGain();
            const biquadFilter = this._audioContext.createBiquadFilter();
            switch (waveform) {
                case 'sine': oscillator.type = 'sine';
                    break;
                case 'square': oscillator.type = 'square';
                    break;
                case 'triangle': oscillator.type = 'triangle';
                    break;
                case 'sawtooth': oscillator.type = 'sawtooth';
                    break;
            }
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
                oscillator.frequency.cancelScheduledValues(this._audioContext.currentTime);
                oscillator.frequency.setTargetAtTime(frequency, this._audioContext.currentTime, 0);
                biquadFilter.frequency.setTargetAtTime(filterFrequency, this._audioContext.currentTime, 0);
                biquadFilter.gain.setTargetAtTime(filterFrequency, this._audioContext.currentTime, 0);
                gainNode.gain.setTargetAtTime(gain, this._audioContext.currentTime, 0);
                oscillator.start(this._audioContext.currentTime);
                oscillator.connect(biquadFilter);
                biquadFilter.connect(gainNode);
                gainNode.connect(this._audioContext.destination);
                oscillator.stop(this._audioContext.currentTime + sustain / 500);

            } else {
                
                oscillator.frequency.setTargetAtTime(frequency, this._audioContext.currentTime, detune);
                gainNode.gain.setTargetAtTime(gain, this._audioContext.currentTime, 0);
                oscillator.start(this._audioContext.currentTime);
                oscillator.connect(gainNode);
                gainNode.connect(this._audioContext.destination);
                oscillator.stop(this._audioContext.currentTime + sustain / 500);
            }



        }

    }
}