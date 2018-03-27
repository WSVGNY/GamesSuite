import { Injectable } from "@angular/core";
import { AudioListener, AudioLoader, AudioBuffer, Audio, PerspectiveCamera } from "three";
import { Car } from "../car/car";
import {
    MUSIC_PATH, ACCELERATION_PATH, COLLISION_PATH, STARTING_PATH, VOLUME,
    RPM_FACTOR, PLAY_MUSIC_KEYCODE, MUTE_KEYCODE, ACCELERATE_KEYCODE } from "../constants";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";

@Injectable()
export class SoundManagerService {

    private _music: Audio;
    private _accelerationSoundEffect: Audio;
    private _isPlayingAcceleration: boolean = false;
    private _isPlayingMusic: boolean = false;
    private _collisionSound: Audio;
    private _startingSound: Audio;

    public constructor(private _keyBoardHandler: KeyboardEventHandlerService) {}

    public bindSoundKeys(): void {
        this._keyBoardHandler.bindFunctionToKeyDown(PLAY_MUSIC_KEYCODE, () =>
            this.play(this.music));
        this._keyBoardHandler.bindFunctionToKeyDown(MUTE_KEYCODE, () => this.stop(this.music));
        this._keyBoardHandler.bindFunctionToKeyDown(ACCELERATE_KEYCODE, () => {
            if (!this.isAccelerating()) {
                this.play(this.accelerationSoundEffect);
                this.setAccelerating(true);
            }
        });
    }

    private createSound(soundName: string): Audio {
        const listener: AudioListener = new AudioListener();
        const sound: Audio = new Audio(listener);
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
        this._music = this.createSound(MUSIC_PATH);
        this._music.setVolume(VOLUME);
        this._music.setLoop(true);
        car.add(this._music);
        this._isPlayingMusic = false;
    }

    public createAccelerationEffect(car: Car): void {
        this._accelerationSoundEffect = this.createSound(ACCELERATION_PATH);
        car.add(this._accelerationSoundEffect);
        this._accelerationSoundEffect.setLoop(true);
        this._isPlayingAcceleration = false;
    }

    public createCollisionSound(car: Car): void {
        this._collisionSound = this.createSound(COLLISION_PATH);
        car.add(this._collisionSound);
    }

    public createStartingSound(camera: PerspectiveCamera): void {
        this._startingSound = this.createSound(STARTING_PATH);
        this._startingSound.setVolume(VOLUME);
        camera.add(this._startingSound);
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

    public isAccelerating(): boolean { return this._isPlayingAcceleration; }
    public setAccelerating(value: boolean): void { this._isPlayingAcceleration = value; }
    public isPlayingMusic(): boolean { return this._isPlayingMusic; }

    public setAccelerationSound(car: Car): void {
        this._accelerationSoundEffect.setVolume(VOLUME * 2);
        this._accelerationSoundEffect.setPlaybackRate(this.calculateRate(car));
    }

    private calculateRate(car: Car): number {
        return Math.max(1, car.rpm / RPM_FACTOR);
    }
}
