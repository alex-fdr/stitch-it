SCREENS.hintScreen = function hintScreen() {
  const pt2px = (pt) => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    return (w > h)
      ? {
        x: (w / 960) * pt.x,
        y: (h / 960) * pt.y,
      } : {
        x: (w / 960) * pt.x,
        y: (h / 960) * pt.y,
      };
  };

  this.container = this.dom.querySelector('.container');
  this.fnGetPosition = () => null;

  this.setVisibility = (visible) => {
    if (visible) {
      this.dom.classList.add('visible');
      this.setPosition(this.fnGetPosition());
    } else {
      this.dom.classList.remove('visible');
    }
  };

  this.resize = () => {
    this.setPosition(this.fnGetPosition());
  };

  this.assignGetter = (fn) => {
    this.fnGetPosition = fn;
  };

  this.setPosition = (points) => {
    if (!points) {
      return;
    }

    const { x, y } = pt2px(points[0]);

    this.container.style.left = `${x}px`;
    this.container.style.top = `${y}px`;
  };
};
