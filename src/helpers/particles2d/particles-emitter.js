/* eslint-disable consistent-return */

import { factory } from '../pixi/pixi-factory'
import { tweens } from '../tweens'
import { utils2d } from '../utils2d'
import { Particle } from './particle'
import { ParticleData } from './particle-data'
import { particlePrefabs } from './particle-prefabs'

export class ParticlesEmitter {
  constructor() {
    this.group = factory.group()
    this.enabled = false
    this.pool = []
  }

  applyPrefab(type, props) {
    const prefabData = particlePrefabs[type]
    this.init({ ...prefabData, ...props })
  }

  init(props) {
    // create particle data object here
    this.particleData = new ParticleData(props)
    this.spawn()
  }

  spawn() {
    for (let i = 0; i < this.particleData.totalAmount; i++) {
      const data = this.particleData.calc()
      const particle = new Particle(data)
     
      this.pool.push(particle)
      this.group.addChild(particle.sprite)
    }

    this.updateTween = tweens.dummy(1000, { repeat: -1 })
    this.updateTween.onUpdate(() => {
      this.update()
    })
  }

  emit(position, key) {
    const particle = this.getFirstExists()
    
    if (particle) {
      particle.reset(position, key)
      particle.show(this.particleData.showTween)

      this.enabled = true
      this.particleData.onCreate(particle.sprite)
    }
  }

  emitMultiple(amount, delay = 100, position, key) {
    for (let i = 0; i < amount; i++) {
      setTimeout(() => {
        this.emit(position, key)
      }, utils2d.randomInt(0, delay))
    }
  }

  emitByInterval(amount = 1, interval = 100, position, key) {
    const handler = () => {
      this.emitMultiple(amount, 0, position, key)
    }
    this.timerInterval = setInterval(handler, interval)
  }

  stopInterval() {
    clearInterval(this.timerInterval)
    this.timerInterval = 0
  }


  getFirstExists() {
    for (let i = 0; i < this.pool.length; i++) {
      const particle = this.pool[i]

      if (particle && !particle.isActive) {
        return particle
      }
    }
  }

  update() {
    if (!this.enabled) {
      return
    }

    this.pool.forEach((particle) => particle.update())
  }

  kill() {
    this.enabled = false
    this.pool.forEach((particle) => particle.kill(this.particleData.hideTween))
  }
}