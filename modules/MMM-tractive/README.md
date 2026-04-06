# MMM-Tractive

A Magic Mirror module that displays comprehensive pet tracker information from the Tractive API with a modern dashboard interface.

## Features

- **Full-page pet dashboard** with modern glassmorphic design
- **Pet profile section** with circular photo, name, and interactive controls
- **Birthday countdown** showing days until next birthday
- **Real-time battery status** with charging state and battery save mode indication
- **Activity ring** showing active minutes vs daily goal
- **Health metrics** including respiratory rate, heart rate, and health alerts
- **Interactive controls** for light toggle, sound toggle, and data refresh

## Installation

1. Clone this repository into your MagicMirror modules folder:
```bash
cd ~/MagicMirror/modules
git clone https://github.com/yourusername/MMM-tractive.git
```

2. Install dependencies:
```bash
cd MMM-tractive
npm install
```

## Configuration

Add the following configuration to your MagicMirror config file:

```javascript
{
  module: 'MMM-tractive',
  position: 'fullscreen_center',
  config: {
    trackerName: 'YOU_TRACTIVE_TRACKER_ID',
    petId: 'YOUR_TRACTIVE_PET_ID',
  }
}
```

Replace pet_picture.jpeg file with your pet picture (keep same name and .jpeg extention).

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `trackerName` | `string` | `TRACTIVE_TRACKER_ID` | Device ID/name of your tracker (required) |
| `petId` | `string` | `TRACTIVE_PET_ID` | Pet ID from your Tractive account (required) |
| `animationSpeed` | `number` | `500` | DOM update animation speed in ms |
| `updateInterval` | `number` | `30` | API update interval in minutes |

## Module Structure

- **MMM-tractive.js** - Main module with DOM rendering and data management
- **node_helper.js** - Backend helper for Tractive API calls
- **tractive-dashboard.js** - Dashboard UI component builder with theme and styling
- **MMM-tractive.css** - Main styling including Material Design icon fonts

## API Integration

The module communicates with the Tractive API through a local backend server (expected at `http://localhost:3002`):

## Data Fetching

The module automatically:
1. Authenticates with Tractive API on startup
2. Fetches pet, health, hardware, and location data
3. Updates every 5 minutes (configurable)
4. Shows loading state while fetching
5. Handles socket notifications for real-time updates
6. Displays "Loading..." if any required data is missing

## Dependencies

- `request` - HTTP client for API calls (in node_helper)

## Future Enhancements

- [ ] Map view for pet location
- [ ] Activity history graphs
- [ ] Multiple pet support
- [ ] Geofencing alerts
- [ ] Health trend analysis

## License

MIT Licensed

