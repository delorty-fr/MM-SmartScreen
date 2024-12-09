/* 
 * MIT Licensed.
 */
const NodeHelper = require('node_helper')
const request = require('request')
const fs = require("fs");
const path = require("path");

const LAMBDA_API_KEY  = process.env.ESP_8x8_LAMBDA_API_KEY;
const LAMBDA_URL      = process.env.ESP_8x8_LAMBDA_URL;

const ICONS_PATH      = 'modules\\MMM-8x8\\icons\\categories'

module.exports = NodeHelper.create({
  start: function () {
    console.log('8x8 helper started ...')
  },
  socketNotificationReceived: function (notification, body) {

    console.log('socketNotificationReceived', notification, body)

    if (notification === '8x8_UPDATE_ICON') {
      const options = {
        url: LAMBDA_URL,
        method: 'POST',
        headers: {
          'X-Api-Key': LAMBDA_API_KEY,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      };
      request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          this.sendSocketNotification('8x8_UPDATE_ICON_RESP')
        } else {
          this.sendSocketNotification("ERROR");
        }
      })
    } else if (notification === '8x8_GET_ICON') {
      const options = {
        url: LAMBDA_URL,
        method: 'GET',
        headers: {
          'X-Api-Key': LAMBDA_API_KEY,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      };
      request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          this.sendSocketNotification('8x8_GET_ICON_RESP', JSON.parse(body))
        } else {
          this.sendSocketNotification("ERROR");
        }
      })
    } else if (notification === '8x8_GET_CAT_ICONS') {

      let category    = body.category;
      let startIndex  = body.startIndex;
      let endIndex    = body.endIndex;

      const absolutePath = path.resolve(path.join(ICONS_PATH, category));

      fs.readdir(absolutePath, (err, files) => {
        if (err) {
          this.sendSocketNotification("ERROR");
          return;
        }

        const sortedFiles = files.sort();
        if (endIndex > sortedFiles.length) {
          endIndex = sortedFiles.length
        }

        const filesToRead = sortedFiles.slice(startIndex, endIndex + 1);
        let allFileContents = [];

        let filesReadCount = 0;
        filesToRead.forEach((file, index) => {
          const filePath = path.join(absolutePath, file);
          fs.stat(filePath, (err, stats) => {
            if (err) {
              console.log('Can not load icon ', filePath)
              return;
            }

            if (stats.isFile()) {
              fs.readFile(filePath, "utf8", (err, data) => {
                if (err) {
                  console.log('Can not load icon ', filePath)
                  return;
                }

                allFileContents.push(JSON.parse(data));
                filesReadCount++;

                if (filesReadCount === filesToRead.length) {
                  this.sendSocketNotification("8x8_GET_ICONS_RESP", allFileContents);
                }
              });
            }
          });
        });
      });
    } else if (notification === '8x8_GET_CAT_DETAILS') {
      const absolutePath = path.resolve(path.join(ICONS_PATH, body));
      fs.readdir(absolutePath, (err, files) => {
        if (err) {
          this.sendSocketNotification("ERROR");
          return;
        }
        this.sendSocketNotification("8x8_GET_CAT_DETAILS_RESP", { iconsCount: files.length });
      })
    } else if (notification === '8x8_GET_CATEGORIES') {
      const absolutePath = path.resolve(ICONS_PATH);
      fs.readdir(absolutePath, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
        const folders = files.filter(file => file.isDirectory()).map(file => file.name);
        this.sendSocketNotification("8x8_GET_CATEGORIES_RESP", folders);
      });
    }
  }
})
