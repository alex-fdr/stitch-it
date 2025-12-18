import configData from '../assets/settings/config';

export const cfg = {
    /** @param { string } prop */
    get(prop, fallbackValue) {
        const segments = prop.split('.');

        if (segments.length === 1) {
            segments.unshift('default');
        }

        let output = configData[segments[0]];

        if (typeof output === 'undefined') {
            return fallbackValue;
        }

        for (let i = 1; i < segments.length; i++) {
            const key = segments[i];
            output = output[key];

            if (typeof output === 'undefined') {
                return fallbackValue;
            }
        }

        return output.value;
    }
};
