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
    activityStartTime: "06:00",
    activityEndTime: "24:00",
    stepsGraphLabelGapHours: 1 // min 1, max 12
  },

  domReady: false,

  petData: null,
  petHealthData: null,
  trackerData: null,
  trackerHardwareData: null,
  trackerLocationData: null,
  stepsData: null,
  stepsRangeData: null,

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
    this.sendSocketNotification('STEPS_UPDATE', {})
    this.sendSocketNotification('STEPS_RANGE_UPDATE', {})
  },

  getStyles: function () {
    return [`${this.name}.css`]
  },

  getScripts: function () {
    return [
      'https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.3/echarts.min.js',
      'tractive-dashboard.js'
    ]
  },

  getDom: function () {
    console.log('[MMM-tractive] getDom called, isLoaded()=' + this.isLoaded() + ', domReady=' + this.domReady);
    
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
    
    const batteryLevel = this.trackerHardwareData ? this.trackerHardwareData.battery_level : null;
    const minutesActive = this.petHealthData ? this.petHealthData.activity?.minutesActive : null;
    const minutesGoal = this.petHealthData ? this.petHealthData.activity?.minutesGoal : null;
    const alerts = this.petHealthData ? this.petHealthData.healthAlerts?.unseenCount : null; 

     // Validate stepsGraphLabelGapHours - should be between 1 and 12
    let stepsGraphLabelGapHours = this.config.stepsGraphLabelGapHours;
    if (typeof stepsGraphLabelGapHours !== 'number' || stepsGraphLabelGapHours < 1 || stepsGraphLabelGapHours > 12) {
      stepsGraphLabelGapHours = 1;
      console.log('[MMM-tractive] stepsGraphLabelGapHours invalid, defaulting to 1');
    }
    
    // Get steps data from Garmin backend service (via node_helper)
    let slotStepsData = [];
    let totalStepsValue = 0;
    
    if (this.stepsData && this.stepsData.length > 0) {
      // Parse activity time range from config
      const [startHour, startMin] = this.config.activityStartTime.split(':').map(Number);
      const [endHour, endMin] = this.config.activityEndTime.split(':').map(Number);
      const startTimeMinutes = startHour * 60 + startMin;
      const endTimeMinutes = endHour * 60 + endMin;
      
      // Create a map of backend data for quick lookup
      const backendDataMap = {};
      this.stepsData.forEach(slot => {
        const slotTimeMinutes = slot.hour * 60 + slot.minutes;
        backendDataMap[slotTimeMinutes] = slot.steps;
      });
      
      // Generate all slots in the configured time range, filling in backend data or 0
      for (let timeMinutes = startTimeMinutes; timeMinutes <= endTimeMinutes; timeMinutes += 30) {
        let hour = Math.floor(timeMinutes / 60);
        const minutes = timeMinutes % 60;
        // Handle 24:00 as 00:00 (midnight)
        if (hour >= 24) {
          hour = 0;
        }
        const steps = backendDataMap[timeMinutes] || 0;
        
        slotStepsData.push({
          slot: slotStepsData.length,
          hour: hour,
          minutes: minutes,
          steps: steps
        });
      }
      
      totalStepsValue = slotStepsData.reduce((sum, s) => sum + s.steps, 0);
      console.log('[MMM-tractive] Using steps data:', slotStepsData.length, 'slots (from', this.config.activityStartTime, 'to', this.config.activityEndTime, '), total:', totalStepsValue);
    } else {
      console.log('[MMM-tractive] Waiting for steps data from backend...');
    }
    
    const stepsData = {
      totalSteps: totalStepsValue,
      slotSteps: slotStepsData
    };

    // Calculate percentages for gauge charts
    const activityPercentage = (minutesActive != null && minutesGoal != null) ? (minutesActive / minutesGoal) * 100 : 0;
    const stepsPercentage = (totalStepsValue != null) ? (totalStepsValue / 10000) * 100 : 0;
    
    // Main content wrapper - 3 rows: header, center, health
    const mainContent = document.createElement('div');
    mainContent.style.display = 'flex';
    mainContent.style.flexDirection = 'column';
    mainContent.style.height = '100vh';
    mainContent.style.flex = '1';
    mainContent.style.backgroundColor = theme.background;

    // Header row - flex 1 (16.67% of height)
    // Center row - flex 2 (33.33% of height) - middle positioned at 1/3 of viewport
    // Health row - flex 3 (50% of height)
    // Result: middle of centerRow = 1/6 + 1/6 = 1/3 of total height
    
    const headerRow = document.createElement('div');
    headerRow.style.flex = '1';
    headerRow.style.display = 'flex';
    headerRow.style.flexDirection = 'column';
    headerRow.style.justifyContent = 'flex-start';
    headerRow.style.alignItems = 'center';
    headerRow.style.paddingTop = '24px';
    headerRow.style.paddingLeft = '24px';
    headerRow.style.paddingRight = '24px';
    headerRow.appendChild(createHeader(new Date(), this.trackerHardwareData.battery_level, isCharging, batterySaveMode));

    // Center row - flex 2 (middle at 1/3 of viewport height)
    const centerRow = document.createElement('div');
    centerRow.style.display = 'flex';
    centerRow.style.justifyContent = 'center';
    centerRow.style.alignItems = 'center';
    centerRow.style.flex = '2';
    centerRow.style.width = '100%';

    const wrapperHeightPixels = Math.round(Math.min(window.innerHeight * 0.9, window.innerWidth - window.innerWidth * 0.1));

    // Overlapping wrapper for profile and gauge sections (centered)
    const overlappingWrapper = document.createElement('div');
    overlappingWrapper.style.position = 'relative';
    overlappingWrapper.style.width = '100%';
    overlappingWrapper.style.height = wrapperHeightPixels + 'px';
    overlappingWrapper.style.display = 'flex';
    overlappingWrapper.style.justifyContent = 'center';
    overlappingWrapper.style.alignItems = 'center';

    // Add profile section (positioned absolutely, will be on top)
    const profileSection = createProfileSection(petName, onRefreshClick, wrapperHeightPixels - wrapperHeightPixels / 3);
    profileSection.style.position = 'absolute';
    profileSection.style.left = '50%';
    profileSection.style.top = '50%';
    profileSection.style.transform = 'translate(-50%, -50%)';
    profileSection.style.zIndex = '10';
    overlappingWrapper.appendChild(profileSection);

    // Add gauge section (positioned absolutely, will be behind)
    const gaugeSection = createGaugeChartsSection(activityPercentage, stepsPercentage, wrapperHeightPixels);
    gaugeSection.style.position = 'absolute';
    gaugeSection.style.left = '50%';
    gaugeSection.style.top = '50%';
    gaugeSection.style.transform = 'translate(-50%, -50%)';
    gaugeSection.style.zIndex = '1';
    gaugeSection.style.width = '100%';
    overlappingWrapper.appendChild(gaugeSection);

    centerRow.appendChild(overlappingWrapper);

    // Health row - flex 3 (50% of height)
    const healthRow = document.createElement('div');
    healthRow.style.flex = '3';
    healthRow.style.display = 'flex';
    healthRow.style.flexDirection = 'column';
    healthRow.style.justifyContent = 'flex-start';
    healthRow.style.alignItems = 'center';
    healthRow.style.paddingTop = '15%';
    healthRow.style.width = '100%';
    healthRow.appendChild(createHealthStatusSection(respiratoryStatus, heartRateStatus, alerts));

    mainContent.appendChild(headerRow);
    mainContent.appendChild(centerRow);
    mainContent.appendChild(healthRow);
    dashboard.appendChild(mainContent);

    return dashboard 
  },

  notificationReceived: function(notification, payload, sender) {  
    if (notification === "MODULE_DOM_CREATED") {  
      console.log('[MMM-tractive] MODULE_DOM_CREATED received, setting domReady=true');
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
    } else if (notification === 'STEPS_DATA') {
      this.stepsData = payload
    } else if (notification === 'STEPS_RANGE_DATA') {
      this.stepsRangeData = payload
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
      console.log('[MMM-tractive] DOM conditions met, calling updateDom()');
      this.updateDom(animationSpeed);
    } else {
      console.log(`[MMM-tractive] DOM not ready - isLoaded=${isLoaded}, domReady=${this.domReady})`);
    }

  },

  isLoaded: function () {

    const petDataOk = this.petData != null;
    const petHealthOk = this.petHealthData != null;
    const trackerHardwareOk = this.trackerHardwareData != null;
    const trackerLocationOk = this.trackerLocationData != null;
    const trackerDataOk = this.trackerData != null;
    const stepsDataOk = this.stepsData != null;
    const stepsRangeDataOk = this.stepsRangeData != null;

    console.log(`[MMM-tractive] isLoaded check: petDataOk=${petDataOk}, petHealthOk=${petHealthOk}, trackerHardwareOk=${trackerHardwareOk}, trackerLocationOk=${trackerLocationOk}, trackerDataOk=${trackerDataOk}, stepsDataOk=${stepsDataOk}, stepsRangeDataOk=${stepsRangeDataOk}`);

    const isLoaded = petDataOk && petHealthOk && trackerHardwareOk && trackerLocationOk && trackerDataOk && stepsDataOk && stepsRangeDataOk;

    console.log(`[MMM-tractive] isLoaded=${isLoaded}`);

    return isLoaded;
  }

})
