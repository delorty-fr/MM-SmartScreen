// Dog Tracker Dashboard - Pure JavaScript UI Builder (Template-aligned)

// Theme configuration
const theme = {
  // Primary colors
  accent: '#2ddbde',        // Teal
  accentDark: '#003738',    // Dark teal
  background: '#1e2531',    // Navy
  backgroundLight: '#19202c', // Navy darker
  backgroundLighter: '#2e3542', // Navy light

  // Text colors
  text: {
    primary: '#ffffff',     // White
    secondary: '#d1d5db',   // Light gray
    tertiary: '#dce2f3',    // Lighter gray
    light: '#c5c6cc',       // Medium gray
    muted: '#9ca3af',       // Dark gray
  },

  // Status colors
  status: {
    normal: '#10b981',      // Green
    warning: '#f59e0b',     // Orange
    alert: '#ef4444',       // Red
    unknown: '#9ca3af',     // Gray
  },

  // Battery colors
  battery: {
    critical: '#ef4444',    // Red
    low: '#f59e0b',         // Orange
    medium: '#fbbf24',      // Amber
    good: '#10b981',        // Green
  },

  // Opacity overlays
  overlay: {
    subtle: 'rgba(255, 255, 255, 0.05)',
    light: 'rgba(255, 255, 255, 0.1)',
    accentLight: 'rgba(45, 219, 222, 0.1)',
    accentLighter: 'rgba(45, 219, 222, 0.2)',
    accentSubtle: 'rgba(45, 219, 222, 0.4)',
    darkLight: 'rgba(0, 0, 0, 0.4)',
    dark: 'rgba(0, 0, 0, 0.8)',
  },
};

const FontSizes = {
  'S': '16px',
  'M': '24px',
  'L': '32px',
  'XL': '48px',
  'XXL': '56px'
};

const IconSizes = {
  'S': '32px',
  'M': '48px',
  'L': '64px',
};

/**
 * Create Gauge Charts Section - Display activity and steps progress as concentric rings
 * Both gauges are nested inside each other in a single container
 * @param {number} activityPercentage - Activity minutes as percentage of goal (0-100+)
 * @param {number} stepsPercentage - Steps as percentage of goal (0-100+)
 */
function createGaugeChartsSection(activityPercentage, stepsPercentage) {

  // Helper function to create labels with common styling
  const createLabel = (config) => {
    const label = document.createElement('div');
    label.style.position = 'absolute';
    label.style.fontSize = FontSizes.S;
    label.style.color = theme.accent;
    label.style.fontWeight = '600';
    label.style.zIndex = '1000';
    label.style.pointerEvents = 'none';
    label.style.opacity = '0';
    label.style.transition = 'opacity 0.3s ease';
    
    // Apply config properties
    if (config.top) label.style.top = config.top;
    if (config.right) label.style.right = config.right;
    if (config.left) label.style.left = config.left;
    if (config.transform) label.style.transform = config.transform;
    if (config.textContent) label.textContent = config.textContent;
    if (config.whiteSpace) label.style.whiteSpace = config.whiteSpace;
    
    return label;
  };

  const SECTION_HEIGHT = 800;
  const MAX_GAUGE_RADIUS = SECTION_HEIGHT;
  
  const GAUGE_RADIUS = 25;

  const GAUGES_GAP = 8; // Gap between the two gauges

  const GAUGE_RADIUS_1 = (MAX_GAUGE_RADIUS / 2) - (GAUGE_RADIUS / 2)
  const GAUGE_RADIUS_2 =GAUGE_RADIUS_1 - GAUGE_RADIUS - GAUGES_GAP

  const section = document.createElement('section');
  section.style.display = 'flex';
  section.style.width = '100%';
  section.style.maxWidth = '1200px';
  section.style.marginLeft = 'auto';
  section.style.marginRight = 'auto';
  section.style.paddingLeft = '0px';
  section.style.paddingRight = '0px';
  section.style.justifyContent = 'center';
  section.style.alignItems = 'center';
  section.style.position = 'relative';
  section.style.overflow = 'visible';
  // section.style.border = "1px solid red";

  // Wrapper for labels and gauge
  const wrapper = document.createElement('div');
  wrapper.style.width = '100%';
  wrapper.style.position = 'relative';
  wrapper.style.height = '470px';
  wrapper.style.overflow = 'visible';
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.justifyContent = 'center';

  const activeMinLabel = createLabel({
    top: `calc(50% - ${GAUGE_RADIUS_1 - (GAUGE_RADIUS/2)}px)`,
    right: `calc(50% + ${(GAUGE_RADIUS/2) + 4}px)`,
    transform: 'translateY(-50%)',
    textContent: 'Active'
  });
  
  const stepsLabel = createLabel({
    top: `calc(50% - ${GAUGE_RADIUS_2 - (GAUGE_RADIUS/2)}px)`,
    right: `calc(50% + ${(GAUGE_RADIUS/2) + 4}px)`,
    transform: 'translateY(-50%)',
    textContent: 'Steps'
  });

  wrapper.appendChild(activeMinLabel);
  wrapper.appendChild(stepsLabel);

  // Percentage labels positioned with left edge at center, rotated -90deg
  const activeMinPercentLabel = createLabel({
    left: `calc(50% - ${GAUGE_RADIUS_1 - (GAUGE_RADIUS/2)}px)`,
    top: '50%',
    transform: `translateX(-50%) translateY(calc(-100% - ${(GAUGE_RADIUS/2) + 4}px)) rotate(-90deg)`,
    textContent: `${Math.round(activityPercentage)}%`.padEnd(4, ' '),
    whiteSpace: 'pre'
  });
  
  const stepsPercentLabel = createLabel({
    left: `calc(50% - ${GAUGE_RADIUS_2 - (GAUGE_RADIUS/2)}px)`,
    top: '50%',
    transform: `translateX(-50%) translateY(calc(-100% - ${(GAUGE_RADIUS/2) + 4}px)) rotate(-90deg)`,
    textContent: `${Math.round(stepsPercentage)}%`.padEnd(4, ' '),
    whiteSpace: 'pre'
  });

  wrapper.appendChild(activeMinPercentLabel);
  wrapper.appendChild(stepsPercentLabel);

  // Add "Daily goals" centered text overlay
  const dailyGoalsLabel = document.createElement('div');
  dailyGoalsLabel.style.position = 'absolute';
  dailyGoalsLabel.style.left = '50%';
  dailyGoalsLabel.style.top = '50%';
  dailyGoalsLabel.style.transform = 'translate(-50%, -50%)';
  dailyGoalsLabel.style.fontSize = FontSizes.M;
  dailyGoalsLabel.style.color = theme.text.muted;
  dailyGoalsLabel.style.fontWeight = '700';
  dailyGoalsLabel.style.letterSpacing = '0.3em';
  dailyGoalsLabel.style.textTransform = 'uppercase';
  dailyGoalsLabel.style.zIndex = '1000';
  dailyGoalsLabel.style.pointerEvents = 'none';
  dailyGoalsLabel.textContent = 'Daily goals';

  // wrapper.appendChild(dailyGoalsLabel);

  // Single Gauge Container for both metrics
  const gaugeContainer = document.createElement('div');
  gaugeContainer.style.width = '100%';
  gaugeContainer.style.height = SECTION_HEIGHT + 'px';
  gaugeContainer.id = 'gauge-nested-' + Date.now() + '-' + Math.random();
  gaugeContainer.style.paddingLeft = '24px';
  gaugeContainer.style.paddingRight = '24px';
  gaugeContainer.style.boxSizing = 'border-box';

  wrapper.appendChild(gaugeContainer);
  section.appendChild(wrapper);

  // Initialize gauges after DOM is ready and ECharts is loaded
  const initializeGauges = () => {
    if (typeof echarts === 'undefined') {
      console.warn('[MMM-tractive] ECharts not loaded yet, retrying...');
      setTimeout(initializeGauges, 500);
      return;
    }

    console.log('[MMM-tractive] Initializing nested ECharts gauges');

    try {
      const chart = echarts.init(gaugeContainer, 'dark');
      
      // HACK: ECharts doesn't support rounded caps on the axisLine (background track)
      // So we layer two gauge series: one with 100% (background) and one with actual data (foreground)
      // This creates the visual effect of rounded gauge backgrounds while the data overlays on top
      const createGaugeSeries = (gaugeData, color, animation = true, thickness = 40, radius = '75%', showDetail = false) => ({
        type: 'gauge',
        center: ['50%', '50%'],
        radius: radius,
        startAngle: 90,
        endAngle: -180,
        animation: animation,
        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          width: thickness,
          itemStyle: {
            borderWidth: 0,
            borderColor: theme.backgroundLighter
          }
        },
        axisLine: {
          lineStyle: {
            color: [[1, theme.backgroundLighter]],
            width: thickness
          }
        },
        splitLine: {
          show: false,
          distance: 0,
          length: 10
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        data: gaugeData.map(item => ({
          ...item,
          itemStyle: { color }
        })),
        title: {
          fontSize: 16,
          color: theme.text.secondary,
          fontWeight: '600',
          formatter: 'Daily goals'
        },
        detail: {
          show: false
        }
      });

      const backgroundData = [
        { value: 100, name: '', title: { show: false } }
      ];

      const dataData = [
        { value: Math.min(Math.round(activityPercentage), 100), name: '', title: { show: false } }
      ];

      const stepsBackgroundData = [
        { value: 100, name: '', title: { show: false } }
      ];

      const stepsDataData = [
        { value: Math.min(Math.round(stepsPercentage), 100), name: '', title: { show: false } }
      ];


      const option = {
        backgroundColor: 'transparent',
          series: [
            createGaugeSeries(backgroundData, theme.backgroundLighter, false, GAUGE_RADIUS, GAUGE_RADIUS_1 +'px'),
            createGaugeSeries(dataData, theme.accent, true, GAUGE_RADIUS, GAUGE_RADIUS_1 +'px', true),
            createGaugeSeries(stepsBackgroundData, theme.backgroundLighter, false, GAUGE_RADIUS, GAUGE_RADIUS_2 + 'px'),
            createGaugeSeries(stepsDataData, theme.accent, true, GAUGE_RADIUS, GAUGE_RADIUS_2 + 'px', true)
          ]
      };

      chart.setOption(option);
      window.addEventListener('resize', () => chart.resize());
      
      // Show labels when chart is initialized
      activeMinLabel.style.opacity = '1';
      stepsLabel.style.opacity = '1';
      activeMinPercentLabel.style.opacity = '1';
      stepsPercentLabel.style.opacity = '1';
    } catch (error) {
      console.error('[MMM-tractive] Error initializing gauges:', error);
    }
  };

  // Wait for ECharts to load
  setTimeout(initializeGauges, 1000);

  // Add method to fade out labels
  section.fadeOutLabels = () => {
    activeMinLabel.style.opacity = '0';
    stepsLabel.style.opacity = '0';
    activeMinPercentLabel.style.opacity = '0';
    stepsPercentLabel.style.opacity = '0';
  };

  return section;
}

/**
 * Create Health Status Gauges Section - Three concentric circular gauges (120° each)
 * Displays as three separate rings stacked visually as one full circle
 * @param {string} heartRateStatus - Heart rate status: 'NORMAL', 'ALERT', or null/undefined
 * @param {number} alertsCount - Health alerts count (null/0 = normal, > 0 = alert)
 * @param {string} respiratoryStatus - Respiratory rate status: 'NORMAL', 'ALERT', or null/undefined
 */
function createHealthStatusGaugeSection(heartRateStatus, alertsCount, respiratoryStatus) {
  // Convert statuses to percentages: 100% if status defined (NORMAL or ALERT), 0% if null/undefined
  const heartRatePercentage = heartRateStatus != null ? 100 : 0;
  const healthAlertPercentage = alertsCount != null ? 100 : 0;
  const respiratoryRatePercentage = respiratoryStatus != null ? 100 : 0;
  
  // Determine colors based on status (matching createHealthStatus in createMetricsRow)
  const getHeartRateColor = (status) => {
    if (status === 'ALERT') return theme.status.alert;      // Red
    if (status === 'NORMAL') return theme.status.normal;    // Green
    return theme.status.unknown;                             // Gray for undefined
  };
  
  const getHealthAlertColor = (count) => {
    if (count != null && count > 0) return theme.status.alert;  // Red when alerts
    if (count != null && count === 0) return theme.status.normal; // Green when no alerts
    return theme.status.unknown;                                  // Gray for undefined
  };
  
  const getRespiratoryColor = (status) => {
    if (status === 'ALERT') return theme.status.alert;       // Red
    if (status === 'NORMAL') return theme.status.normal;     // Green
    return theme.status.unknown;                              // Gray for undefined
  };
  
  const heartRateColor = getHeartRateColor(heartRateStatus);
  const healthAlertColor = getHealthAlertColor(alertsCount);
  const respiratoryRateColor = getRespiratoryColor(respiratoryStatus);
  const SECTION_HEIGHT = 580;
  const GAUGE_RADIUS = 8;
  const MAX_GAUGE_RADIUS = SECTION_HEIGHT - 80;
  
  // Gauge arc configuration
  const GAUGE_ARC = 120;        // Total arc per gauge (including gap)
  const GAUGE_GAP = 6;          // Gap between gauges in degrees
  const GAUGE_ARC_SIZE = GAUGE_ARC - GAUGE_GAP;  // Actual visible arc size
  
  // Grid configuration
  const GRID_COLS = 45;
  const GRID_ROWS = 45;
  
  // Icon positioning (grid coordinates)
  const ICON1_COL = 34;
  const ICON1_ROW = 14;
  const ICON2_COL = 23;
  const ICON2_ROW = 45;
  const ICON3_COL = 12;
  const ICON3_ROW = 14;

  const section = document.createElement('section');
  section.style.display = 'flex';
  section.style.width = '100%';
  section.style.maxWidth = '1200px';
  section.style.marginLeft = 'auto';
  section.style.marginRight = 'auto';
  section.style.paddingLeft = '0px';
  section.style.paddingRight = '0px';
  section.style.justifyContent = 'center';
  section.style.alignItems = 'center';
  section.style.position = 'relative';
  section.style.overflow = 'visible';

  // Wrapper for gauge
  const wrapper = document.createElement('div');
  wrapper.style.width = '100%';
  wrapper.style.position = 'relative';
  wrapper.style.height = SECTION_HEIGHT + 'px';
  wrapper.style.overflow = 'visible';
  wrapper.style.display = 'grid';
  wrapper.style.gridTemplateColumns = `repeat(${GRID_COLS}, 1fr)`;
  wrapper.style.gridTemplateRows = `repeat(${GRID_ROWS}, 1fr)`;
  wrapper.style.alignItems = 'stretch';
  wrapper.style.justifyItems = 'stretch';

  // Gauge Container for heart rate metric
  const gaugeContainer = document.createElement('div');
  gaugeContainer.style.width = '100%';
  gaugeContainer.style.height = SECTION_HEIGHT + 'px';
  gaugeContainer.id = 'gauge-heartrate-' + Date.now() + '-' + Math.random();
  gaugeContainer.style.paddingLeft = '24px';
  gaugeContainer.style.paddingRight = '24px';
  gaugeContainer.style.boxSizing = 'border-box';
  gaugeContainer.style.position = 'absolute';
  gaugeContainer.style.inset = '0';

  // Debug grid overlay (8x8)
  const debugGrid = document.createElement('div');
  debugGrid.style.position = 'absolute';
  debugGrid.style.width = '100%';
  debugGrid.style.height = SECTION_HEIGHT + 'px';
  debugGrid.style.display = 'grid';
  debugGrid.style.gridTemplateColumns = `repeat(${GRID_COLS}, 1fr)`;
  debugGrid.style.gridTemplateRows = `repeat(${GRID_ROWS}, 1fr)`;
  debugGrid.style.gap = '0';
  debugGrid.style.zIndex = '200';
  debugGrid.style.pointerEvents = 'none';
  debugGrid.style.left = '0';
  debugGrid.style.top = '0';

  // Create grid cells
  for (let i = 0; i < GRID_COLS * GRID_ROWS; i++) {
    const cell = document.createElement('div');
    // cell.style.border = '1px solid red';
    cell.style.opacity = '0.3';
    debugGrid.appendChild(cell);
  }

  wrapper.appendChild(debugGrid);

  // Helper to calculate grid cell center position
  const getGridCellCenter = (col, row) => {
    const cellWidth = 100 / GRID_COLS;
    const cellHeight = 100 / GRID_ROWS;
    const centerX = cellWidth * (col - 0.5);
    const centerY = cellHeight * (row - 0.5);
    return { centerX, centerY };
  };

  // Heart rate icon overlay
  const icon1Center = getGridCellCenter(ICON1_COL, ICON1_ROW);
  const icon1Overlay = document.createElement('div');
  icon1Overlay.style.position = 'absolute';
  icon1Overlay.style.left = icon1Center.centerX + '%';
  icon1Overlay.style.top = icon1Center.centerY + '%';
  icon1Overlay.style.transform = 'translate(-50%, -50%)';
  icon1Overlay.style.display = 'flex';
  icon1Overlay.style.alignItems = 'center';
  icon1Overlay.style.justifyContent = 'center';
  icon1Overlay.style.zIndex = '100';
  icon1Overlay.style.pointerEvents = 'none';
  icon1Overlay.appendChild(createMaterialIcon('ecg_heart', IconSizes.L, theme.status.normal));

  const icon2Center = getGridCellCenter(ICON2_COL, ICON2_ROW);
  const icon2Overlay = document.createElement('div');
  icon2Overlay.style.position = 'absolute';
  icon2Overlay.style.left = icon2Center.centerX + '%';
  icon2Overlay.style.top = icon2Center.centerY + '%';
  icon2Overlay.style.transform = 'translate(-50%, -50%)';
  icon2Overlay.style.display = 'flex';
  icon2Overlay.style.alignItems = 'center';
  icon2Overlay.style.justifyContent = 'center';
  icon2Overlay.style.zIndex = '100';
  icon2Overlay.style.pointerEvents = 'none';
  icon2Overlay.appendChild(createMaterialIcon('respiratory_rate', IconSizes.L, theme.status.normal));

  const icon3Center = getGridCellCenter(ICON3_COL, ICON3_ROW);
  const icon3Overlay = document.createElement('div');
  icon3Overlay.style.position = 'absolute';
  icon3Overlay.style.left = icon3Center.centerX + '%';
  icon3Overlay.style.top = icon3Center.centerY + '%';
  icon3Overlay.style.transform = 'translate(-50%, -50%)';
  icon3Overlay.style.display = 'flex';
  icon3Overlay.style.alignItems = 'center';
  icon3Overlay.style.justifyContent = 'center';
  icon3Overlay.style.zIndex = '100';
  icon3Overlay.style.pointerEvents = 'none';
  icon3Overlay.appendChild(createMaterialIcon('health_metrics', IconSizes.L, theme.status.normal));

  wrapper.appendChild(gaugeContainer);
  wrapper.appendChild(icon1Overlay);
  wrapper.appendChild(icon2Overlay);
  wrapper.appendChild(icon3Overlay);
  section.appendChild(wrapper);

  // Initialize heart rate gauge after DOM is ready and ECharts is loaded
  const initializeHeartRateGauge = () => {
    if (typeof echarts === 'undefined') {
      console.warn('[MMM-tractive] ECharts not loaded yet for heart rate gauge, retrying...');
      setTimeout(initializeHeartRateGauge, 500);
      return;
    }

    console.log('[MMM-tractive] Initializing heart rate gauge (full circle)');

    try {
      const chart = echarts.init(gaugeContainer, 'dark');

      const createGaugeSeries = (gaugeData, color, animation = true, thickness = 40, radius = '50%', startAngle = 90, endAngle = -30) => ({
        type: 'gauge',
        center: ['50%', '50%'],
        radius: radius,
        startAngle: startAngle,
        endAngle: endAngle,
        animation: animation,
        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          width: thickness,
          itemStyle: {
            borderWidth: 0,
            borderColor: theme.backgroundLighter
          }
        },
        axisLine: {
          lineStyle: {
            color: [[1, theme.backgroundLighter]],
            width: thickness
          }
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        data: gaugeData.map(item => ({
          ...item,
          itemStyle: { color }
        })),
        detail: {
          show: false
        }
      });

      const backgroundData = [
        { value: 100, name: '' }
      ];

      const heartRateData = [
        { value: Math.min(Math.round(heartRatePercentage), 100), name: '' }
      ];

      const healthAlertData = [
        { value: Math.min(Math.round(healthAlertPercentage), 100), name: '' }
      ];

      const respiratoryRateData = [
        { value: Math.min(Math.round(respiratoryRatePercentage), 100), name: '' }
      ];

      const gaugeRadius = (MAX_GAUGE_RADIUS / 2) - (GAUGE_RADIUS / 2);

      // Gauge 1: Heart Rate (0-120 degrees, top-right)
      // Gauge 2: Health Alert (120-240 degrees, bottom)
      // Gauge 3: Respiratory Rate (240-360 degrees, top-left)

      // Build series array - always show backgrounds, conditionally show data rings
      const seriesArray = [
        // Background rings (always shown)
        createGaugeSeries(backgroundData, theme.backgroundLighter, false, GAUGE_RADIUS, gaugeRadius + 'px', 90, 90 - GAUGE_ARC_SIZE),
        createGaugeSeries(backgroundData, theme.backgroundLighter, false, GAUGE_RADIUS, gaugeRadius + 'px', 90 - GAUGE_ARC, (90 - GAUGE_ARC) - GAUGE_ARC_SIZE),
        createGaugeSeries(backgroundData, theme.backgroundLighter, false, GAUGE_RADIUS, gaugeRadius + 'px', 90 - (GAUGE_ARC * 2), (90 - (GAUGE_ARC * 2)) - GAUGE_ARC_SIZE)
      ];

      // Data rings (only if percentage > 0)
      if (heartRatePercentage > 0) {
        seriesArray.push(createGaugeSeries(heartRateData, heartRateColor, true, GAUGE_RADIUS, gaugeRadius + 'px', 90, 90 - GAUGE_ARC_SIZE));
      }
      if (healthAlertPercentage > 0) {
        seriesArray.push(createGaugeSeries(healthAlertData, healthAlertColor, true, GAUGE_RADIUS, gaugeRadius + 'px', 90 - GAUGE_ARC, (90 - GAUGE_ARC) - GAUGE_ARC_SIZE));
      }
      if (respiratoryRatePercentage > 0) {
        seriesArray.push(createGaugeSeries(respiratoryRateData, respiratoryRateColor, true, GAUGE_RADIUS, gaugeRadius + 'px', 90 - (GAUGE_ARC * 2), (90 - (GAUGE_ARC * 2)) - GAUGE_ARC_SIZE));
      }

      const option = {
        backgroundColor: 'transparent',
        series: seriesArray
      };

      chart.setOption(option);
      window.addEventListener('resize', () => chart.resize());
    } catch (error) {
      console.error('[MMM-tractive] Error initializing heart rate gauge:', error);
    }
  };

  // Wait for ECharts to load
  setTimeout(initializeHeartRateGauge, 1000);

  return section;
}

/**
 * Create loading screen
 */
function createLoadingScreen(onRefreshClick) {
  const loading = document.createElement('div');
  loading.style.display = 'flex';
  loading.style.flexDirection = 'column';
  loading.style.alignItems = 'center';
  loading.style.justifyContent = 'center';
  loading.style.height = '100vh';
  loading.style.gap = '24px';

  const icon = document.createElement('span');
  icon.className = 'material-symbols-outlined loading-icon';
  icon.textContent = 'pets';
  icon.style.cursor = 'pointer';
  icon.addEventListener('click', onRefreshClick);
  icon.addEventListener('mouseover', () => {
    icon.style.transform = 'scale(1.05)';
  });
  icon.addEventListener('mouseout', () => {
    icon.style.transform = 'scale(1)';
  });

  loading.appendChild(icon);
  return loading;
}

/**
 * Create Material Symbol icon
 */
function createMaterialIcon(iconName, size = IconSizes.M, color = theme.accent) {
  const span = document.createElement('span');
  span.className = 'material-symbols-outlined';
  span.style.fontSize = size;
  span.style.color = color;
  span.setAttribute('data-icon', iconName);
  span.textContent = iconName;
  return span;
}

/**
 * Get battery icon name based on percentage
 * Maps 0-100% to battery_android_frame_1 through battery_android_frame_6
 * Shows battery_android_frame_full when at 100%
 * @param {number} percent - Battery percentage (0-100)
 * @returns {string} Icon name
 */
function getBatteryIconName(percent) {
  if (percent == null) return 'battery_android_question';
  if (percent <= 16) return 'battery_android_frame_1';
  if (percent <= 33) return 'battery_android_frame_2';
  if (percent <= 50) return 'battery_android_frame_3';
  if (percent <= 66) return 'battery_android_frame_4';
  if (percent <= 83) return 'battery_android_frame_5';
  if (percent <= 95) return 'battery_android_frame_6';
  return 'battery_android_frame_6';
}

/**
 * Get battery color based on percentage
 * @param {number} percent - Battery percentage (0-100)
 * @returns {string} Hex color code
 */
function getBatteryColor(percent) {
  if (percent == null) return theme.text.muted;
  if (percent <= 10) return theme.battery.critical;
  if (percent <= 25) return theme.battery.low;
  return theme.battery.good;
}

/**
 * Format date to date and time string (e.g. "Apr 5, 10:30 AM")
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date and time string
 */
function formatRelativeTime(date) {
  if (!date) return 'Unknown';
  
  // Convert to Date if it's a string or number
  let dateObj = date instanceof Date ? date : new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Unknown';
  }
  
  const options = { 
    month: 'short', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  };
  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Calculate days until next birthday
 * @param {string} birthdayDate - Birthday in format 'YYYY-MM-DD'
 * @returns {number} Days until next birthday
 */
function daysTilBirthday(birthdayDate) {
  if(!birthdayDate) return '---';
  const today = new Date();
  const birthday = new Date(birthdayDate);
  let nextBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
  
  if (today > nextBirthday) {
    nextBirthday = new Date(today.getFullYear() + 1, birthday.getMonth(), birthday.getDate());
  }
  
  const diff = nextBirthday - today;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}

/**
 * Create a control action button (refresh, light, sound, etc.)
 * @param {string} icon - Initial Material Symbol icon name
 * @param {string} title - Button tooltip
 * @param {boolean} disabled - Whether the button is disabled
 * @param {Function} onClickHandler - Callback function on button click
 * @returns {HTMLElement} Button element
 */
function createActionButton(icon, title, disabled, onClickHandler) {
  const btn = document.createElement('button');
  btn.style.width = '56px';
  btn.style.height = '56px';
  btn.style.backgroundColor = disabled ? theme.text.muted : theme.accent;
  btn.style.color = theme.accentDark;
  btn.style.border = 'none';
  btn.style.borderRadius = '50%';
  btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
  btn.style.display = 'flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';
  btn.style.transition = 'all 0.2s ease';
  btn.style.boxShadow = disabled ? 'none' : `0 0 60px ${theme.overlay.accentLighter}`;
  btn.style.opacity = disabled ? '0.5' : '1';
  btn.title = title;
  btn.disabled = disabled;

  const btnIcon = createMaterialIcon(icon, IconSizes.S, theme.accentDark);
  btn.appendChild(btnIcon);

  btn.addEventListener('mouseover', () => {
    if (!disabled) {
      btn.style.transform = 'scale(1.1)';
    }
  });
  btn.addEventListener('mouseout', () => {
    if (!disabled) {
      btn.style.transform = 'scale(1)';
    }
  });
  btn.addEventListener('click', () => {
    if (!disabled) {
      onClickHandler(btn, btnIcon);
    }
  });

  return btn;
}

/**
 * Create Health Status Display with icon and text
 * @param {string} icon - Material Symbol icon name
 * @param {string} text - Display text
 * @param {string} status - Status type: 'NORMAL' (green), 'WARNING' (orange), 'ALERT' (red), 'UNKNOWN' (neutral)
 * @returns {HTMLElement} Container with icon and text
 */
function createHealthStatus(icon, text, status = 'UNKNOWN') {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'row';
  container.style.alignItems = 'flex-start';
  container.style.gap = '8px';
  container.style.textAlign = 'left';
  container.style.flex = '1';

  // Map status to color
  const statusColors = {
    'NORMAL': theme.status.normal,
    'WARNING': theme.status.warning,
    'ALERT': theme.status.alert,
    'UNKNOWN': theme.status.unknown,
  };

  const color = statusColors[status] || statusColors['UNKNOWN'];

  // Create icon
  const iconElement = createMaterialIcon(icon, IconSizes.M, color);
  container.appendChild(iconElement);

  // Create text
  const textElement = document.createElement('p');
  textElement.style.fontSize = FontSizes.S;
  textElement.style.fontWeight = '700';
  textElement.style.color = color;
  textElement.style.margin = '0';
  textElement.style.textAlign = 'left';
  textElement.textContent = text;
  container.appendChild(textElement);

  return container;
}

/**
 * Create Top Header
 */
function createHeader(lastUpdated, batteryLevel, isCharging, batterySaveMode) {

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'flex-start';
  header.style.paddingLeft = '24px';
  header.style.paddingRight = '24px';
  header.style.paddingTop = '16px';
  header.style.paddingBottom = '16px';
  header.style.zIndex = '50';
  header.style.gap = '24px';

  // Left: Battery Zone
  const leftDiv = document.createElement('div');
  leftDiv.style.display = 'flex';
  leftDiv.style.alignItems = 'center';
  leftDiv.style.gap = '12px';

  // Battery badge
  const batteryBadge = document.createElement('div');
  batteryBadge.style.display = 'flex';
  batteryBadge.style.alignItems = 'center';
  batteryBadge.style.gap = '12px';

  // Energy Savings Leaf icon if battery save mode is on
  if (batterySaveMode != null && batterySaveMode) {
    const energyIcon = createMaterialIcon('energy_savings_leaf', IconSizes.L, theme.status.normal);
    batteryBadge.appendChild(energyIcon);
  }

  // Display charging icon if charging, otherwise battery frame icon
  if (isCharging) {
    const chargingIcon = createMaterialIcon('battery_android_frame_bolt', IconSizes.L, theme.accent);
    batteryBadge.appendChild(chargingIcon);
  } else {
    const batteryIconName = getBatteryIconName(batteryLevel);
    const batteryColor = getBatteryColor(batteryLevel);
    const batteryIcon = createMaterialIcon(batteryIconName, IconSizes.L, batteryColor);
    batteryBadge.appendChild(batteryIcon);
  }

  const batteryPercent = document.createElement('span');

  const batteryPercentValue = document.createElement('span');
  batteryPercentValue.style.fontSize = FontSizes.L;
  batteryPercentValue.style.fontWeight = '700';
  batteryPercentValue.style.color = theme.text.primary;
  batteryPercentValue.textContent = batteryLevel != null ? `${batteryLevel}` : '--';

  const batteryPercentUnit = document.createElement('span');
  batteryPercentUnit.style.fontSize = FontSizes.S;
  batteryPercentUnit.style.fontWeight = '700';
  batteryPercentUnit.style.color = theme.text.primary;
  batteryPercentUnit.textContent = '%';

  batteryPercent.appendChild(batteryPercentValue);
  batteryPercent.appendChild(batteryPercentUnit);

  batteryBadge.appendChild(batteryPercent);

  leftDiv.appendChild(batteryBadge);

  // Right: Status badges
  const rightDiv = document.createElement('div');
  rightDiv.style.display = 'flex';
  rightDiv.style.alignItems = 'center';
  rightDiv.style.gap = '12px';

  // Time container - last updated display
  const timeContainer = document.createElement('div');
  timeContainer.style.display = 'flex';
  timeContainer.style.alignItems = 'center';
  timeContainer.style.gap = '8px';
  timeContainer.style.backgroundColor = theme.overlay.subtle;
  timeContainer.style.backdropFilter = 'blur(12px)';
  timeContainer.style.paddingLeft = '12px';
  timeContainer.style.paddingRight = '12px';
  timeContainer.style.paddingTop = '8px';
  timeContainer.style.paddingBottom = '8px';
  timeContainer.style.borderRadius = '999px';
  timeContainer.style.border = `1px solid ${theme.overlay.light}`;

  const scheduleIcon = createMaterialIcon('schedule', '20px', theme.accent);
  const timeText = document.createElement('span');
  timeText.style.fontSize = '14px';
  timeText.style.fontWeight = '600';
  timeText.style.color = theme.text.secondary;
  timeText.textContent = lastUpdated ? `Updated ${formatRelativeTime(lastUpdated)}` : 'Unknown last update time';

  timeContainer.appendChild(scheduleIcon);
  timeContainer.appendChild(timeText);
  rightDiv.appendChild(timeContainer);

  header.appendChild(leftDiv);
  header.appendChild(rightDiv);

  return header;
}

function createBatterySection(batteryLevel, isCharging, batterySaveMode) {
  // Battery Zone
  const batteryDiv = document.createElement('div');
  batteryDiv.style.display = 'flex';
  batteryDiv.style.flexDirection = 'column';
  batteryDiv.style.alignItems = 'center';
  batteryDiv.style.gap = '8px';

  const batteryLabel = document.createElement('span');
  batteryLabel.style.fontSize = FontSizes.S;
  batteryLabel.style.fontWeight = '700';
  batteryLabel.style.letterSpacing = '0.4em';
  batteryLabel.style.color = theme.text.muted;
  batteryLabel.style.textTransform = 'uppercase';
  batteryLabel.textContent = 'BATTERY';

    // Battery badge
  const batteryBadge = document.createElement('div');
  batteryBadge.style.display = 'flex';
  batteryBadge.style.alignItems = 'center';
  batteryBadge.style.gap = '12px';

    // Energy Savings Leaf icon if battery save mode is on
  if (batterySaveMode != null &&batterySaveMode) {
    const energyIcon = createMaterialIcon('energy_savings_leaf', IconSizes.L, theme.status.normal);
    batteryBadge.appendChild(energyIcon);
  }

  // Display charging icon if charging, otherwise battery frame icon
  if (isCharging) {
    const chargingIcon = createMaterialIcon('battery_android_frame_bolt', IconSizes.L, theme.accent);
    batteryBadge.appendChild(chargingIcon);
  } else {
    const batteryIconName = getBatteryIconName(batteryLevel);
    const batteryColor = getBatteryColor(batteryLevel);
    const batteryIcon = createMaterialIcon(batteryIconName, IconSizes.L, batteryColor);
    batteryBadge.appendChild(batteryIcon);
  }

  const batteryPercent = document.createElement('span');

  const batteryPercentValue = document.createElement('span');
  batteryPercentValue.style.fontSize = FontSizes.L;
  batteryPercentValue.style.fontWeight = '700';
  batteryPercentValue.style.color = theme.text.primary;
  batteryPercentValue.textContent = batteryLevel != null ? `${batteryLevel}` : '--';

  const batteryPercentUnit = document.createElement('span');
  batteryPercentUnit.style.fontSize = FontSizes.S;
  batteryPercentUnit.style.fontWeight = '700';
  batteryPercentUnit.style.color = theme.text.primary;
  batteryPercentUnit.textContent = '%';

  batteryPercent.appendChild(batteryPercentValue);
  batteryPercent.appendChild(batteryPercentUnit);

  batteryBadge.appendChild(batteryPercent);

  batteryDiv.appendChild(batteryLabel);
  batteryDiv.appendChild(batteryBadge);

  return batteryDiv;

}

/**
 * Create Profile Section
 */
function createProfileSection(dogName, onClickHandler) {
  const section = document.createElement('section');
  section.style.display = 'flex';
  section.style.flexDirection = 'column';
  section.style.alignItems = 'center';
  // section.style.gap = '64px';
  section.style.position = 'relative';
  // section.style.paddingTop = '24px';

  // Image container with glow
  const imgWrapper = document.createElement('div');
  imgWrapper.style.position = 'relative';

  // Glow effect background
  const glowBg = document.createElement('div');
  glowBg.style.position = 'absolute';
  glowBg.style.inset = '0';
  glowBg.style.width = '320px';
  glowBg.style.height = '320px';
  glowBg.style.background = `radial-gradient(circle, ${theme.overlay.accentLight} 0%, transparent 70%)`;
  glowBg.style.borderRadius = '50%';
  glowBg.style.filter = 'blur(100px)';
  glowBg.style.transform = 'scale(1.5)';
  glowBg.style.zIndex = '0';
  glowBg.style.opacity = '0.4';

  // Image with border
  const imgContainer = document.createElement('div');
  imgContainer.style.position = 'relative';
  imgContainer.style.zIndex = '10';
  imgContainer.style.borderRadius = '50%';
  imgContainer.style.overflow = 'hidden';
  imgContainer.style.border = `8px solid ${theme.backgroundLight}`;
  imgContainer.style.boxShadow = `0 20px 48px ${theme.overlay.dark}`;
  imgContainer.style.width = '420px';
  imgContainer.style.height = '420px';
  imgContainer.style.display = 'flex';
  imgContainer.style.alignItems = 'center';
  imgContainer.style.justifyContent = 'center';
  imgContainer.style.cursor = 'pointer';
  imgContainer.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';

  // Add click handler
  if (onClickHandler) {
    imgContainer.addEventListener('click', onClickHandler);
    imgContainer.addEventListener('mouseover', () => {
      imgContainer.style.transform = 'scale(1.05)';
      imgContainer.style.boxShadow = `0 20px 48px ${theme.overlay.dark}, 0 0 40px ${theme.overlay.accentLight}`;
    });
    imgContainer.addEventListener('mouseout', () => {
      imgContainer.style.transform = 'scale(1)';
      imgContainer.style.boxShadow = `0 20px 48px ${theme.overlay.dark}`;
    });
  }

  const img = document.createElement('img');
  img.src = '/modules/MMM-tractive/pet_picture.jpeg';
  img.alt = dogName ? dogName : '---';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  img.style.display = 'block';

  imgContainer.appendChild(img);
  imgWrapper.appendChild(glowBg);
  imgWrapper.appendChild(imgContainer);
  section.appendChild(imgWrapper);

  // Name and controls
  const nameSection = document.createElement('div');
  nameSection.style.display = 'flex';
  nameSection.style.flexDirection = 'column';
  nameSection.style.alignItems = 'center';
  nameSection.style.gap = '32px';
  nameSection.style.zIndex = '20';

  const name = document.createElement('h2');
  name.style.fontSize = FontSizes.XXL;
  name.style.fontWeight = '700';
  name.style.color = theme.text.primary;
  name.style.margin = '0';
  name.style.letterSpacing = '-0.02em';
  name.textContent = dogName || 'Loading...';
  console.log('Name element set to:', name.textContent, 'dogName:', dogName);

  nameSection.appendChild(name);

  // section.appendChild(nameSection);

  return section;
}

/**
 * Refresh button callback - refreshes data from API
 */
function onRefreshClick(btn, icon) {
  icon.style.animation = 'none';
  setTimeout(() => {
    icon.style.animation = 'spin 0.6s linear';
  }, 10);
}

/**
 * Light toggle button callback - toggles flashlight on/off
 */
function onLightToggleClick(btn, icon, state) {
  state.lightOn = !state.lightOn;
  btn.style.backgroundColor = state.lightOn ? theme.accent : theme.text.muted;
  icon.textContent = state.lightOn ? 'flashlight_off' : 'flashlight_on';
}

/**
 * Sound toggle button callback - toggles sound on/off
 */
function onSoundToggleClick(btn, icon, state) {
  state.soundOn = !state.soundOn;
  btn.style.backgroundColor = state.soundOn ? theme.accent : theme.text.muted;
  icon.textContent = state.soundOn ? 'volume_up' : 'volume_off';
}

function createControlsSection(onRefreshClick, onLightToggleClick, lightToggleInProgress, onSoundToggleClick, soundToggleInProgress) {
  const controlsRow = document.createElement('div');
  controlsRow.style.display = 'flex';
  controlsRow.style.alignItems = 'center';
  controlsRow.style.justifyContent = 'center';
  controlsRow.style.gap = '32px';

  // Refresh button
  const refreshBtn = createActionButton('sync', 'Refresh data', false, (btn, icon) => {
    onRefreshClick();
  });
  controlsRow.appendChild(refreshBtn);

  // Light toggle button
  const lightBtn = createActionButton('flashlight_off', 'Toggle light', lightToggleInProgress, (btn, icon) => {
    onLightToggleClick();
  });
  controlsRow.appendChild(lightBtn);

  // Sound toggle button
  const soundBtn = createActionButton('volume_up', 'Toggle sound', soundToggleInProgress, (btn, icon) => {
    onSoundToggleClick();
  });
  controlsRow.appendChild(soundBtn);

  return controlsRow;
}

/**
 * Create Status Row (Birthday / Battery)
 */
function createStatusRow(birthday, batteryLevel, isCharging, batterySaveMode) {
  const section = document.createElement('section');
  // section.style.width = '100%';
  section.style.display = 'grid';
  section.style.gridTemplateColumns = '1fr auto 1fr';
  section.style.gap = '0 48px';
  section.style.paddingLeft = '24px';
  section.style.paddingRight = '24px';
  section.style.margin = '48px 0 0 0 ';
  section.style.textAlign = 'center';

  // Separator divider
  const divider = document.createElement('div');
  divider.style.width = '1px';
  divider.style.background = `linear-gradient(to bottom, transparent, ${theme.overlay.light}, transparent)`;
  divider.style.alignSelf = 'stretch';
  divider.style.margin = '8px 0';

  section.appendChild(createBirthdaySection(birthday));
  section.appendChild(divider);
  section.appendChild(createBatterySection(batteryLevel, isCharging, batterySaveMode));

  return section;
}

function createBirthdaySection(birthdayDate) {
  const birthdayDiv = document.createElement('div');
  birthdayDiv.style.display = 'flex';
  birthdayDiv.style.flexDirection = 'column';
  birthdayDiv.style.alignItems = 'center';
  birthdayDiv.style.gap = '8px';

  const birthdayLabel = document.createElement('span');
  birthdayLabel.style.fontSize = FontSizes.S;
  birthdayLabel.style.fontWeight = '700';
  birthdayLabel.style.letterSpacing = '0.4em';
  birthdayLabel.style.color = theme.text.muted;
  birthdayLabel.style.textTransform = 'uppercase';
  birthdayLabel.textContent = 'Birthday';

  const birthdayContainer = document.createElement('div');
  birthdayContainer.style.display = 'flex';
  birthdayContainer.style.alignItems = 'center';
  birthdayContainer.style.gap = '8px';
  birthdayContainer.style.marginTop = '8px';

  const cakeIcon = createMaterialIcon('cake', IconSizes.M);
  const daysUntil = daysTilBirthday(birthdayDate);
  const birthdayText = document.createElement('span');
  birthdayText.style.fontSize = FontSizes.L;
  birthdayText.style.fontWeight = '600';
  birthdayText.style.color = theme.text.primary;
  birthdayText.textContent = `in ${daysUntil} days`;

  birthdayContainer.appendChild(cakeIcon);
  birthdayContainer.appendChild(birthdayText);

  birthdayDiv.appendChild(birthdayLabel);
  birthdayDiv.appendChild(birthdayContainer);

  return birthdayDiv;
}

/**
 * Create large Activity Ring Section
 */
function createActivitySection(activityMinutes, activityGoal) {
  const activityRingScale = 1.5; // Scale factor for the activity ring and text

  const section = document.createElement('section');
  section.style.display = 'flex';
  section.style.flexDirection = 'column';
  section.style.alignItems = 'center';
  section.style.justifyContent = 'center';
  section.style.gap = '48px';
  // section.style.width = '100%';
  section.style.flex = '1';

  const scale = activityRingScale;
  const ringContainerSize = 360 * scale;
  const svgSize = 320 * scale;
  const radius = 140 * scale;
  const svgCenter = svgSize / 2;

  // SVG Ring Container
  const ringContainer = document.createElement('div');
  ringContainer.style.position = 'relative';
  ringContainer.style.display = 'flex';
  ringContainer.style.alignItems = 'center';
  ringContainer.style.justifyContent = 'center';
  ringContainer.style.width = `${ringContainerSize}px`;
  ringContainer.style.height = `${ringContainerSize}px`;

  const percentage = activityMinutes != null && activityGoal != null ? (activityMinutes / activityGoal) * 100 : 0;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - Math.min((percentage / 100) * circumference, circumference);

  // Create SVG for perfect ring
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', svgSize);
  svg.setAttribute('height', svgSize);
  svg.setAttribute('viewBox', `0 0 ${svgSize} ${svgSize}`);
  svg.style.position = 'absolute';
  svg.style.filter = `drop-shadow(0 0 40px ${theme.overlay.accentLighter})`;

  // Background circle
  const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  bgCircle.setAttribute('cx', svgCenter);
  bgCircle.setAttribute('cy', svgCenter);
  bgCircle.setAttribute('r', radius);
  bgCircle.setAttribute('fill', 'none');
  bgCircle.setAttribute('stroke', theme.backgroundLighter);
  bgCircle.setAttribute('stroke-width', 20 * scale);
  bgCircle.setAttribute('stroke-linecap', 'round');

  // Progress circle with dash animation
  const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  progressCircle.setAttribute('cx', svgCenter);
  progressCircle.setAttribute('cy', svgCenter);
  progressCircle.setAttribute('r', radius);
  progressCircle.setAttribute('fill', 'none');
  progressCircle.setAttribute('stroke', theme.accent);
  progressCircle.setAttribute('stroke-width', 20 * scale);
  progressCircle.setAttribute('stroke-dasharray', circumference);
  progressCircle.setAttribute('stroke-dashoffset', strokeDashoffset);
  progressCircle.setAttribute('stroke-linecap', 'round');
  progressCircle.style.transform = 'rotate(-90deg)';
  progressCircle.style.transformOrigin = `${svgCenter}px ${svgCenter}px`;
  progressCircle.style.transition = 'stroke-dashoffset 0.5s ease';

  svg.appendChild(bgCircle);
  svg.appendChild(progressCircle);

  // Add bar indicator when progress > 100%
  if (percentage > 100) {
    const angle = (percentage / 100) * Math.PI * 2 - Math.PI / 2; // -90deg offset
    const barStartX = svgCenter + Math.cos(angle) * (radius - 10 * scale);
    const barStartY = svgCenter + Math.sin(angle) * (radius - 10 * scale);
    const barEndX = svgCenter + Math.cos(angle) * (radius + 10 * scale);
    const barEndY = svgCenter + Math.sin(angle) * (radius + 10 * scale);
    
    const barLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    barLine.setAttribute('x1', barStartX);
    barLine.setAttribute('y1', barStartY);
    barLine.setAttribute('x2', barEndX);
    barLine.setAttribute('y2', barEndY);
    barLine.setAttribute('stroke', theme.background);
    barLine.setAttribute('stroke-width', 2);
    svg.appendChild(barLine);
  }

  ringContainer.appendChild(svg);

  // Center text overlay
  const centerText = document.createElement('div');
  centerText.style.position = 'absolute';
  centerText.style.display = 'flex';
  centerText.style.flexDirection = 'column';
  centerText.style.alignItems = 'center';
  centerText.style.gap = '8px';

  const stepsValue = document.createElement('div');
  stepsValue.style.display = 'flex';
  stepsValue.style.alignItems = 'baseline';
  stepsValue.style.gap = '4px';

  const mainValue = document.createElement('span');
  mainValue.style.fontSize = `${48 * scale}px`;
  mainValue.style.fontWeight = '800';
  mainValue.style.color = theme.text.tertiary;
  mainValue.style.letterSpacing = '-0.02em';
  mainValue.textContent = activityMinutes != null ? `${activityMinutes}` : '--';

  const targetValue = document.createElement('span');
  targetValue.style.fontSize = `${32 * scale}px`;
  targetValue.style.fontWeight = '300';
  targetValue.style.color = theme.text.light;
  targetValue.style.letterSpacing = '-0.01em';
  targetValue.textContent = `/ ${activityGoal != null ? activityGoal : '--'}`;

  stepsValue.appendChild(mainValue);
  stepsValue.appendChild(targetValue);

  const stepsLabel = document.createElement('div');
  stepsLabel.style.fontSize = `${16 * scale}px`;
  stepsLabel.style.fontWeight = '700';
  stepsLabel.style.letterSpacing = '0.3em';
  stepsLabel.style.color = theme.text.muted;
  stepsLabel.style.textTransform = 'uppercase';
  stepsLabel.style.marginTop = `${6 * scale}px`;
  stepsLabel.textContent = 'Active Mins';

  centerText.appendChild(stepsValue);
  centerText.appendChild(stepsLabel);
  ringContainer.appendChild(centerText);

  section.appendChild(ringContainer);

  return section;
}

/**
 * Create Steps Section with Bar Graph
 * @param {Object} stepsData - Steps data with hourly breakdown {totalSteps, hourlySteps: [{hour, steps}, ...]}
 */
function createStepsProgressSection(stepsData) {
  const stepsGoal = 10000; // Daily goal: 10,000 steps
  const totalSteps = stepsData?.totalSteps || 0;
  const stepsRingScale = 1.5; // Scale factor for the steps ring and text

  const section = document.createElement('section');
  section.style.display = 'flex';
  section.style.flexDirection = 'column';
  section.style.alignItems = 'center';
  section.style.justifyContent = 'center';
  section.style.gap = '48px';
  section.style.flex = '1';

  const scale = stepsRingScale;
  const ringContainerSize = 360 * scale;
  const svgSize = 320 * scale;
  const radius = 140 * scale;
  const svgCenter = svgSize / 2;

  // SVG Ring Container
  const ringContainer = document.createElement('div');
  ringContainer.style.position = 'relative';
  ringContainer.style.display = 'flex';
  ringContainer.style.alignItems = 'center';
  ringContainer.style.justifyContent = 'center';
  ringContainer.style.width = `${ringContainerSize}px`;
  ringContainer.style.height = `${ringContainerSize}px`;

  const percentage = totalSteps != null && stepsGoal != null ? (totalSteps / stepsGoal) * 100 : 0;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - Math.min((percentage / 100) * circumference, circumference);

  // Create SVG for perfect ring
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', svgSize);
  svg.setAttribute('height', svgSize);
  svg.setAttribute('viewBox', `0 0 ${svgSize} ${svgSize}`);
  svg.style.position = 'absolute';
  svg.style.filter = `drop-shadow(0 0 40px ${theme.overlay.accentLighter})`;

  // Background circle
  const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  bgCircle.setAttribute('cx', svgCenter);
  bgCircle.setAttribute('cy', svgCenter);
  bgCircle.setAttribute('r', radius);
  bgCircle.setAttribute('fill', 'none');
  bgCircle.setAttribute('stroke', theme.backgroundLighter);
  bgCircle.setAttribute('stroke-width', 20 * scale);
  bgCircle.setAttribute('stroke-linecap', 'round');

  // Progress circle with dash animation
  const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  progressCircle.setAttribute('cx', svgCenter);
  progressCircle.setAttribute('cy', svgCenter);
  progressCircle.setAttribute('r', radius);
  progressCircle.setAttribute('fill', 'none');
  progressCircle.setAttribute('stroke', theme.accent);
  progressCircle.setAttribute('stroke-width', 20 * scale);
  progressCircle.setAttribute('stroke-dasharray', circumference);
  progressCircle.setAttribute('stroke-dashoffset', strokeDashoffset);
  progressCircle.setAttribute('stroke-linecap', 'round');
  progressCircle.style.transform = 'rotate(-90deg)';
  progressCircle.style.transformOrigin = `${svgCenter}px ${svgCenter}px`;
  progressCircle.style.transition = 'stroke-dashoffset 0.5s ease';

  svg.appendChild(bgCircle);
  svg.appendChild(progressCircle);

  // Add bar indicator when progress > 100%
  if (percentage > 100) {
    const angle = (percentage / 100) * Math.PI * 2 - Math.PI / 2; // -90deg offset
    const barStartX = svgCenter + Math.cos(angle) * (radius - 10 * scale);
    const barStartY = svgCenter + Math.sin(angle) * (radius - 10 * scale);
    const barEndX = svgCenter + Math.cos(angle) * (radius + 10 * scale);
    const barEndY = svgCenter + Math.sin(angle) * (radius + 10 * scale);
    
    const barLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    barLine.setAttribute('x1', barStartX);
    barLine.setAttribute('y1', barStartY);
    barLine.setAttribute('x2', barEndX);
    barLine.setAttribute('y2', barEndY);
    barLine.setAttribute('stroke', theme.backgroundLighter);
    barLine.setAttribute('stroke-width', 2);
    svg.appendChild(barLine);
  }

  ringContainer.appendChild(svg);

  // Center text overlay
  const centerText = document.createElement('div');
  centerText.style.position = 'absolute';
  centerText.style.display = 'flex';
  centerText.style.flexDirection = 'column';
  centerText.style.alignItems = 'center';
  centerText.style.gap = '8px';

  const percentageValue = document.createElement('div');
  percentageValue.style.display = 'flex';
  percentageValue.style.alignItems = 'baseline';
  percentageValue.style.gap = '4px';

  const mainValue = document.createElement('span');
  mainValue.style.fontSize = `${48 * scale}px`;
  mainValue.style.fontWeight = '800';
  mainValue.style.color = theme.text.tertiary;
  mainValue.style.letterSpacing = '-0.02em';
  mainValue.textContent = percentage != null ? `${Math.round(percentage)}` : '--';

  const percentSymbol = document.createElement('span');
  percentSymbol.style.fontSize = `${32 * scale}px`;
  percentSymbol.style.fontWeight = '300';
  percentSymbol.style.color = theme.text.light;
  percentSymbol.style.letterSpacing = '-0.01em';
  percentSymbol.textContent = '%';

  percentageValue.appendChild(mainValue);
  percentageValue.appendChild(percentSymbol);

  const stepsLabel = document.createElement('div');
  stepsLabel.style.fontSize = `${16 * scale}px`;
  stepsLabel.style.fontWeight = '700';
  stepsLabel.style.letterSpacing = '0.3em';
  stepsLabel.style.color = theme.text.muted;
  stepsLabel.style.textTransform = 'uppercase';
  stepsLabel.style.marginTop = `${6 * scale}px`;
  stepsLabel.textContent = 'Steps Goal';

  centerText.appendChild(percentageValue);
  centerText.appendChild(stepsLabel);
  ringContainer.appendChild(centerText);

  section.appendChild(ringContainer);

  return section;
}


function createStepsGraphSection(stepsData, stepsGraphLabelGapHours = 2) {
  const section = document.createElement('section');
  section.style.display = 'flex';
  section.style.flexDirection = 'column';
  section.style.alignItems = 'center';
  section.style.justifyContent = 'center';
  section.style.gap = '0px';
  section.style.width = '100%';
  section.style.minWidth = '0';
  section.style.paddingLeft = '0px';
  section.style.paddingRight = '0px';

  const graphWrapper = document.createElement('div');
  graphWrapper.style.width = '100%';
  graphWrapper.style.minWidth = '0';
  graphWrapper.style.height = '100%';
  graphWrapper.style.display = 'flex';
  graphWrapper.style.flexDirection = 'column';
  graphWrapper.style.overflow = 'hidden';

  // Bars area
  const barsArea = document.createElement('div');
  barsArea.style.width = '100%';
  barsArea.style.boxSizing = 'border-box';
  barsArea.style.minWidth = '0';
  barsArea.style.display = 'flex';
  barsArea.style.alignItems = 'flex-end';
  barsArea.style.justifyContent = 'flex-start';
  barsArea.style.gap = '4px';
  barsArea.style.height = '160px';
  barsArea.style.paddingBottom = '8px';
  barsArea.style.paddingLeft = '24px';
  barsArea.style.paddingRight = '24px';
  barsArea.style.overflow = 'hidden';

  // Labels area
  const labelsArea = document.createElement('div');
  labelsArea.style.width = '100%';
  labelsArea.style.boxSizing = 'border-box';
  labelsArea.style.minWidth = '0';
  labelsArea.style.display = 'flex';
  labelsArea.style.alignItems = 'center';
  labelsArea.style.justifyContent = 'flex-start';
  labelsArea.style.gap = '4px';
  labelsArea.style.height = '32px';
  labelsArea.style.paddingBottom = '8px';
  labelsArea.style.paddingLeft = '24px';
  labelsArea.style.paddingRight = '24px';
  labelsArea.style.overflow = 'hidden';

  // Generate 30-minute slot data or use provided data
  let slotSteps = stepsData?.slotSteps || [];
  
  // Don't generate fake data - use only real data from backend
  const maxSteps = slotSteps.length > 0 ? Math.max(...slotSteps.map(h => h.steps || 0), 1) : 0;

  slotSteps.forEach((slotData, index) => {
    // Bar container
    const barContainer = document.createElement('div');
    barContainer.style.display = 'flex';
    barContainer.style.flexDirection = 'column';
    barContainer.style.alignItems = 'center';
    barContainer.style.flex = '1';
    barContainer.style.minWidth = '0';
    barContainer.style.height = '100%';
    barContainer.style.justifyContent = 'flex-end';

    // Bar
    const bar = document.createElement('div');
    const barHeight = (slotData.steps / maxSteps) * 100;
    bar.style.width = '100%';
    bar.style.height = `${barHeight}%`;
    bar.style.backgroundColor = theme.accent;
    bar.style.borderRadius = '4px 4px 0 0';
    bar.style.minHeight = slotData.steps > 0 ? '2px' : '0px';
    bar.style.opacity = '0.8';
    bar.style.transition = 'all 0.2s ease';
    const hour12 = slotData.hour % 12 || 12;
    const ampm = slotData.hour < 12 ? 'am' : 'pm';
    bar.title = `${hour12}${ampm} - ${Math.round(slotData.steps)} steps`;

    bar.addEventListener('mouseover', () => {
      bar.style.opacity = '1';
      bar.style.filter = `drop-shadow(0 0 8px ${theme.overlay.accentLight})`;
    });

    bar.addEventListener('mouseout', () => {
      bar.style.opacity = '0.8';
      bar.style.filter = 'none';
    });

    barContainer.appendChild(bar);
    barsArea.appendChild(barContainer);

    // Time label (show every N slots based on stepsGraphLabelGapHours)
    const labelGapSlots = stepsGraphLabelGapHours * 2; // 2 slots per hour (30-min intervals)
    const isLastSlot = index === slotSteps.length - 1;
    const isLabelSlot = index % labelGapSlots === 0;
    const isLastLabelSlot = isLastSlot && (index + 1) % labelGapSlots === 0;
    
    if (isLabelSlot || isLastLabelSlot) {
      const labelContainer = document.createElement('div');
      labelContainer.style.display = 'flex';
      labelContainer.style.flex = '1';
      labelContainer.style.minWidth = '0';
      labelContainer.style.justifyContent = 'center';
      labelContainer.style.alignItems = 'center';

      const label = document.createElement('span');
      label.style.fontSize = '10px';
      label.style.color = theme.text.muted;
      label.style.fontWeight = '600';
      label.style.whiteSpace = 'nowrap';
      const hour12 = slotData.hour % 12 || 12;
      const ampm = slotData.hour < 12 ? 'am' : 'pm';
      label.textContent = `${hour12}${ampm}`;
      labelContainer.appendChild(label);
      labelsArea.appendChild(labelContainer);
    } else {
      // Add empty spacer to maintain alignment
      const spacer = document.createElement('div');
      spacer.style.flex = '1';
      labelsArea.appendChild(spacer);
    }
  });

  graphWrapper.appendChild(barsArea);
  graphWrapper.appendChild(labelsArea);
  section.appendChild(graphWrapper);

  return section;
}

/**
 * Create Steps Graphs Toggle - Switch between Daily and 7-Day views
 * @param {Object} stepsData - Daily steps data {totalSteps, slotSteps}
 * @param {Array} stepsRangeData - Weekly steps data [{date, dayOfWeek, steps}, ...]
 * @param {Number} stepsGraphLabelGapHours - Label gap for daily graph
 */
function createStepsGraphsToggle(stepsData, stepsRangeData, stepsGraphLabelGapHours = 2) {
  const container = document.createElement('section');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '16px';
  container.style.width = '100%';

  // Toggle buttons wrapper
  const toggleWrapper = document.createElement('div');
  toggleWrapper.style.display = 'flex';
  toggleWrapper.style.gap = '8px';
  toggleWrapper.style.paddingLeft = '24px';
  toggleWrapper.style.paddingRight = '24px';
  toggleWrapper.style.justifyContent = 'flex-start';

  // State for which view is active
  let activeView = 'daily'; // 'daily' or '7days'

  // Daily button
  const dailyBtn = document.createElement('button');
  dailyBtn.textContent = 'Daily';
  dailyBtn.style.padding = '8px 16px';
  dailyBtn.style.border = 'none';
  dailyBtn.style.borderRadius = '4px';
  dailyBtn.style.fontSize = '12px';
  dailyBtn.style.fontWeight = '600';
  dailyBtn.style.cursor = 'pointer';
  dailyBtn.style.backgroundColor = theme.accent;
  dailyBtn.style.color = theme.text.primary;
  dailyBtn.style.transition = 'all 0.2s ease';

  // 7 Days button
  const sevenDaysBtn = document.createElement('button');
  sevenDaysBtn.textContent = '7 Days';
  sevenDaysBtn.style.padding = '8px 16px';
  sevenDaysBtn.style.border = 'none';
  sevenDaysBtn.style.borderRadius = '4px';
  sevenDaysBtn.style.fontSize = '12px';
  sevenDaysBtn.style.fontWeight = '600';
  sevenDaysBtn.style.cursor = 'pointer';
  sevenDaysBtn.style.backgroundColor = theme.backgroundLighter;
  sevenDaysBtn.style.color = theme.text.muted;
  sevenDaysBtn.style.transition = 'all 0.2s ease';

  // Graph content wrapper
  const graphContent = document.createElement('div');
  graphContent.style.width = '100%';
  graphContent.style.height = '192px';

  const updateButtonStates = () => {
    if (activeView === 'daily') {
      dailyBtn.style.backgroundColor = theme.accent;
      dailyBtn.style.color = theme.text.primary;
      sevenDaysBtn.style.backgroundColor = theme.backgroundLighter;
      sevenDaysBtn.style.color = theme.text.muted;
    } else {
      dailyBtn.style.backgroundColor = theme.backgroundLighter;
      dailyBtn.style.color = theme.text.muted;
      sevenDaysBtn.style.backgroundColor = theme.accent;
      sevenDaysBtn.style.color = theme.text.primary;
    }
  };

  const updateGraphDisplay = () => {
    // Clear previous content
    graphContent.innerHTML = '';

    if (activeView === 'daily') {
      graphContent.appendChild(createStepsGraphSection(stepsData, stepsGraphLabelGapHours));
    } else {
      graphContent.appendChild(createStepsWeeklyGraphSection(stepsRangeData));
    }

    updateButtonStates();
  };

  // Button click handlers
  dailyBtn.addEventListener('click', () => {
    activeView = 'daily';
    updateGraphDisplay();
  });

  dailyBtn.addEventListener('mouseover', () => {
    if (activeView !== 'daily') {
      dailyBtn.style.opacity = '0.8';
    }
  });

  dailyBtn.addEventListener('mouseout', () => {
    dailyBtn.style.opacity = '1';
  });

  sevenDaysBtn.addEventListener('click', () => {
    activeView = '7days';
    updateGraphDisplay();
  });

  sevenDaysBtn.addEventListener('mouseover', () => {
    if (activeView !== '7days') {
      sevenDaysBtn.style.opacity = '0.8';
    }
  });

  sevenDaysBtn.addEventListener('mouseout', () => {
    sevenDaysBtn.style.opacity = '1';
  });

  toggleWrapper.appendChild(dailyBtn);
  toggleWrapper.appendChild(sevenDaysBtn);

  container.appendChild(toggleWrapper);
  container.appendChild(graphContent);

  // Initial display
  updateGraphDisplay();

  return container;
}

/**
 * Create 7-Day Steps Weekly Graph Section
 * @param {Array} stepsRangeData - Weekly steps data [{date, dayOfWeek, steps}, ...]
 */
function createStepsWeeklyGraphSection(stepsRangeData) {
  const section = document.createElement('section');
  section.style.display = 'flex';
  section.style.flexDirection = 'column';
  section.style.alignItems = 'center';
  section.style.justifyContent = 'center';
  section.style.gap = '0px';
  section.style.width = '100%';
  section.style.minWidth = '0';
  section.style.paddingLeft = '0px';
  section.style.paddingRight = '0px';

  const graphWrapper = document.createElement('div');
  graphWrapper.style.width = '100%';
  graphWrapper.style.minWidth = '0';
  graphWrapper.style.height = '100%';
  graphWrapper.style.display = 'flex';
  graphWrapper.style.flexDirection = 'column';
  graphWrapper.style.overflow = 'hidden';

  // Bars area
  const barsArea = document.createElement('div');
  barsArea.style.width = '100%';
  barsArea.style.boxSizing = 'border-box';
  barsArea.style.minWidth = '0';
  barsArea.style.display = 'flex';
  barsArea.style.alignItems = 'flex-end';
  barsArea.style.justifyContent = 'flex-start';
  barsArea.style.gap = '4px';
  barsArea.style.height = '160px';
  barsArea.style.paddingBottom = '8px';
  barsArea.style.paddingLeft = '24px';
  barsArea.style.paddingRight = '24px';
  barsArea.style.overflow = 'hidden';

  // Labels area
  const labelsArea = document.createElement('div');
  labelsArea.style.width = '100%';
  labelsArea.style.boxSizing = 'border-box';
  labelsArea.style.minWidth = '0';
  labelsArea.style.display = 'flex';
  labelsArea.style.alignItems = 'center';
  labelsArea.style.justifyContent = 'flex-start';
  labelsArea.style.gap = '4px';
  labelsArea.style.height = '32px';
  labelsArea.style.paddingBottom = '8px';
  labelsArea.style.paddingLeft = '24px';
  labelsArea.style.paddingRight = '24px';
  labelsArea.style.overflow = 'hidden';

  // Use provided data from node_helper (already formatted)
  let daySteps = stepsRangeData || [];
  
  console.log('[MMM-tractive] Weekly graph stepsRangeData:', daySteps);
  
  // Calculate max steps for scaling
  const maxSteps = daySteps.length > 0 ? Math.max(...daySteps.map(d => d.steps || 0), 1) : 0;
  console.log('[MMM-tractive] maxSteps:', maxSteps, 'daySteps length:', daySteps.length);

  daySteps.forEach((dayData, index) => {
    console.log(`[MMM-tractive] Creating bar ${index}: steps=${dayData.steps}, barHeight=${(dayData.steps / maxSteps) * 100}%`);
    
    // Bar container
    const barContainer = document.createElement('div');
    barContainer.style.display = 'flex';
    barContainer.style.flexDirection = 'column';
    barContainer.style.alignItems = 'center';
    barContainer.style.flex = '1';
    barContainer.style.minWidth = '0';
    barContainer.style.height = '100%';
    barContainer.style.justifyContent = 'flex-end';

    // Bar
    const bar = document.createElement('div');
    const barHeight = (dayData.steps / maxSteps) * 100;
    bar.style.width = '100%';
    bar.style.height = `${barHeight}%`;
    bar.style.backgroundColor = theme.accent;
    bar.style.borderRadius = '4px 4px 0 0';
    bar.style.minHeight = dayData.steps > 0 ? '2px' : '0px';
    bar.style.opacity = '0.8';
    bar.style.transition = 'all 0.2s ease';
    bar.title = `${dayData.dayOfWeek} ${dayData.date} - ${Math.round(dayData.steps)} steps`;

    bar.addEventListener('mouseover', () => {
      bar.style.opacity = '1';
      bar.style.filter = `drop-shadow(0 0 8px ${theme.overlay.accentLight})`;
    });

    bar.addEventListener('mouseout', () => {
      bar.style.opacity = '0.8';
      bar.style.filter = 'none';
    });

    barContainer.appendChild(bar);
    barsArea.appendChild(barContainer);

    // Day label
    const labelContainer = document.createElement('div');
    labelContainer.style.display = 'flex';
    labelContainer.style.flex = '1';
    labelContainer.style.minWidth = '0';
    labelContainer.style.justifyContent = 'center';
    labelContainer.style.alignItems = 'center';

    const label = document.createElement('span');
    label.style.fontSize = '10px';
    label.style.color = theme.text.muted;
    label.style.fontWeight = '600';
    label.style.whiteSpace = 'nowrap';
    label.textContent = dayData.dayOfWeek;
    labelContainer.appendChild(label);
    labelsArea.appendChild(labelContainer);
  });

  // Title for weekly section
  const titleWrapper = document.createElement('div');
  titleWrapper.style.width = '100%';
  titleWrapper.style.paddingLeft = '24px';
  titleWrapper.style.paddingRight = '24px';
  titleWrapper.style.paddingTop = '24px';
  titleWrapper.style.marginBottom = '-8px';

  section.appendChild(titleWrapper);
  graphWrapper.appendChild(barsArea);
  graphWrapper.appendChild(labelsArea);
  section.appendChild(graphWrapper);

  return section;
}

/**
 * Create Activity Section with Right Section wrapper
 */
function createActivitySectionWithRight(activityMinutes, activityGoal, stepsData, stepsGraphLabelGapHours = 2) {
  const wrapper = document.createElement('section');
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.gap = '32px';
  wrapper.style.flex = '1';
  wrapper.style.minWidth = '0';

  // First row: Activity and Steps Count
  const firstRow = document.createElement('div');
  firstRow.style.display = 'flex';
  firstRow.style.gap = '32px';
  firstRow.style.flex = '0';
  firstRow.style.minWidth = '0';
  firstRow.style.alignItems = 'stretch';

  // Left section: Activity
  const leftSection = document.createElement('div');
  leftSection.style.display = 'flex';
  leftSection.style.flex = '1';
  leftSection.style.minWidth = '0';
  leftSection.appendChild(createActivitySection(activityMinutes, activityGoal));

  // Right section: Steps Progress
  const rightSection = document.createElement('div');
  rightSection.style.display = 'flex';
  rightSection.style.flex = '1';
  rightSection.style.minWidth = '0';
  rightSection.style.alignItems = 'center';
  rightSection.style.justifyContent = 'center';
  rightSection.appendChild(createStepsProgressSection(stepsData));

  firstRow.appendChild(leftSection);
  firstRow.appendChild(rightSection);

  wrapper.appendChild(firstRow);

  return wrapper;
}

function createMetricsRow(respiratoryStatus, heartRateStatus, alerts) {
  const metricsRow = document.createElement('div');
  metricsRow.style.display = 'flex';
  metricsRow.style.flexDirection = 'column';
  metricsRow.style.justifyContent = 'flex-start';
  metricsRow.style.alignItems = 'center';
  metricsRow.style.gap = '24px';

  // Metrics including Heart Rate as green text
  const metrics = [
    { icon: 'respiratory_rate', value: 'RESPIRATORY RATE', label: '', color: theme.status.warning, hideLabel: true, status: respiratoryStatus },
    { icon: 'ecg_heart', value: 'HEART RATE', label: '', color: theme.status.normal, hideLabel: true, status: heartRateStatus },
    { icon: 'health_metrics', value: 'ALERTS', label: '', color: theme.text.muted, hideLabel: true, status: alerts == null ? 'UNKNOWN' : (alerts > 0 ? 'ALERT' : 'NORMAL') },
  ];

  metrics.forEach(metric => {
    // Use createHealthStatus for metrics with status/icon
    if (metric.status && metric.icon) {
      const healthStatus = createHealthStatus(metric.icon, metric.value, metric.status);
      metricsRow.appendChild(healthStatus);
    } else {
      // Regular metric display
      const metricDiv = document.createElement('div');
      metricDiv.style.textAlign = 'left';
      metricDiv.style.flex = '1';

      metricsRow.appendChild(metricDiv);
    }
  });

  return metricsRow;
}
