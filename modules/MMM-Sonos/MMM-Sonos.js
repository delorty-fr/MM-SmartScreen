/* Magic Mirror
 * Module: MagicMirror-Sonos-Module
 *
 * By Christopher Fenner https://github.com/CFenner
 * MIT Licensed.
 *
 *
 * https://github.com/jishi/node-sonos-http-api
 */


Module.register('MMM-Sonos', {
  defaults: {
    roomName: 'Office - 5',
    showAlbumArt: true,
    albumArtLocation: 'right',
    showRoomName: true,
    animationSpeed: 500,
    updateInterval: 0.05, // every 0.5 minutes
    apiBase: 'http://localhost',
    apiPort: 5005,
    apiEndpoint: 'zones',
    exclude: []
  },
  loaded: false,
  start: function () {
    Log.info('Starting module: ' + this.name)
    this.update()
    // refresh every x minutes
    setInterval(
      this.update.bind(this),
      this.config.updateInterval * 60 * 1000);
  },
  update: function () {
    this.sendSocketNotification(
      'SONOS_UPDATE',
      this.config.apiBase + ':' + this.config.apiPort + '/' + this.config.apiEndpoint)
  },
  updateRoom: function (data) {

    const currentTrack = data.state.currentTrack
    let artist = currentTrack.artist
    let track = currentTrack.title
    let cover = currentTrack.absoluteAlbumArtUri

    // clean data
    artist = artist ? artist.trim() : ''
    track = track ? track.trim() : ''
    cover = cover ? cover.trim() : ''
    track = track === currentTrack.uri ? '' : track

    // remove stream URL from title
    if (currentTrack.trackUri && currentTrack.trackUri.includes(track)) {
      track = ''
    }

    const room = {
      name: data.roomName,
      state: data.state.playbackState,
      artist: artist,
      track: track,
      albumArt: cover,
      actionPending: false
    }

    if(JSON.stringify(this.room) === JSON.stringify(room)) {
      return
    }

    this.loaded = true
    this.room = room

    this.updateDom(this.config.animationSpeed)
  },
  getStyles: function () {
    return [`${this.name}.css`]
  },
  getDom: function () {
    let sonosDiv = document.createElement('div');
    sonosDiv.className = 'sonos';

    if (this.loaded && !this.room.actionPending && this.room.state !== 'TRANSITIONING') {

      let playingDiv = document.createElement('div');
      playingDiv.className = 'playing';

      let artDiv = document.createElement('div');
      artDiv.className = 'art';

      let img = document.createElement('img');
      img.src = this.room.albumArt;

      let imgDiv = document.createElement('div');
      imgDiv.className = 'imgDiv';

      let trackArtistDiv = document.createElement('div');
      trackArtistDiv.className = 'track-artist normal medium';

      let trackDiv = document.createElement('div');
      trackDiv.className = 'track';
      trackDiv.textContent = this.room.track;

      let artistDiv = document.createElement('div');
      artistDiv.className = 'artist';
      artistDiv.textContent = this.room.artist;

      let controlDiv = document.createElement('div');
      controlDiv.className = 'control';

      let prevButton = document.createElement('button');
      prevButton.className = "fa fa-solid fa-backward";
      prevButton.onclick = function () {
        this.room.actionPending = true;
        this.updateDom(this.config.animationSpeed)
        this.sendSocketNotification('SONOS_UPDATE', this.config.apiBase + ':' + this.config.apiPort + '/' + this.room.name + '/previous');
      }.bind(this);

      let playPauseButton = document.createElement('button');
      if(this.room.state === 'PAUSED_PLAYBACK') {
        playPauseButton.className = "fa fa-solid fa-play play-pause";
        playPauseButton.onclick = function () {
          this.room.actionPending = true;
          this.updateDom(this.config.animationSpeed)
          this.sendSocketNotification('SONOS_UPDATE', this.config.apiBase + ':' + this.config.apiPort + '/' + this.room.name + '/play');
        }.bind(this);
      } else {
        playPauseButton.className = "fa fa-solid fa-pause play-pause";
        playPauseButton.onclick = function () {
          this.room.actionPending = true;
          this.updateDom(this.config.animationSpeed)
          this.sendSocketNotification('SONOS_UPDATE', this.config.apiBase + ':' + this.config.apiPort + '/' + this.room.name + '/pause');
        }.bind(this);
      }

      let nextButton = document.createElement('button');
      nextButton.className = "fa fa-solid fa-forward";
      nextButton.onclick = function () {
        this.room.actionPending = true;
        this.updateDom(this.config.animationSpeed)
        this.sendSocketNotification('SONOS_UPDATE', this.config.apiBase + ':' + this.config.apiPort + '/' + this.room.name + '/next');
      }.bind(this);

      if(this.room.actionPending) {
        playPauseButton.disabled = true;
        prevButton.disabled = true;
        nextButton.disabled = true;
      }

      trackArtistDiv.appendChild(trackDiv);
      trackArtistDiv.appendChild(artistDiv);

      controlDiv.appendChild(prevButton);
      controlDiv.appendChild(playPauseButton);
      controlDiv.appendChild(nextButton);

      imgDiv.appendChild(img);
      artDiv.appendChild(imgDiv);
      artDiv.appendChild(trackArtistDiv);

      playingDiv.appendChild(artDiv);
      playingDiv.appendChild(controlDiv);

      sonosDiv.appendChild(playingDiv);

      let animationDiv = document.createElement('div');
      animationDiv.className = 'animation';
      if(this.room.state === 'PLAYING') {
        animationDiv.innerHTML = `
          <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
          <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
          <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
          <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
          <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
          </g>
          </svg>
        `;
      }
      sonosDiv.appendChild(animationDiv);
    } else {
      let dimmedDiv = document.createElement('div');
      dimmedDiv.className = 'dimmed light small';
      dimmedDiv.innerHTML = "Loading...";
      sonosDiv.appendChild(dimmedDiv);

      dimmedDiv.innerHTML = `
      <div class="loader">
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
        <div class="bar4"></div>
        <div class="bar5"></div>
        <div class="bar6"></div>
      </div>`;
    }

    return sonosDiv
  },
  socketNotificationReceived: function (notification, payload) {
    if (notification !== 'SONOS_DATA') {
      return
    }
    if(payload != null && Array.isArray(payload)) {
      payload.forEach((sonosGroup) => {
        if(sonosGroup.coordinator.roomName === this.config.roomName) {
          if(this.room != null) {
            this.room.actionPending = false;
          }
          this.updateRoom(sonosGroup.coordinator)
          return
        }
      })
    }
  }
})
