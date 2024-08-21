'use strict';
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;
const keyMappings = require('./keycodes');

const KEY_EVENT_TYPES = ['key-release', 'key-press', 'key-hold'];
const EV_KEY_CODE = 1;

// Custom class to handle keyboard events from Linux input
class KeyboardListener extends EventEmitter {
  constructor(devicePath = 'event0') {
    super();
    this.device = devicePath;
    this.bufferLength = 24;
    this.buffer = Buffer.alloc(this.bufferLength);
    this.inputStream = fs.createReadStream(`/dev/input/${this.device}`);
    this._initiateRead();
  }

  _initiateRead() {
    this.inputStream.on('data', (chunk) => {
      this.buffer = chunk.slice(24); // Grab the event data from the buffer.
      const eventData = this._processInputBuffer(this.buffer);
      if (eventData) {
        eventData.device = this.device;
        this.emit(eventData.type, eventData);
      }
    });

    this.inputStream.on('error', (error) => {
      this.emit('error', error);
      throw new Error(`Input device error: ${error.message}`);
    });
  }

  _processInputBuffer(buffer) {
    let parsedEvent = null;
    if (buffer.readUInt16LE(16) === EV_KEY_CODE) {
      parsedEvent = {
        timestamp: {
          seconds: buffer.readUInt16LE(0),
          milliseconds: buffer.readUInt16LE(8),
        },
        keyCode: buffer.readUInt16LE(18),
        type: KEY_EVENT_TYPES[buffer.readUInt32LE(20)],
      };
      parsedEvent.keyName = keyMappings[parsedEvent.keyCode] || 'UNKNOWN_KEY';
    }
    return parsedEvent;
  }
}

// Exporting the class with key mappings
KeyboardListener.KeyCodes = keyMappings;

module.exports = KeyboardListener;
