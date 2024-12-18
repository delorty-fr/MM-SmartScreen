/* Magic Mirror
 * Module: MagicMirror-Sonos-Module
 *
 * By Christopher Fenner https://github.com/CFenner
 * MIT Licensed.
 */
const NodeHelper = require('node_helper')
const request = require('request')

module.exports = NodeHelper.create({
  start: function () {
    console.log('Sonos helper started ...')
  },
  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, url) {
    if (notification === 'SONOS_UPDATE') {
      const self = this
      request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          self.sendSocketNotification('SONOS_DATA', JSON.parse(body))
        } else {
          console.error('Failure: ' + error)
        }
      })
    }
  }
})
