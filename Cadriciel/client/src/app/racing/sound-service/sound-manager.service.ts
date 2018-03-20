import { Injectable } from "@angular/core";
import { AudioListener, AudioLoader, AudioBuffer, Audio, PerspectiveCamera } from "three";
import { Car } from "../car/car";

@Injectable()
export class SoundManagerService {

  public constructor() { }

  private _music: Audio;
  private _soundEffect: Audio;
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
        sound.play();
      },
      (xhr: XMLHttpRequest) => { },
      (err: Event) => { }
    );

    return sound;
  }

  public createMusic( car: Car): void {
    const music: Audio = this.createSound("../../assets/sounds/rainbowRoad.mp3");
    car.add(music);
    this._music = music;
    this._isPlayingMusic = false;
  }

  public createAccelerationEffect( car: Car): void {
    const soundEffect: Audio = this.createSound("../../assets/sounds/carAcceleration.mp3");
    car.add(soundEffect);
    this._soundEffect = soundEffect;
    this._isPlayingAcceleration = false;
  }

  public createCollisionSound( camera: PerspectiveCamera, car: Car): void {
    const sound: Audio = this.createSound("../../assets/sounds/collision-sound.mp3");
    car.add(sound);
    camera.add(sound);
    this._isDetected = false;
    this._collisionSound = sound;
  }

  public createStartingSound(camera: PerspectiveCamera): void {
    camera.add(this.createSound("../../assets/sounds/startingSound.mp3"));
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
    return this._soundEffect;
  }

  public get collisionSound(): Audio {
    return this._collisionSound;
  }
  public isPlaying(): boolean { return this._isPlayingAcceleration; }
  public isDetected(): boolean { return this._isDetected; }
  public isPlayingMusic(): boolean { return this._isPlayingMusic; }
}
