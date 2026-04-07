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
  if (percent <= 16) return theme.battery.critical;
  if (percent <= 50) return theme.battery.low;
  if (percent <= 66) return theme.battery.medium;
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
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.gap = '8px';
  container.style.textAlign = 'center';
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
  const iconElement = createMaterialIcon(icon, IconSizes.L, color);
  container.appendChild(iconElement);

  // Create text
  const textElement = document.createElement('p');
  textElement.style.fontSize = FontSizes.M;
  textElement.style.fontWeight = '700';
  textElement.style.color = color;
  textElement.style.margin = '0';
  textElement.textContent = text;
  container.appendChild(textElement);

  return container;
}

/**
 * Create Top Header
 */
function createHeader(lastUpdated) {

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'flex-end';
  header.style.alignItems = 'center';
  header.style.paddingLeft = '24px';
  header.style.paddingRight = '24px';
  header.style.paddingTop = '16px';
  header.style.paddingBottom = '16px';
  header.style.zIndex = '50';

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
function createProfileSection(dogName, dogImage, onClickHandler) {
  const section = document.createElement('section');
  section.style.display = 'flex';
  section.style.flexDirection = 'column';
  section.style.alignItems = 'center';
  section.style.gap = '64px';
  section.style.position = 'relative';
  section.style.paddingTop = '24px';

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

  section.appendChild(nameSection);

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

  const percentage = activityMinutes != null && activityGoal != null ? Math.min((activityMinutes / activityGoal) * 100, 100) : 0;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

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
  stepsLabel.textContent = 'Active Minutes';

  centerText.appendChild(stepsValue);
  centerText.appendChild(stepsLabel);
  ringContainer.appendChild(centerText);

  section.appendChild(ringContainer);

  return section;
}

function createMetricsRow(respiratoryStatus, heartRateStatus, alerts) {
  const metricsRow = document.createElement('div');
  metricsRow.style.display = 'flex';
  metricsRow.style.justifyContent = 'space-between';
  // metricsRow.style.width = '100%';
  metricsRow.style.alignItems = 'center';
  metricsRow.style.gap = '24px';
  metricsRow.style.paddingLeft = '24px';
  metricsRow.style.paddingRight = '24px';
  metricsRow.style.margin = '24px 0 64px 0';

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
      metricDiv.style.textAlign = 'center';
      metricDiv.style.flex = '1';

      metricsRow.appendChild(metricDiv);
    }
  });

  return metricsRow;
}
