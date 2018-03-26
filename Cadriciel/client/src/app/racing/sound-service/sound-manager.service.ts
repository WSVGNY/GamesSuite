import { Injectable } from "@angular/core";
import { AudioListener, AudioLoader, AudioBuffer, Audio, PerspectiveCamera } from "three";
import { Car } from "../car/car";
import { MUSIC_PATH, ACCELERATION_PATH, COLLISION_PATH, STARTING_PATH, VOLUME, RPM_FACTOR } from "../constants";

@Injectable()
export class SoundManagerService {

    public constructor() { }

    private _music: Audio;
    private _accelerationSoundEffect: Audio;
    private _isPlayingAcceleration: boolean = true;
    private _isDetected: boolean = true;
    private _isPlayingMusic: boolean = true;
    private _collisionSound: Audio;
    private _startingSound: Audio;

    private createSound(soundName: string): Audio {
        const listener: AudioListener = new AudioListener();
        const sound: Audio = new Audio(listener); // Maybe positionnal audio
        const loader: AudioLoader = new AudioLoader();
        loader.load(
            soundName,
            (audioBuffer: AudioBuffer) => {
                sound.setBuffer(audioBuffer);
            },
            (xhr: XMLHttpRequest) => { },
            (err: Event) => { }
        );

        return sound;
    }

    public createMusic(car: Car): void {
        const music: Audio = this.createSound(MUSIC_PATH);
        music.setVolume(VOLUME);
        music.setLoop(true);
        car.add(music);
        this._music = music;
        this._isPlayingMusic = false;
    }

    public createAccelerationEffect(car: Car): void {
        const soundEffect: Audio = this.createSound(ACCELERATION_PATH);
        car.add(soundEffect);
        soundEffect.setLoop(true);
        this._accelerationSoundEffect = soundEffect;
        this._isPlayingAcceleration = false;
    }

    public createCollisionSound(car: Car): void {
        const sound: Audio = this.createSound(COLLISION_PATH);
        car.add(sound);
        this._isDetected = false;
        this._collisionSound = sound;
    }

    public createStartingSound(camera: PerspectiveCamera): void {
        const startSound: Audio = this.createSound(STARTING_PATH);
        startSound.setVolume(VOLUME);
        camera.add(startSound);
        this._startingSound = startSound;
    }

    public play(sound: Audio): void {
        sound.play();
    }

    public stop(sound: Audio): void {
        sound.stop();
    }

    public get music(): Audio {
        return this._music;
    }

    public get accelerationSoundEffect(): Audio {
        return this._accelerationSoundEffect;
    }

    public get startingSound(): Audio {
        return this._startingSound;
    }
    public get collisionSound(): Audio {
        return this._collisionSound;
    }
    public isPlaying(): boolean { return this._isPlayingAcceleration; }
    public isDetected(): boolean { return this._isDetected; }
    public isPlayingMusic(): boolean { return this._isPlayingMusic; }

    public setAccelerationSound(car: Car): void {
        this._accelerationSoundEffect.setVolume(VOLUME * 2);
        this._accelerationSoundEffect.setPlaybackRate(this.calculateRate(car));
    }

    private calculateRate(car: Car): number {
        return Math.max(1, car.rpm / RPM_FACTOR);
    }
}
