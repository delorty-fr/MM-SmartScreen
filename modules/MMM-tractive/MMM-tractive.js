/* Magic Mirror
 * Module: MMM-Tractive
 *
 * Displays pet tracker information from the Tractive API
 * MIT Licensed.
 */

Module.register('MMM-tractive', {
  defaults: {
    initLoadDelay: 5000,
    animationSpeed: 500,
    updateInterval: 30, // every 30 minutes
  },

  domReady: false,

  petData: null,
  petHealthData: null,
  trackerData: null,
  trackerHardwareData: null,
  trackerLocationData: null,

  lightToggleState: { lightOn: false, inProgress: false },
  soundToggleState: { soundOn: false, inProgress: false },

  start: function () {
    Log.info('Starting module: ' + this.name)
    console.log('[MMM-tractive] Module started')
    
    setInterval(
      this.update.bind(this),
      this.config.updateInterval * 60 * 1000)
  },

  update: function () {
    console.log('[MMM-tractive] Fetching tractive info...')
    this.sendSocketNotification('TRACTIVE_UPDATE', {petId: this.config.petId, trackerId: this.config.trackerId})
  },

  getStyles: function () {
    return [`${this.name}.css`]
  },

  getScripts: function () {
    return [`tractive-dashboard.js`]
  },

  getDom: function () {
    console.log('[MMM-tractive] getDom')
    
    const dashboard = document.createElement('div');
    dashboard.style.minHeight = '100vh';
    dashboard.style.display = 'flex';
    dashboard.style.flexDirection = 'column';
    dashboard.style.backgroundColor = theme.background;
    dashboard.style.color = theme.text.primary;
    dashboard.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
    dashboard.style.overflowY = 'auto';

    // Define callback handlers at the top level so they're available in both loading and loaded states
    const onRefreshClick = () => {
      this.petData = null;
      this.petHealthData = null;
      this.trackerHardwareData = null;
      this.trackerLocationData = null;
      this.updateDom(this.config.animationSpeed);
      this.update();
    }

    if(!this.isLoaded()) {
      console.log('[MMM-tractive] Data not fully loaded yet, showing loading screen')
      const loading = createLoadingScreen(onRefreshClick);
      dashboard.appendChild(loading);
      return dashboard;
    }

    const onLightToggleClick = () => {
      this.lightToggleState.lightOn = !this.lightToggleState.lightOn;
      this.lightToggleState.inProgress = true;
      this.updateDom(0);

      const notification = this.lightToggleState.lightOn ? 'SWITCH_LIGHT_ON' : 'SWITCH_LIGHT_OFF';
      this.sendSocketNotification(notification, this.config.trackerId);
    }

    const onSoundToggleClick = () => {
      this.soundToggleState.soundOn = !this.soundToggleState.soundOn;
      this.soundToggleState.inProgress = true;
      this.updateDom(0);

    const notification = this.soundToggleState.soundOn ? 'SWITCH_SOUND_ON' : 'SWITCH_SOUND_OFF';
      this.sendSocketNotification(notification, this.config.trackerId);
    }

    // Main content wrapper
    const mainContent = document.createElement('div');
    mainContent.style.display = 'flex';
    mainContent.style.flexDirection = 'column';
    mainContent.style.gap = '32px';
    mainContent.style.maxWidth = '100%';
    mainContent.style.flex = '1';
    mainContent.style.paddingBottom = '48px';

    let respiratoryStatus = 'UNKNOWN';
    if((this.petHealthData && this.petHealthData.restingRespiratoryRate.status === 'NORMAL')) {
      respiratoryStatus = 'NORMAL';
    } else if((this.petHealthData && this.petHealthData.restingRespiratoryRate.status === 'NOT_ENOUGH_DATA_TODAY')) {
      respiratoryStatus = 'NORMAL';
    } else {
      respiratoryStatus = 'ALERT';
    }

    let heartRateStatus = 'UNKNOWN';
    if(this.petHealthData && this.petHealthData.restingHeartRate.status === 'NORMAL') {
      heartRateStatus = 'NORMAL';
    } else if((this.petHealthData && this.petHealthData.restingHeartRate.status === 'NOT_ENOUGH_DATA_TODAY')) {
      heartRateStatus = 'NORMAL';
    } else {
      heartRateStatus = 'ALERT';
    }
    
    // Determine charging state and battery save mode
    const isCharging = this.trackerData && this.trackerData.charging_state !== "NOT_CHARGING";
    const batterySaveMode = this.trackerData && this.trackerData.state_reason === "POWER_SAVING";

    const petName = this.petData?.details?.name || 'Pet Tracker';
    
    // Handle birthday - could be a string date or numeric timestamp
    let petBirthday = null;
    if (this.petData?.details?.birthday) {
      const birthdayValue = this.petData.details.birthday;
      if (typeof birthdayValue === 'string') {
        petBirthday = new Date(birthdayValue);
      } else if (typeof birthdayValue === 'number') {
        // If it's a large number, assume it's milliseconds; if small, assume seconds
        petBirthday = new Date(birthdayValue > 100000000000 ? birthdayValue : birthdayValue * 1000);
      }
    }
    
    const batteryLevel = this.trackerHardwareData ? this.trackerHardwareData.battery_level : null;
    const minutesActive = this.petHealthData ? this.petHealthData.activity?.minutesActive : null;
    const minutesGoal = this.petHealthData ? this.petHealthData.activity?.minutesGoal : null;
    const alerts = this.petHealthData ? this.petHealthData.healthAlerts?.unseenCount : null; 

    mainContent.appendChild(createHeader(new Date()));
    mainContent.appendChild(createProfileSection(petName, onRefreshClick));
    // mainContent.appendChild(createControlsSection(onRefreshClick, onLightToggleClick, this.lightToggleState.inProgress, onSoundToggleClick, this.soundToggleState.inProgress));
    mainContent.appendChild(createStatusRow(petBirthday, batteryLevel, isCharging, batterySaveMode));
    mainContent.appendChild(createActivitySection(minutesActive, minutesGoal));
    mainContent.appendChild(createMetricsRow(respiratoryStatus, heartRateStatus, alerts));

    dashboard.appendChild(mainContent);

    return dashboard 
  },

  notificationReceived: function(notification, payload, sender) {  
    if (notification === "MODULE_DOM_CREATED") {  
      this.domReady = true; 
      this.update()
    } 
  }, 

  socketNotificationReceived: function (notification, payload) {

    console.log(`[MMM-tractive] Received socket notification: ${notification} with payload:`, payload)

    const animationSpeed = this.config.animationSpeed

    if (notification === 'TRACTIVE_AUTH_SUCCESS') {
      // this.authenticated = true
      // this.update()
    } else if (notification === 'TRACTIVE_DATA') {
      this.petData = payload.pet
      this.petHealthData = payload.petHealthData
      this.trackerHardwareData = payload.hardware
      this.trackerLocationData = payload.location
      this.trackerData = payload.tracker 
    } else if (notification === 'PET_DATA') {
      this.petData = payload
    } else if (notification === 'PET_HEALTH_DATA') {
      this.petHealthData = payload
    } else if (notification === 'TRACKER_HARDWARE_DATA') {
      this.trackerHardwareData = payload
    } else if (notification === 'TRACKER_DATA') {
      this.trackerData = payload
    } else if (notification === 'TRACKER_LOCATION_DATA') {
      this.trackerLocationData = payload
    } else if (notification === 'SOUND_ON_FAILURE' || notification === 'SOUND_OFF_FAILURE') {
      this.soundToggleState.inProgress = false ;
      this.soundToggleState.soundOn = !this.soundToggleState.soundOn;
      animationSpeed = 0;
     } else if (notification === 'LIGHT_ON_FAILURE' || notification === 'LIGHT_OFF_FAILURE') {
      this.lightToggleState.inProgress = false;
      this.lightToggleState.lightOn = !this.lightToggleState.lightOn;
      animationSpeed = 0;
    }

    const isLoaded = this.isLoaded()
    if(isLoaded && this.domReady) {
      this.updateDom(animationSpeed);
    } else {
      console.log(`[MMM-tractive] Data not fully loaded yet (isLoaded=${isLoaded}, domReady=${this.domReady}), skipping DOM update`)
    }

  },

  isLoaded: function () {
    const petDataOk = this.petData != null;
    const petHealthOk = this.petHealthData != null;
    const trackerHardwareOk = this.trackerHardwareData != null;
    const trackerLocationOk = this.trackerLocationData != null;
    const trackerDataOk = this.trackerData != null;
    
    const isLoaded = petDataOk && petHealthOk && trackerHardwareOk && trackerLocationOk && trackerDataOk;

    console.log(`[MMM-tractive] isLoaded=${isLoaded}`);

    return isLoaded;
  }

})
