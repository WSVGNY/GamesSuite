import { Injectable } from "@angular/core";
import { AudioListener, AudioLoader, AudioBuffer, Audio, PerspectiveCamera } from "three";
import { Car } from "../car/car";
import { RaceGame } from "../game-loop/raceGame";

@Injectable()
export class SoundManagerService {

  public constructor() { }

  private _music: Audio;
  private _soundEffect: Audio;
  private _isPlaying: boolean = true;

  public createSound(soundName: string, camera: PerspectiveCamera, car: Car): void {
    const listener: AudioListener = new AudioListener();
    camera.add(listener); // On peut soit l ajouter à la caméra ou à la voiture en fonction de ce qu on veut
    const sound: Audio = new Audio(listener); // Maybe positionnal audio
    const loader: AudioLoader = new AudioLoader();

    // load a resource
    loader.load(
      soundName,
      (audioBuffer: AudioBuffer) => {
        sound.setBuffer(audioBuffer);
        sound.play();
      },
      (xhr: XMLHttpRequest) => {},
      (err: Event) => {}
    );
    car.add(sound);
    camera.add(sound);
    this._music = sound;
    /*for (let i: number = 0; i < RaceGameConfig.AI_CARS_NUMBER; ++i) { // Pour ajouter aux IA
        this._aiCars[i].add(sound);
    }*/
  }

  public stopMusic(): void {
    this._music.stop();
  }

  public playMusic(): void {
    this._music.play();
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
      (xhr: XMLHttpRequest) => {},
      (err: Event) => {}
    );
    car.add(soundEffect);
    this._soundEffect = soundEffect;
    this._isPlaying = false;
  }
  public stopAccelerationEffect(): void {
    this._soundEffect.stop();
  }

  public playAccelerationEffect(): void {
    this._soundEffect.play();
  }

  public isPlaying(): boolean { return this._isPlaying; }

}
