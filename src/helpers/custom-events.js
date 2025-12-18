const flags = {}

function send(evt) {
  if (flags[evt]) {
    return
  }

  flags[evt] = true
  GM.trigger.custom(evt)
}

export const customEvents = {
  introEnd: () => {
    send('introEnd')
  },
  
  stitchNum: (stitchIndex) => {
    const num = Math.min(stitchIndex, 10)
    send(`stitch_${num}`)
    console.log('stitch num', num);
  },

  areaStart: (areaIndex) => {
    send(`Area${areaIndex}_Start`)
  },

  areaComplete: (areaIndex) => {
    send(`Area${areaIndex}_Complete`)
  }
}
