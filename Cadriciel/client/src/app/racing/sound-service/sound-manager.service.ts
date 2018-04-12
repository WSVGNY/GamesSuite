import { Injectable } from "@angular/core";
import { AudioListener, AudioLoader, AudioBuffer, Audio, PerspectiveCamera } from "three";
import { Car } from "../car/car";
import {
    MUSIC_PATH, ACCELERATION_PATH, CAR_COLLISION_PATH, STARTING_PATH, VOLUME, RPM_FACTOR, MUSIC_KEYCODE, WALL_COLLISION_PATH
} from "../constants";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";

@Injectable()
export class SoundManagerService {

    private _music: Audio;
    private _accelerationSound: Audio;
    private _carCollisionSound: Audio;
    private _wallCollisionSound: Audio;
    private _startingSound: Audio;
    private _isPlayingMusic: boolean;
    private _isPlayingCarCollision: boolean;
    private _isPlayingWallCollision: boolean;

    public constructor(private _keyBoardHandler: KeyboardEventHandlerService) {
        this._isPlayingMusic = false;
        this._isPlayingCarCollision = false;
        this._isPlayingWallCollision = false;
    }

    public bindSoundKeys(): void {
        this._keyBoardHandler.bindFunctionToKeyDown(MUSIC_KEYCODE, () => {
            this._isPlayingMusic ?
                this.stop(this.music) :
                this.play(this.music);
            this._isPlayingMusic = !this._isPlayingMusic;
        });
    }

    private createSound(soundPath: string): Audio {
        const listener: AudioListener = new AudioListener();
        const sound: Audio = new Audio(listener);
        const loader: AudioLoader = new AudioLoader();
        loader.load(
            soundPath,
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

    public createAccelerationSound(car: Car): void {
        this._accelerationSound = this.createSound(ACCELERATION_PATH);
        this._accelerationSound.setLoop(true);
        car.add(this._accelerationSound);
    }

    public createCarCollisionSound(car: Car): void {
        this._carCollisionSound = this.createSound(CAR_COLLISION_PATH);
        this._carCollisionSound.onEnded = () => {
            this._carCollisionSound.stop();
            this._isPlayingCarCollision = false;
        };
        car.add(this._carCollisionSound);
    }

    public createWallCollisionSound(car: Car): void {
        this._wallCollisionSound = this.createSound(WALL_COLLISION_PATH);
        this._wallCollisionSound.onEnded = () => {
            this._wallCollisionSound.stop();
            this._isPlayingWallCollision = false;
        };
        car.add(this._wallCollisionSound);
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
        return this._accelerationSound;
    }

    public get startingSound(): Audio {
        return this._startingSound;
    }

    public get collisionSound(): Audio {
        return this._carCollisionSound;
    }

    public playCarCollision(): void {
        if (!this._isPlayingCarCollision) {
            this._carCollisionSound.play();
            this._isPlayingCarCollision = true;
        }
    }

    public playWallCollision(): void {
        if (!this._isPlayingWallCollision) {
            this._wallCollisionSound.play();
            this._isPlayingWallCollision = true;
        }
    }

    public setAccelerationSound(car: Car): void {
        this._accelerationSound.setVolume(VOLUME * 2);
        this._accelerationSound.setPlaybackRate(this.calculateRate(car));
    }

    private calculateRate(car: Car): number {
        return Math.max(1, car.rpm / RPM_FACTOR);
    }
}
