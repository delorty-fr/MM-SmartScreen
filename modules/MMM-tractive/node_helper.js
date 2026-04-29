const NodeHelper = require('node_helper')
const request = require('request')

module.exports = NodeHelper.create({
  start: function () {
    console.log('Tractive helper started ...')
  },
  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, ids) {
    const { petId, trackerId } = ids;
    console.log(`[MMM-tractive] Received socket notification: ${notification} with petId: ${petId} and trackerId: ${trackerId}`)
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
    } else if (notification === 'TRACTIVE_UPDATE') {
      const self = this
      request(`http://localhost:3002/tractive?trackerId=${trackerId}&petID=${petId}`, function (error, response, body) {
         console.log('/tractive: ', JSON.stringify(JSON.parse(body), null, 2))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('TRACTIVE_DATA', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
        }
      })
    } else if (notification === 'TRACKER_LOCATION_UPDATE') {
      const self = this
      request(`http://localhost:3002/location/${trackerId}`, function (error, response, body) {
         console.log('/location: ', JSON.stringify(JSON.parse(body), null, 2))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('TRACKER_LOCATION_DATA', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
        }
      })
    } else if (notification === 'PET_UPDATE') {
      const self = this
      request(`http://localhost:3002/pet/${petId}`, function (error, response, body) {
         console.log('/pet: ', JSON.stringify(JSON.parse(body), null, 2))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('PET_DATA', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
        }
      })
    } else if (notification === 'TRACKER_HARDWARE_UPDATE') {
      const self = this
      request(`http://localhost:3002/hardware/${trackerId}`, function (error, response, body) {
        console.log('/hardware: ', JSON.stringify(JSON.parse(body), null, 2))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('TRACKER_HARDWARE_DATA', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
        }
      })
    } else if (notification === 'TRACKER_UPDATE') {
      const self = this
      request(`http://localhost:3002/tracker/${trackerId}`, function (error, response, body) {
        console.log('/tracker: ', JSON.stringify(JSON.parse(body), null, 2))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('TRACKER_DATA', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
        }
      })
     } else if (notification === 'PET_HEALTH_UPDATE') {
      const self = this
      request(`http://localhost:3002/pet/${petId}/health`, function (error, response, body) {
        console.log('/health: ', JSON.stringify(JSON.parse(body), null, 2))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('PET_HEALTH_DATA', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
        }
      })
     } else if (notification === 'SWITCH_LIGHT_ON') {
      const self = this
      request.post(`http://localhost:3002/command/${trackerId}/led/on`, function (error, response, body) {
        console.log('/light: ', JSON.stringify(JSON.parse(body), null, 2))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('LIGHT_ON_SUCCESS', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
          self.sendSocketNotification('LIGHT_ON_FAILURE')
        }
      })
    } else if (notification === 'SWITCH_LIGHT_OFF') {
      const self = this
      request.post(`http://localhost:3002/command/${trackerId}/led/off`, function (error, response, body) {
        console.log('/light: ', JSON.stringify(JSON.parse(body), null, 2))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('LIGHT_OFF_SUCCESS', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
          self.sendSocketNotification('LIGHT_OFF_FAILURE')
        }
      })
   } else if (notification === 'SWITCH_SOUND_ON') {
      const self = this
      request.post(`http://localhost:3002/command/${trackerId}/buzzer/on`, function (error, response, body) {
        console.log('/sound: ', JSON.stringify(JSON.parse(body), null, 2))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('SOUND_ON_SUCCESS', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
          self.sendSocketNotification('SOUND_ON_FAILURE')
        }
      })
    } else if (notification === 'SWITCH_SOUND_OFF') {
      const self = this
      request.post(`http://localhost:3002/command/${trackerId}/buzzer/off`, function (error, response, body) {
        console.log('/sound: ', JSON.stringify(JSON.parse(body), null, 2))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('SOUND_OFF_SUCCESS', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
          self.sendSocketNotification('SOUND_OFF_FAILURE')
        }
      })
    } else if (notification === 'SWITCH_LIVE_TRACKING_ON') {
      const self = this
      request.post(`http://localhost:3002/command/${trackerId}/live/on`, function (error, response, body) {
        console.log('/live: ', JSON.stringify(JSON.parse(body), null, 2))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('LIVE_TRACKING_ON_SUCCESS', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
          self.sendSocketNotification('LIVE_TRACKING_ON_FAILURE')
        }
      })
    } else if (notification === 'SWITCH_LIVE_TRACKING_OFF') {
      const self = this
      request.post(`http://localhost:3002/command/${trackerId}/live/off`, function (error, response, body) {
        console.log('/live: ', JSON.stringify(JSON.parse(body), null, 2))
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('LIVE_TRACKING_OFF_SUCCESS', JSON.parse(body).data)
        } else {
          console.error('Failure: ' + error)
          self.sendSocketNotification('LIVE_TRACKING_OFF_FAILURE')
        }
      })
    } else if (notification === 'STEPS_UPDATE') {
      const self = this
      // Get today's date in local timezone (YYYY-MM-DD format)
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      const todayStr = `${year}-${month}-${day}`
      console.log('[MMM-tractive] Fetching steps data for:', todayStr)
      request(`http://localhost:8000/steps/${todayStr}`, function (error, response, body) {
        try {
          const data = JSON.parse(body)
          console.log('[MMM-tractive] /steps', JSON.stringify(data, null, 2))
          
          if (!error && response.statusCode === 200 && data.data && data.data.length > 0) {
            // Convert 15-minute intervals to 30-minute slots
            const slotSteps = []
            for (let i = 0; i < data.data.length; i += 2) {
              const slot1 = data.data[i]
              const slot2 = data.data[i + 1]
              
              // Parse start time and convert from UTC to EST (America/New_York)
              // Backend sends times without Z, so explicitly add Z to parse as UTC
              const startTime = new Date(slot1.startGMT + 'Z')
              console.log('[DEBUG] Raw startGMT:', slot1.startGMT)
              console.log('[DEBUG] Parsed UTC time:', startTime.toISOString())
              console.log('[DEBUG] UTC hours:', startTime.getUTCHours(), 'minutes:', startTime.getUTCMinutes())
              
              const estFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: 'America/New_York',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })
              const formattedString = estFormatter.format(startTime)
              console.log('[DEBUG] EST formatted:', formattedString)
              
              const parts = estFormatter.formatToParts(startTime)
              const hour = parseInt(parts.find(p => p.type === 'hour').value)
              const minutes = parseInt(parts.find(p => p.type === 'minute').value)
              console.log('[DEBUG] Final EST hour:', hour, 'minutes:', minutes)
              
              // Combine steps from 2 intervals into one 30-minute slot
              const combinedSteps = (slot1.steps || 0) + (slot2?.steps || 0)
              
              slotSteps.push({
                slot: slotSteps.length,
                hour: hour,
                minutes: minutes,
                steps: combinedSteps
              })
            }
            
            console.log('[MMM-tractive] Converted', slotSteps.length, 'slots, total:', slotSteps.reduce((sum, s) => sum + s.steps, 0), 'steps')
            self.sendSocketNotification('STEPS_DATA', slotSteps)
          } else {
            console.error('[MMM-tractive] Error fetching steps or no data:', error || 'No data')
            self.sendSocketNotification('STEPS_DATA', [])
          }
        } catch (e) {
          console.error('[MMM-tractive] Error parsing steps response:', e)
          self.sendSocketNotification('STEPS_DATA', [])
        }
      })
    } else if (notification === 'STEPS_RANGE_UPDATE') {
      const self = this
      // Calculate date range for last 7 days (including today) using local timezone
      const today = new Date()
      const startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 6) // 7 days back
      
      const formatDate = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      const startDateStr = formatDate(startDate)
      const todayStr = formatDate(today)
      
      console.log('[MMM-tractive] Fetching steps range from', startDateStr, 'to', todayStr)
      request(`http://localhost:8000/steps/range/${startDateStr}/${todayStr}`, function (error, response, body) {
        try {
          const data = JSON.parse(body)
          console.log('[MMM-tractive] /steps/range', JSON.stringify(data, null, 2))
          
          if (!error && response.statusCode === 200) {
            // Create a map of returned data for quick lookup
            const dataMap = {}
            if (data.data && data.data.length > 0) {
              data.data.forEach(dayData => {
                dataMap[dayData.calendarDate] = dayData.totalSteps || 0
                console.log('[MMM-tractive] Mapping:', dayData.calendarDate, '=', dayData.totalSteps)
              })
            }
            console.log('[MMM-tractive] dataMap:', dataMap)
            
            // Generate exactly 7 days, filling in 0 for missing days
            const rangeSteps = []
            for (let i = 0; i < 7; i++) {
              const currentDate = new Date(startDate)
              currentDate.setDate(currentDate.getDate() + i)
              const dateStr = formatDate(currentDate)
              const dayOfWeek = currentDate.getDay() // Use local day of week, not UTC
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
              
              rangeSteps.push({
                slot: i,
                date: dateStr,
                dayOfWeek: dayNames[dayOfWeek],
                steps: dataMap[dateStr] || 0
              })
            }
            
            console.log('[MMM-tractive] Generated 7-day range:', rangeSteps.length, 'days')
            self.sendSocketNotification('STEPS_RANGE_DATA', rangeSteps)
          } else {
            console.error('[MMM-tractive] Error fetching steps range or no data:', error || 'No data')
            self.sendSocketNotification('STEPS_RANGE_DATA', [])
          }
        } catch (e) {
          console.error('[MMM-tractive] Error parsing steps range response:', e)
          self.sendSocketNotification('STEPS_RANGE_DATA', [])
        }
      })
    }
  }
})
