import { tweens } from '../tweens';

const STATE = {
  game: 0,
  win: 1,
  lose: 2,
};

class SqHelper {
  constructor() {
    this.state = STATE.game
    this.onWin = new signals.Signal()
    this.onLose = new signals.Signal()
  }

  levelWin() {
    if (this.isLevelComplete()) {
      return
    }

    this.state = STATE.win
    GM.trigger.end(true)

    this.onWin.dispatch()
  }

  levelLose() {
    if (this.isLevelComplete()) {
      return
    }

    this.state = STATE.lose;
    GM.trigger.end(false);

    this.onLose.dispatch()    
  }

  convert() {
    GM.trigger.convert()
  }

  convertDelay(delay = 1000, callback = () => {}) {
    tweens.timeout(delay, () => {
      callback()
      GM.trigger.convert()
    })
  }

  // levelSQ() {
  //   if (this.isLevelComplete()) {
  //     return
  //   }
  // }

  isLevelComplete() {
    return this.state !== STATE.game
  }
}

export const sqHelper = new SqHelper()