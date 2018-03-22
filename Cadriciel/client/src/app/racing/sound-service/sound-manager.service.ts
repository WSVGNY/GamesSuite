import { Injectable } from "@angular/core";
import { AudioListener, AudioLoader, AudioBuffer, Audio, PerspectiveCamera } from "three";
import { Car } from "../car/car";
import { MUSIC_PATH, ACCELERATION_PATH, COLLISION_PATH, STARTING_PATH } from "../constants";

@Injectable()
export class SoundManagerService {

  public constructor() { }

  private _music: Audio;
  private _accelerationSoundEffect: Audio;
  private _isPlayingAcceleration: boolean = true;
  private _isDetected: boolean = true;
  private _isPlayingMusic: boolean = true;
  private _collisionSound: Audio;

  private createSound(soundName: string): Audio {
    const listener: AudioListener = new AudioListener();
    const sound: Audio = new Audio(listener); // Maybe positionnal audio
    const loader: AudioLoader = new AudioLoader();
    loader.load(
      soundName,
      (audioBuffer: AudioBuffer) => {
        sound.setBuffer(audioBuffer);
        sound.stop();
      },
      (xhr: XMLHttpRequest) => { },
      (err: Event) => { }
    );

    return sound;
  }

  public createMusic( car: Car): void {
    const music: Audio = this.createSound(MUSIC_PATH);
    car.add(music);
    this._music = music;
    this._isPlayingMusic = false;
  }

  public createAccelerationEffect( car: Car): void {
    const soundEffect: Audio = this.createSound(ACCELERATION_PATH);
    car.add(soundEffect);
    this._accelerationSoundEffect = soundEffect;
    this._isPlayingAcceleration = false;
  }

  public createCollisionSound( camera: PerspectiveCamera, car: Car): void {
    const sound: Audio = this.createSound(COLLISION_PATH);
    car.add(sound);
    camera.add(sound);
    this._isDetected = false;
    this._collisionSound = sound;
  }

  public createStartingSound(camera: PerspectiveCamera): void {
    camera.add(this.createSound(STARTING_PATH));
  }

  public play (sound: Audio): void {
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

  public get collisionSound(): Audio {
    return this._collisionSound;
  }
  public isPlaying(): boolean { return this._isPlayingAcceleration; }
  public isDetected(): boolean { return this._isDetected; }
  public isPlayingMusic(): boolean { return this._isPlayingMusic; }
}
