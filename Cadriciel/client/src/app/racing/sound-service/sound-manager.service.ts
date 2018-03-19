import { Injectable } from "@angular/core";
import { AudioListener, AudioLoader, AudioBuffer, Audio, PerspectiveCamera } from "three";
import { Car } from "../car/car";

@Injectable()
export class SoundManagerService {

  public constructor() { }

  private _music: Audio;
  private _soundEffect: Audio;
  private _isPlaying: boolean = true;
  private _isDetected: boolean = true;
  private _isPlayingMusic: boolean = true;
  private _collisionSound: Audio;

  public createMusic(soundName: string, car: Car): void {
    const listener: AudioListener = new AudioListener();
    const music: Audio = new Audio(listener); // Maybe positionnal audio
    const loader: AudioLoader = new AudioLoader();
    loader.load(
      soundName,
      (audioBuffer: AudioBuffer) => {
        music.setBuffer(audioBuffer);
        music.play();
      },
      (xhr: XMLHttpRequest) => { },
      (err: Event) => { }
    );
    car.add(music);
    this._music = music;
    this._isPlayingMusic = false;
    /*for (let i: number = 0; i < RaceGameConfig.AI_CARS_NUMBER; ++i) { // Pour ajouter aux IA
        this._aiCars[i].add(sound);
    }*/
  }

  public createAccelerationEffect(effectName: string, car: Car): void {
    const listener: AudioListener = new AudioListener();
    const soundEffect: Audio = new Audio(listener); // Maybe positionnal audio
    const loader: AudioLoader = new AudioLoader();
    loader.load(
      effectName,
      (audioBuffer: AudioBuffer) => {
        soundEffect.setBuffer(audioBuffer);
        soundEffect.play();
      },
      (xhr: XMLHttpRequest) => { },
      (err: Event) => { }
    );
    car.add(soundEffect);
    this._soundEffect = soundEffect;
    this._isPlaying = false;
  }

  public createCollisionSound(soundName: string, camera: PerspectiveCamera, car: Car): void {
    const listener: AudioListener = new AudioListener();
    camera.add(listener);
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
    car.add(sound);
    camera.add(sound);
    this._isDetected = false;
    this._collisionSound = sound;
    /*for (let i: number = 0; i < RaceGameConfig.AI_CARS_NUMBER; ++i) { // Pour ajouter aux IA
        this._aiCars[i].add(sound);
    }*/
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
  public isPlaying(): boolean { return this._isPlaying; }
  public isDetected(): boolean { return this._isDetected; }
  public isPlayingMusic(): boolean { return this._isPlayingMusic; }
}
