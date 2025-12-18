import { utils2d } from '../utils2d'

const rand = (min, max) => utils2d.random(min, max)
const range = ([min, max = min]) => utils2d.random(min, max)
const randomize = (val, k = 0.1) => utils2d.random(val * (1 - k), val * (1 + k))

export class ParticleData {
  constructor(props = {}) {
    const {
      total = 10,
      keys = ['particle'],
      lifetime = 1000,
      velocityX = [0],
      velocityY = [0],
      angularVelocity = [0],
      gravity = [0],
      accelerationX = [0],
      accelerationY = [0],
      rangeX = [0],
      rangeY = [0],
      spreadAngle = [],
      scale = [1],
      alpha = [1],
      angle = [0], // to be done
      showTween = false,
      hideTween = false,
      onCreate = () => {}
    } = props

    this.totalAmount = total
    this.keys = keys
    this.lifetime = lifetime
    this.velocityX = velocityX
    this.velocityY = velocityY
    this.angularVelocity = angularVelocity
    this.gravity = gravity
    this.accelerationX = accelerationX
    this.accelerationY = accelerationY
    this.scale = scale
    this.alpha = alpha
    this.angle = angle
    this.rangeX = rangeX
    this.rangeY = rangeY
    this.spreadAngle = spreadAngle
    this.showTween = showTween
    this.hideTween = hideTween
    this.onCreate = onCreate
  }

  calc() {
    const direction = this.getDirection()

    return {
      key: utils2d.randomArray(this.keys),
      lifetime: this.getLifetime(),
      position: this.getPosition(),
      velocity: this.getVelocity(direction),
      acceleration: this.getAcceleration(direction),
      gravity: range(this.gravity),
      angularVelocity: range(this.angularVelocity),
      alpha: range(this.alpha),
      scale: range(this.scale),
      angle: range(this.angle), 
      rotation: this.getRotation() // wtf this rotation is for ?
    }
  }

  getLifetime() {
    return this.lifetime === -1 ? this.lifetime : randomize(this.lifetime)
  }

  getPosition() {
    return { 
      x: range(this.rangeX), 
      y: range(this.rangeY) 
    }
  }

  getDirection() {
    const hasSpreadAngle = this.spreadAngle.length > 0
    const spreadAngle = hasSpreadAngle ? range(this.spreadAngle) * (Math.PI / 180) : 0
   
    return {
      x: hasSpreadAngle ? Math.cos(spreadAngle) : 1,
      y: hasSpreadAngle ? Math.sin(spreadAngle) : 1
    }
  }

  getVelocity(direction) {
    return { 
      x: range(this.velocityX) * direction.x, 
      y: range(this.velocityY) * direction.y
    }
  }

  getAcceleration(direction) {
    return {
      x: range(this.accelerationX) * direction.x, 
      y: range(this.accelerationY) * direction.y, 
    }
  }

  getRotation() {
    return this.angularVelocity ? rand(0, Math.PI * 2) : 0 // wtf is rotation
  }
}