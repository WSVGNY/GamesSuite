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

    public constructor(private _keyBoardHandler: KeyboardEventHandlerService) {
        this._startSequenceIndex = 0;
        this._startingSound = [];
    }

    public bindSoundKeys(): void {
        this._keyBoardHandler.bindFunctionToKeyDown(MUSIC_KEYCODE, () => {
            this._music.isPlaying ?
                this._music.stop() :
                this._music.play();
        });
    }

    public stopAllSounds(): void {
        if (this._music.isPlaying) { this._music.stop(); }
        if (this._accelerationSound.isPlaying) { this._accelerationSound.stop(); }
        if (this._carCollisionSound.isPlaying) { this._carCollisionSound.stop(); }
        if (this._wallCollisionSound.isPlaying) { this._wallCollisionSound.stop(); }
        this._startingSound.forEach((sound: Audio) => { if (sound.isPlaying) { sound.stop(); } });
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
        };
        car.add(this._carCollisionSound);
    }

    public async createWallCollisionSound(car: AbstractCar): Promise<void> {
        await this.createSound(WALL_COLLISION_PATH).then((sound: Audio) => this._wallCollisionSound = sound);
        this._wallCollisionSound.onEnded = () => {
            this._wallCollisionSound.stop();
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
        if (!this._carCollisionSound.isPlaying) {
            this._carCollisionSound.play();
        }
    }

    public playWallCollision(): void {
        if (!this._wallCollisionSound.isPlaying) {
            this._wallCollisionSound.play();
        }
    }

    public setAccelerationSound(car: AbstractCar): void {
        this._accelerationSound.setVolume(VOLUME * 2);
        this._accelerationSound.setPlaybackRate(this.calculateRate(car));
    }

    public playAccelerationSound(): void {
        this._accelerationSound.play();
    }

    private calculateRate(car: AbstractCar): number {
        return Math.max(1, car.rpm / RPM_FACTOR);
    }
}
