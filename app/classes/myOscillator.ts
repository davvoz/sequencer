import { AudioContext } from 'angular-audio-context';
import { TBiquadFilterType, IOscillatorNode, TOscillatorType } from 'standardized-audio-context';

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
        filterType: string,
        audioContextTime: number
    ): void {
        if (play) {
            let oscillator = this._audioContext.createOscillator();
            let gainNode = this._audioContext.createGain();
            let biquadFilter = this._audioContext.createBiquadFilter();
            gainNode.gain.setTargetAtTime(gain, audioContextTime, 0);
            oscillator.frequency.setTargetAtTime(frequency, audioContextTime, detune);
            oscillator.type = waveform as TOscillatorType;
            if (isFiltred) {
                biquadFilter.type = filterType as TBiquadFilterType;
                biquadFilter.frequency.setTargetAtTime(filterFrequency, audioContextTime, 0);
                biquadFilter.gain.setTargetAtTime(filterGain, audioContextTime, 0);
                oscillator.start(audioContextTime);
                oscillator.connect(biquadFilter);
                biquadFilter.connect(gainNode);
            } else {
                oscillator.start(audioContextTime);
                oscillator.connect(gainNode);
            }
            gainNode.connect(this._audioContext.destination);
            oscillator.stop(audioContextTime + sustain / 500);
            oscillator = null;
            gainNode = null;
            biquadFilter = null;


        }

    }
}
