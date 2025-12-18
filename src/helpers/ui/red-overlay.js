import { factory } from '../pixi/pixi-factory'
import { tweens } from '../tweens'

export class RedOverlay {
  constructor() {
    this.sprite = factory.sprite('overlay-red')
    this.sprite.visible = false
    // this.sprite.alpha = 0.5
    this.group = factory.group([this.sprite])

    this.alpha = this.sprite.alpha
    this.blinkTime = 500
    this.blinkDelay = 0
  }

  init(data = {}) {
    const { time = 500, delay = 0, alpha = 1} = data
    this.blinkTime = time
    this.blinkDelay = delay
    this.alpha = alpha
  }

  animate() {
    if (this.tween) {
      return
    }

    this.sprite.visible = true 
    this.sprite.alpha = this.alpha

    this.tween = tweens.fadeOut(this.sprite, this.blinkTime, { delay: this.blinkDelay })
    this.tween.onComplete(() => {
      this.sprite.visible = false
      this.tween = null
    })
  }
}


