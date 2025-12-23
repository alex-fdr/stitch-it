class Utils2D {
    clamp(value, min, max) {
        if (value < min) {
            return min;
        }

        if (value > max) {
            return max;
        }

        return value;
    }

    distance(x1, y1, x2, y2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    roundAngle(angle, roundStep = 1) {
        return Math.round(angle / roundStep) * roundStep;
    }

    sign(x) {
        if (x === 0) {
            return 0;
        }

        return x < 0 ? -1 : 1;
    }

    random(min = 0, max = 1, step = 0) {
        if (step !== 0) {
            return min + step * Math.floor((Math.random() * (max - min)) / step);
        }

        const value = min + Math.random() * (max - min);

        return value;
    }

    randomInt(min, max, step) {
        const value = this.random(min, max, step);
        return Math.floor(value);
    }

    randomArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    randomSign() {
        return this.sign(Math.random() - 0.5);
    }
}

export const utils2d = new Utils2D();
