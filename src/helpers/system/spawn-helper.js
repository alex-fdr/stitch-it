export class SpawnHelper {
  constructor(props = {}) {
    const { total = 10, interval = 200 } = props

    this.spawnTotal = total
    this.spawnInterval = interval
    
    this.prevTime = 0
    this.spawnCounter = 0
    
    this.isCompleted = false
    this.spawnFirstItemImmediatly = true
  }

  start() {
    if (this.isCompleted) {
      return
    }

    this.prevTime = performance.now()

    if (this.spawnFirstItemImmediatly) {
      this.prevTime -= this.spawnInterval
    }
  }

  canSpawnNewObject() {
    if (this.isCompleted) {
      return false
    }
    
    if (performance.now() - this.prevTime > this.spawnInterval) {
      this.prevTime = performance.now()

      this.spawnCounter += 1

      if (this.spawnCounter > this.spawnTotal) {
        this.isCompleted = true
        return false
      }

      return true
    }

    return false
  }

  isLastObjectSpawned() {
    return this.spawnCounter >= this.spawnTotal
  }
}