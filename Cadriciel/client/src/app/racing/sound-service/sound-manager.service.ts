import { Injectable } from "@angular/core";
import { AudioListener, AudioLoader, AudioBuffer, Audio } from "three";
import { AbstractCar } from "../car/abstractCar";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { MUSIC_KEYCODE } from "../constants/keycode.constants";
import {
    MUSIC_PATH, VOLUME, ACCELERATION_PATH, CAR_COLLISION_PATH, WALL_COLLISION_PATH, START_SOUND_3_PATH, START_SOUND_2_PATH,
    START_SOUND_1_PATH, START_SOUND_GO_PATH
} from "../constants/sound.constants";
import { RPM_FACTOR } from "../constants/car.constants";

const START_SEQUENCE_LENGTH: number = 4;

@Injectable()
export class SoundManagerService {

    private _music: Audio;
    private _accelerationSound: Audio;
    private _carCollisionSound: Audio;
    private _wallCollisionSound: Audio;
    private _startingSound: Audio[];
    private _startSequenceIndex: number;
    private _isPlayingMusic: boolean;
    private _isPlayingCarCollision: boolean;
    private _isPlayingWallCollision: boolean;

    public constructor(private _keyBoardHandler: KeyboardEventHandlerService) {
        this._isPlayingMusic = false;
        this._isPlayingCarCollision = false;
        this._isPlayingWallCollision = false;
        this._startSequenceIndex = 0;
        this._startingSound = [];
    }

    public bindSoundKeys(): void {
        this._keyBoardHandler.bindFunctionToKeyDown(MUSIC_KEYCODE, () => {
            this._isPlayingMusic ?
                this._music.stop() :
                this._music.play();
            this._isPlayingMusic = !this._isPlayingMusic;
        });
    }

    private async createSound(soundPath: string): Promise<Audio> {
        const listener: AudioListener = new AudioListener();
        const sound: Audio = new Audio(listener);
        const loader: AudioLoader = new AudioLoader();

        return new Promise<Audio>((resolve, reject) => loader.load(
            soundPath,
            (audioBuffer: AudioBuffer) => {
                sound.setBuffer(audioBuffer);
                resolve(sound);
            },
            (xhr: XMLHttpRequest) => { },
            (err: Event) => reject()
        ));
    }

    public async createMusic(car: AbstractCar): Promise<void> {
        await this.createSound(MUSIC_PATH).then((sound: Audio) => this._music = sound);
        this._music.setVolume(VOLUME);
        this._music.setLoop(true);
        car.add(this._music);
        this._isPlayingMusic = false;
    }

    public async createAccelerationSound(car: AbstractCar): Promise<void> {
        await this.createSound(ACCELERATION_PATH).then((sound: Audio) => this._accelerationSound = sound);
        this._accelerationSound.setLoop(true);
        car.add(this._accelerationSound);
    }

    public async createCarCollisionSound(car: AbstractCar): Promise<void> {
        await this.createSound(CAR_COLLISION_PATH).then((sound: Audio) => this._carCollisionSound = sound);
        this._carCollisionSound.onEnded = () => {
            this._carCollisionSound.stop();
            this._isPlayingCarCollision = false;
        };
        car.add(this._carCollisionSound);
    }

    public async createWallCollisionSound(car: AbstractCar): Promise<void> {
        await this.createSound(WALL_COLLISION_PATH).then((sound: Audio) => this._wallCollisionSound = sound);
        this._wallCollisionSound.onEnded = () => {
            this._wallCollisionSound.stop();
            this._isPlayingWallCollision = false;
        };
        car.add(this._wallCollisionSound);
    }

    public async createStartingSound(car: AbstractCar): Promise<void> {
        await this.createSound(START_SOUND_3_PATH).then((sound: Audio) => this._startingSound.push(sound));
        await this.createSound(START_SOUND_2_PATH).then((sound: Audio) => this._startingSound.push(sound));
        await this.createSound(START_SOUND_1_PATH).then((sound: Audio) => this._startingSound.push(sound));
        await this.createSound(START_SOUND_GO_PATH).then((sound: Audio) => this._startingSound.push(sound));
        for (let i: number = 0; i < START_SEQUENCE_LENGTH; i++) {
            car.add(this._startingSound[i]);
        }
    }

    public get accelerationSoundEffect(): Audio {
        return this._accelerationSound;
    }

    public playCurrentStartSequenceSound(): void {
        this._startingSound[this._startSequenceIndex++].play();
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

    public setAccelerationSound(car: AbstractCar): void {
        this._accelerationSound.setVolume(VOLUME * 2);
        this._accelerationSound.setPlaybackRate(this.calculateRate(car));
    }

    private calculateRate(car: AbstractCar): number {
        return Math.max(1, car.rpm / RPM_FACTOR);
    }
}
