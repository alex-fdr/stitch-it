import configData from '../assets/settings/config';

export const cfg = {
    /** @param { string } prop */
    get(prop) {
        const segments = prop.split('.');

        if (segments.length === 1) {
            segments.unshift('default');
        }

        let output = configData[segments[0]];

        if (typeof output === 'undefined') {
            return;
        }

        for (let i = 1; i < segments.length; i++) {
            const key = segments[i];
            output = output[key];
        }

        return output.value;
    }
};
