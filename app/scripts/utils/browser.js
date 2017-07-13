import Emitter from './emitter';
import * as utils from './utils';

class Browser extends Emitter {

	constructor(){

		super();

      this.resizeHandler = utils.debounce( this.resizeHandler.bind(this), 200);

      this.scrollHandler = this.scrollHandler.bind(this);
      this.mouseWheelHandler = utils.debounce( this.mouseWheelHandler.bind(this), 100, true) ;

      this.initEvents();

  }

  initEvents(){

    this.resizeThrottleTime = 200;

    window.addEventListener('resize', this.resizeHandler );
    window.addEventListener('load', this.loadHandler.bind(this) );
    document.addEventListener('DOMContentLoaded', this.readyHandler.bind(this));

    window.addEventListener('scroll', this.scrollHandler );
    window.addEventListener('mouseWheel', this.mouseWheelHandler );
    window.addEventListener('wheel', this.mouseWheelHandler);

    document.addEventListener('touchstart', this.touchStartHandler.bind(this) );
    document.addEventListener('touchmove', this.touchMoveHandler.bind(this) );

  }

  get height(){
    return utils.getViewportDimensions().height;
  }

  resizeHandler(){

    let vw = utils.getViewportDimensions();

    this.trigger('browser:resize', {
      width: vw.width,
      height: vw.height
    });

  }

  readyHandler(){
    this.trigger('browser:ready');
  }

  loadHandler(){
    this.trigger('browser:load');
  }

  scrollHandler(){
    this.trigger('browser:scroll');
  }

 mouseWheelHandler(e){

    const direction = (e.detail<0 || e.wheelDelta>0) > 0 ? 'up':'down';

    this.trigger('browser:mouseWheel', {
      direction:direction,
      e:e
    });

  }

  touchStartHandler(e){
    this.xDown = e.touches[0].clientX;                                      
    this.yDown = e.touches[0].clientY;    
  }

  touchMoveHandler(e){

    // e.preventDefault();

    if ( ! this.xDown || ! this.yDown ) {
      return;
    }

    var xUp = e.touches[0].clientX;                                    
    var yUp = e.touches[0].clientY;

    var xDiff = this.xDown - xUp;
    var yDiff = this.yDown - yUp;

    if ( yDiff > 0 ) {
    /* up swipe */ 
      this.trigger('browser:swipe',{
        direction:'up'
      })
    } else { 
      this.trigger('browser:swipe',{
        direction:'down'
      })
    /* down swipe */
    }                                                                 

    /* reset values */
    this.xDown = null;
    this.yDown = null;                       
  }
	
}

const browser = new Browser();

export {browser as default}