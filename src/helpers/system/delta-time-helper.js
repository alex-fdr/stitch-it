class DeltaTimeHelper {
  constructor() {
    this.startTime = 0
    this.currentTime = 0
    this.deltaTime = 0
  }

  start() {
    this.currentTime = performance.now()
    this.startTime = this.currentTime
  }

  update(time) {
    this.deltaTime = (time - this.currentTime) / 1000 * 60
    this.currentTime = time
  }

  getElapsedTime() {
    return this.currentTime - this.startTime
  }

  getDeltaTime() {
    return this.deltaTime
  }
}

export const deltaTimeHelper = new DeltaTimeHelper()