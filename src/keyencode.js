import {
 	TRIAL_ACTION_PHOTO,
 	TRIAL_ACTION_SKIP,
} from './redux/trialconstants';

import {
	KEYS,
	USER_INPUT_SKIP,
	USER_INPUT_PHOTO
} from './constants';

const KEY_MAPPING = {
	[KEYS[USER_INPUT_SKIP]]: TRIAL_ACTION_SKIP,
	[KEYS[USER_INPUT_PHOTO]]: TRIAL_ACTION_PHOTO,
};

const encodeKeycode = keycode => KEY_MAPPING[keycode];
export default encodeKeycode;