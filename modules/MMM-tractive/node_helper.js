const NodeHelper = require('node_helper')
const request = require('request')

module.exports = NodeHelper.create({
  start: function () {
    console.log('Tractive helper started ...')
  },
  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, id) {
    if (notification === 'TRACTIVE_AUTH') {
      const self = this
      request('http://localhost:3002/auth', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log('Authentication successful, sending data to module')
          self.sendSocketNotification('TRACTIVE_AUTH_SUCCESS', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
        }
      })
    } else if (notification === 'TRACKER_LOCATION_UPDATE') {
      const self = this
      request(`http://localhost:3002/location/${id}`, function (error, response, body) {
         console.log('/location: ', JSON.parse(body))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('TRACKER_LOCATION_DATA', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
        }
      })
    } else if (notification === 'PET_UPDATE') {
      const self = this
      request(`http://localhost:3002/pet/${id}`, function (error, response, body) {
         console.log('/pet: ', JSON.parse(body))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('PET_DATA', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
        }
      })
    } else if (notification === 'TRACKER_HARDWARE_UPDATE') {
      const self = this
      request(`http://localhost:3002/hardware/${id}`, function (error, response, body) {
        console.log('/hardware: ', JSON.parse(body))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('TRACKER_HARDWARE_DATA', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
        }
      })
    } else if (notification === 'TRACKER_UPDATE') {
      const self = this
      request(`http://localhost:3002/tracker/${id}`, function (error, response, body) {
        console.log('/tracker: ', JSON.parse(body))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('TRACKER_DATA', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
        }
      })
     } else if (notification === 'PET_HEALTH_UPDATE') {
      const self = this
      request(`http://localhost:3002/pet/${id}/health`, function (error, response, body) {
        console.log('/health: ', JSON.parse(body))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('PET_HEALTH_DATA', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
        }
      })
     } else if (notification === 'SWITCH_LIGHT_ON') {
      const self = this
      request.post(`http://localhost:3002/command/${id}/led/on`, function (error, response, body) {
        console.log('/light: ', JSON.parse(body))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('LIGHT_ON_SUCCESS', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
          self.sendSocketNotification('LIGHT_ON_FAILURE')
        }
      })
    } else if (notification === 'SWITCH_LIGHT_OFF') {
      const self = this
      request.post(`http://localhost:3002/command/${id}/led/off`, function (error, response, body) {
        console.log('/light: ', JSON.parse(body))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('LIGHT_OFF_SUCCESS', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
          self.sendSocketNotification('LIGHT_OFF_FAILURE')
        }
      })
   } else if (notification === 'SWITCH_SOUND_ON') {
      const self = this
      request.post(`http://localhost:3002/command/${id}/buzzer/on`, function (error, response, body) {
        console.log('/sound: ', JSON.parse(body))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('SOUND_ON_SUCCESS', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
          self.sendSocketNotification('SOUND_ON_FAILURE')
        }
      })
    } else if (notification === 'SWITCH_SOUND_OFF') {
      const self = this
      request.post(`http://localhost:3002/command/${id}/buzzer/off`, function (error, response, body) {
        console.log('/sound: ', JSON.parse(body))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('SOUND_OFF_SUCCESS', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
          self.sendSocketNotification('SOUND_OFF_FAILURE')
        }
      })
    } else if (notification === 'SWITCH_LIVE_TRACKING_ON') {
      const self = this
      request.post(`http://localhost:3002/command/${id}/live/on`, function (error, response, body) {
        console.log('/live: ', JSON.parse(body))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('LIVE_TRACKING_ON_SUCCESS', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
          self.sendSocketNotification('LIVE_TRACKING_ON_FAILURE')
        }
      })
    } else if (notification === 'SWITCH_LIVE_TRACKING_OFF') {
      const self = this
      request.post(`http://localhost:3002/command/${id}/live/off`, function (error, response, body) {
        console.log('/live: ', JSON.parse(body))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('LIVE_TRACKING_OFF_SUCCESS', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
          self.sendSocketNotification('LIVE_TRACKING_OFF_FAILURE')
        }
      })
    }
  }
})
