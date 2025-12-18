import { AvocadoElement } from './avocado-element';
import { PenguinElement } from './penguin-element';

export const elementsFactory = {
  avocado: () => new AvocadoElement(),
  penguin: () => new PenguinElement(),
}