import browser from './utils/browser';

import Globals from './globals';
import App from './app';

browser.on( 'browser:ready', () => {

	Globals.app = new App( );

} );

browser.on( 'browser:load', () => {

} );
