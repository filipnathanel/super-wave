import Globals from './globals';
import WaveVisualiser from './wave/Visualiser';
import { getEls, forEach } from './utils/utils';

export default class App {

	constructor( ) {

		this.init();

	}

	init() {

		const h2Els = getEls( 'h2' );
		const visualisers = [];

		App.loadAudio( `audio/${Globals.audioFile}` ).then( ( soundFile ) => {

			soundFile.play();

			forEach( h2Els, h2El => {

				visualisers.push( new WaveVisualiser( h2El, soundFile ) );

			} );

		} );

	}

	static loadAudio( path ) {

		return new Promise( resolve => {

			const soundFile = new p5.SoundFile( path, ( e ) => {

				resolve( soundFile );

			} );

			soundFile.load();

		} );

	}

}
