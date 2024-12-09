const LOCATION_TRANSITION_DURATION = 30000;
const USA_LATLNG    = [37.0902, -95.7129];
const BOSTON_LATLNG = [42.361145, -71.057083];
const PARIS_LATLNG  = [48.8566, 2.3522];

const LOCATIONS = [
  { coord: USA_LATLNG,    zoom: 4},
  { coord: BOSTON_LATLNG, zoom: 7},
  { coord: BOSTON_LATLNG, zoom: 11},
  { coord: PARIS_LATLNG,  zoom: 5},
  { coord: PARIS_LATLNG,  zoom: 11},
]

Module.register('MMM-windy', {
  defaults: {
    initLoadDelay: 500,
    key: '',
    zoom: 5,
    particlesAnim: 'on',
    graticule: false,
    englishLabels: false,
    hourFormat: '12h',
    overlay: 'wind'
  },
  getScripts: function() {
    return [
      'https://unpkg.com/leaflet@1.4.0/dist/leaflet.js',
    ];
  },
  getDom: function() {
    var self = this;
    var wrapper = document.createElement('div');
    wrapper.id = 'windy-root'
    if (self.config.key === '') {
      wrapper.innerHTML = 'Please set the windy.com <i>apiKey</i> in the config for module: ' + this.name + '.';
      wrapper.className += 'dimmed light small';
      return wrapper;
    }

    if (!self.loaded) {
      wrapper.innerHTML = this.translate('LOADING');
      wrapper.innerClassName = 'dimmed light small';
      return wrapper;
    }
    var mapDiv = document.createElement('div');
    mapDiv.id = 'windy';
    wrapper.appendChild(mapDiv);

    return wrapper;
  },
  start: function() {
    let self = this;
    Log.info('Starting module: ' + this.name);
    self.loaded = false;
    var scripts = [
      'https://api4.windy.com/assets/libBoot.js'
    ];
    var loadScripts = function(scripts) {
      var script = scripts.shift();
      var el = document.createElement('script');
      el.type = 'text/javascript';
      el.src = script;
      el.setAttribute('defer', '');
      el.setAttribute('async', '');

      el.onload = function() {
        if (scripts.length) {
          loadScripts(scripts);
        } else {
          self.loaded = true;
          self.updateDom();
          self.scheduleInit(self.config.initLoadDelay);
        }
      };
      document.querySelector('body').appendChild(el);
    };
    loadScripts(scripts);
  },
  scheduleInit: function(delay) {
    var self = this;
    setTimeout(() => {
      let locationIndex = 0;
      self.config.lat = LOCATIONS[locationIndex].coord[0];
      self.config.lng = LOCATIONS[locationIndex].coord[1];
      self.config.zoom = LOCATIONS[locationIndex].zoom;

      windyInit(self.config, windyAPI => {
        const { store, map } = windyAPI;
        if(true) {
        setInterval(() => {
          locationIndex = locationIndex < LOCATIONS.length - 1 ? locationIndex + 1 : 0
          map.flyTo(LOCATIONS[locationIndex].coord, LOCATIONS[locationIndex].zoom, {
            animate: true,
            duration: 1
          });
        }, LOCATION_TRANSITION_DURATION);
        }
      });
    }, delay);
  },
  getStyles: function() {
    return [
      'MMM-windy.css'
    ];
  }
});
