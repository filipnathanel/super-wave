import Globals from '../globals';
import { extend } from '../utils/utils';

export default class Visualiser {

	constructor( $el, soundFile ) {

		this.p5init = this.p5init.bind( this );

		if ( this.isAllowedToConstruct ) {

			this.init( $el, soundFile );

		}

	}

	get isAllowedToConstruct() {

		if ( Globals.visuCount < 3 ) return true;

		return false;

	}

	init( $el, soundFile ) {

		Globals.visuCount++;

		this.$el = $el;
		this.sound = soundFile;

		this.p5 = new p5( this.p5init );

	}

	p5init( p ) {

		p.setup = () => {

			this.cnv = p.createCanvas( Globals.viewport.width, 200 );
			this.cnv.parent( this.$el );
			this.fft = new p5.FFT();
			this.fft.setInput( this.sound );

		};

		p.draw = () => {

			p.background(211);

			const waveform = this.fft.waveform();

			p.noFill();
			p.beginShape();
			p.stroke( 90, 90, 90); // waveform is red
			p.strokeWeight( 1 );

			for ( let i = 0; i < waveform.length; i++ ){

				const x = p.map( i, 0, waveform.length, 0, p.width );
				const y = p.map( waveform[i], -1, 1, 0, p.height );
				p.vertex( x, y );

			}

			p.endShape();

		};

	}


}
