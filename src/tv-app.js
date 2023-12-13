// import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@lrnwebcomponents/video-player/video-player.js';
import "./tv-channel.js";

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
    this.video = "https://www.youtube.com/watch?v=68h8-ESTY6o";
    this.currentInfo="";
    this.activeIndex =0;
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
      currentInfo:{type: String},
      active:{type:Boolean, reflect: true},
      activeIndex:{type: Number},
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
        display: block;
        margin: 5px;
      }
      .grid-container 
      {
        display: grid;
        grid-template-columns: auto auto;
        background-color: white;
        padding: 5px;
        gap: 5px;
      }
      .screen
      {
          height: 357px;
          width: 1000px;
      }
      .grid-attributes
        {
          height: 820px;
          width: 400px;
          border: 1px solid rgba(0, 0, 0, 0.8);
          background-color: #3392FF;
        }
        .scroll-container 
        {
          width: 350px;
          height: 800px;
          overflow-y: auto;
          padding-top: 5px;
          padding-left: 25px;
        }
        .description
        {
          width: 1000px;
          height: 250px;
          background-color: #3392FF;
        }
        .descriptionContent
        {
          font-size: 16px;
          color: white;
        }
        .button-container {
          display: flex;
          justify-content: space-between;
          margin-top: 100px; 
          margin-right:50%;
        }
        
        .previous,
        .next {
          width: 10%; 
          height: 20%;
          box-sizing: border-box;
          text-align: center;
          background-color: #2A6AA3;
          color: white;

        }
      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    // this.currentVidTime();
    return html ` 
      <div class="grid-container">
      <div class="screen">
          <video-player source="${this.video}"></video-player>
          <div class="description">
           <h3 class="descriptionContent"> "${this.listings.length > 0 ? this.listings[this.activeIndex].description : ''}"</h3>
      </div>
        </div>
      <div class="grid-attributes">
        <div class="scroll-container"> 
        
       
          
        ${
          this.listings.map(
            (list,index) => html`
            <tv-channel
            title= "${list.title}"
            ?active="${index === this.activeIndex}"
            index="${index}"
            timecode= "${list.metadata.timecode}"
            @click="${this.currentItem}"
          >
          </tv-channel>
            `
          )
        }
        </div>
      </div>
    </div>
    <div class="button-container">
    <div class="previous" @click="${this.prevSlide}">Previous Slide</button>
    </div>
    <div class="next" @click="${this.nextSlide}">Next Slide</button>
    </div>
    `;
    }
     
  // LitElement life cycle for when any property changes
  connectedCallback() {
    this.changeSlide();
    super.connectedCallback(); 
    
   }
   prevSlide()
   {
     this.activeIndex--;
   }
   nextSlide()
   {
     this.activeIndex++;
   }
 changeSlide()
 {
   setInterval(() => {
     const currentTime = this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').media.currentTime;
 
     if (this.activeIndex + 1 < this.listings.length &&
         currentTime >= this.listings[this.activeIndex + 1].metadata.timecode) {
       this.activeIndex++;
      
     }
   }, 1000);
 }

 
 currentItem(e) {
  console.log(e.target);
  this.activeIndex= e.target.index;
  this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play();
}

updated(changedProperties) {
  if (super.updated) {
    super.updated(changedProperties);
  }
  changedProperties.forEach((oldValue, propName) => {
    if (propName === "source" && this[propName]) {
      this.updateSourceData(this[propName]);
    }
    if(propName === "activeIndex"){
      var currentLectureSlide = this.shadowRoot.querySelector("tv-channel[index = '" + this.activeIndex + "' ] ");
      this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').seek(currentLectureSlide.timecode);
    }
  });
}

async updateSourceData(data) {
  await fetch(data)
    .then((resp) => resp.ok ? resp.json() : [])
    .then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) 
      {
        this.listings = [...responseData.data.items];
        
      }

    });
}

 currentItem(e) {
    
    console.log(e.target);
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play();
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').seek(e.target.timecode);
  }
   descriptionInfo()
   {

   }
 

}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);
