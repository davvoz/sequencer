import { AudioContext } from 'angular-audio-context';
import { SamplesLibraryService } from '../services/samplesLibraryService';
import { TBiquadFilterType } from 'standardized-audio-context';

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
        isFiltred: boolean,
        audioContextTime: number

    ): void {
        let gainNode = this._audioContext.createGain();
        let biquadFilter = this._audioContext.createBiquadFilter();
        let source = this._audioContext.createBufferSource();
        source.buffer = this.library.buffers[libIndex];
        source.playbackRate.setTargetAtTime(tune, audioContextTime, 0);
        gainNode.gain.setTargetAtTime(volume, audioContextTime, 0);
        if (playing) {
            if (isFiltred) {
                biquadFilter.type = filterType as TBiquadFilterType;
                biquadFilter.frequency.setTargetAtTime(filterFrequency, audioContextTime, 0);
                biquadFilter.gain.setTargetAtTime(filterGain, audioContextTime, 0);
                source.start(audioContextTime);
                source.connect(biquadFilter);
                biquadFilter.connect(gainNode);
            } else {
                source.start(audioContextTime);
                source.connect(gainNode);
            }
            gainNode.connect(this._audioContext.destination);
            source.stop(audioContextTime + duration);          
        }
        gainNode = null;
        biquadFilter = null;
        source = null;
    }

}
