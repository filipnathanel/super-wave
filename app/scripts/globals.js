import * as utils from './utils/utils';
import onResize from './utils/onResize';

const Globals = {
	get viewport () { return utils.getViewportDimensions() },
	onResize: new onResize(),
	visuCount: 0,
	audioFile: 'audio.mp3'
};

window.globals = Globals;

export { Globals as default };