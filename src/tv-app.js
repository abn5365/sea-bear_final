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
      currentInfo:{type: String}
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
          background-color: black;
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
          background-color: blue;
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
           <h3 class="descriptionContent"> "${this.currentInfo}"</h3>
      </div>
        </div>
      <div class="grid-attributes">
        <div class="scroll-container"> 
        
       
          
        ${
          this.listings.map(
            (list) => html`
            <tv-channel
            title= "${list.title}"
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
    <div class="previous">Previous Slide</button>
    </div>
    <div class="next">Next Slide</button>
    </div>
    `;
    }
     
  // LitElement life cycle for when any property changes


  currentItem(e) {
    
    console.log(e.target);
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play();
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').seek(e.target.timecode);
  }
   descriptionInfo()
   {

   }
  currentVidTime()
  {
      const timeNow = this.shadowRoot.querySelector('video-player').shadowRoot.querySelector("a11y-media-player").media.currentTime;
  
      this.listings.forEach((list) => {
        const currentTimecode = list.timecode;
  
       
        if (Math.abs(timeNow - currentTimecode) < this.timeThreshold) {
          this.currentInfo = list.description;
          return;
        }
      });
}

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
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
  

}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);
