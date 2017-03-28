'use strict';

const EventEmitter = require('events').EventEmitter;
const fs = require('fs');

const DEFAULT_SEPARATOR = /[\r]{0,1}\n/;
const EVENTS = {
  LINE: 'line',
  ERROR: 'error'
};

/**
 * Introducing: TurtleTail!
 * A class that makes following a file a breeze!
 *
 * Works best with log files and similar things
 */
class TurtleTail extends EventEmitter {
  constructor (path, options) {
    super();
    this._path = path;

    options = options || {};
    this._fromBeginning = options.fromBeginning || false;
    this._useWatchFile = options.useWatchFile || false;
    this._interval = options.interval || 5000;
    this._separator = options.separator || DEFAULT_SEPARATOR;

    this._watchFunction = this._onWatchEvent.bind(this);
    this._queue = [];
    this._buffer = '';
    this._isWatching = false;
    this._watchObj = null;
    this._lastPosition = -1;
  }

  /**
   * Start tailing the file, this does not happen automatically in case an
   * instance of this class is created and then the events are bound
   * asyncronously
   */
  start () {
    if (this._isWatching) { return; }

    if (fs.existsSync(this._path)) {
      this._lastPosition = 0;
      this._isWatching = true;

      if (this._useWatchFile) {
        fs.watchFile(this._path, { timeout: this._interval }, this._watchFunction);
      } else {
        this._watchObj = fs.watch(this._path, this._watchFunction);
      }

      if (!this._fromBeginning) {
        this._lastPosition = fs.statSync(this._path).size;
      } else {
        this._watchFunction('change');
      }
    } else {
      this.emit(EVENTS.ERROR, 'File does not exist');
    }
  }

  /**
   * Stops watching the specified file
   */
  stop () {
    if (this._isWatching) {
      if (this._useWatchFile) {
        fs.unwatchFile(this._path, this._watchFunction);
      } else {
        this._watchObj.close();
        this._watchObj = null;
      }

      this._isWatching = false;
    }
  }

  /**
   * Called when a watch event is raised for either `fs.watch` or `fs.watchFile`
   * @param {e} String | fs.watchFile event
   */
  _onWatchEvent (e) {
    // Normalize the events for the different fs calls
    const type = e.size ? 'change' : e;

    if (type === 'change') {
      // The file changed! Start up the reading!
      const end = fs.statSync(this._path).size;
      this._queue.push([ this._lastPosition, end ]);
      this._lastPosition = end;
      if (this._queue.length === 1) {
        this._readNext();
      }
    } else if (type === 'rename') {
      this.emit(TurtleTail.EVENTS.ERROR, 'File was removed');
    }
  }

  /**
   * Processes the queue of reads one at a time.
   * Splits up the file content by `this._separator`
   */
  _readNext () {
    if (this._queue.length === 0) { return; }
    const queueItem = this._queue.shift();
    const start = queueItem[0];
    const end = queueItem[1];

    if (end > start) {
      const stream = fs.createReadStream(this._path, { start: start, end: end - 1, encoding: 'utf-8' });

      stream.on('error', (err) => this.emit(EVENTS.ERROR, err));
      stream.on('end', () => { this._readNext(); });
      stream.on('data', (data) => {
        this._buffer += data;

        // Only process if the separator is found, if not the file could contain
        // partial content on the 'line'
        if (this._buffer.match(this._separator)) {
          const parts = this._buffer.split(this._separator);
          parts.forEach((line) => {
            if (line.length) {
              this.emit(EVENTS.LINE, line);
            }
          });

          this._buffer = '';
        }
      });
    }
  }
}

TurtleTail.EVENTS = EVENTS;

module.exports = TurtleTail;
