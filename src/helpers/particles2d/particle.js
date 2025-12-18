import { factory } from '../pixi/pixi-factory'
import { tweens } from '../tweens'

export class Particle {
  constructor(props) {
    const { alpha, angle, gravity, scale, lifetime, position } = props

    this.props = props

    this.sprite = factory.sprite(props.key)
    this.sprite.position.set(position.x || 0, position.y || 0)
    this.sprite.scale.set(scale, scale)
    this.sprite.visible = false
    this.sprite.alpha = alpha
    this.sprite.angle = angle

    this.gravity = gravity
    this.velocityX = props.velocity.x
    this.velocityY = props.velocity.y
    this.accelerationX = props.acceleration.x
    this.accelerationY = props.acceleration.y
    this.angularVelocity = props.angularVelocity
    
    this.lifetime = lifetime
    this.scale = scale
    this.startTime = 0
    
    this.isActive = false
    this.isKilled = false
    this.isFromCenter = (position.x === 0 && position.y === 0)
  }

  init() {
    
  }

  reset(position, key) {
    this.startTime = performance.now()
    
    this.velocityX = this.props.velocity.x
    this.velocityY = this.props.velocity.y

    this.sprite.alpha = this.props.alpha
    this.sprite.visible = true
    this.sprite.scale.set(this.props.scale, this.props.scale)
    
    this.isActive = true
    this.isKilled = false

    if (position) {
      this.sprite.position.set(position.x, position.y)
    } else {
      this.sprite.position.set(this.props.position.x, this.props.position.y) 
    }

    if (key) {
      this.sprite.loadTexture(key)
    }
  }

  restart(x, y) {
    this.sprite.x = x
    this.sprite.y = y

    // wtf is this
    this.sprite.angle = this.props.angularVelocity ? Math.random() * 30 - 15 : 0

    this.velocityX = this.props.velocity.x
    this.velocityY = this.props.velocity.y
    this.gravity = this.props.gravity
  }

  show(useTween) {
    if (useTween) {
      tweens.fadeIn(this.sprite, 200)
    } else {
      this.sprite.alpha = 1
    }
  }

  update() {
    if (!this.isActive) {
      return
    }

    this.velocityX += this.accelerationX
    this.velocityY += this.accelerationY
    this.velocityY += this.gravity
    this.sprite.x += this.velocityX
    this.sprite.y += this.velocityY

    if (this.angularVelocity) {
      this.sprite.angle += this.angularVelocity
    }

    if (this.lifetime !== -1) {
      if (!this.isKilled && performance.now() - this.startTime > this.lifetime) {
        this.kill()
      }
    } else {
      if (this.sprite.y < -480 - this.sprite.height && this.velocityY < 0) {
        this.restart(Math.random() * 960 - 480, 480 + this.sprite.height)
      }
  
      if (this.sprite.y > 480 + this.sprite.height && this.velocityY > 0) {
        this.restart(Math.random() * 960 - 480, -480 - this.sprite.height)
      }
  
      if (this.isFromCenter) {
        // out to the left or right side
        if (this.sprite.x > 520 || this.sprite.x < -520) {
          // this.restart(0, 0)
          this.restart(Math.random() * 10 - 5, Math.random() * 10 - 5)
        }

        // out to the top or bottom side
        if (this.sprite.y > 520 || this.sprite.y < -520) {
          // this.restart(0, 0)
          this.restart(Math.random() * 10 - 5, Math.random() * 10 - 5)
        }
      }
    }
  }

  kill(useTween = true) {
    if (this.tween && useTween) {
      return
    }

    this.isKilled = true

    if (useTween) {
      // this.tween = tweens.scale(this.sprite, 0, 200, { easing: 'linear' })
      this.tween = tweens.fadeOut(this.sprite, 200)
      this.tween.onComplete(() => {
        this.isActive = false
        this.tween = null
        this.sprite.visible = false
      })
    } else {
      this.isActive = false
    }
  }
}