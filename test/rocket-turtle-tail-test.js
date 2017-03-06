/* eslint-disable no-unused-expressions */
'use strict';
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs');
const os = require('os');

// Module we are testing
const RocketTurtleTail = require('../lib/rocket-turtle-tail');

// The line endings to test with
const LINE_ENDINGS = [
  { lineEnding: '\n', description: 'unix' },
  { lineEnding: '\r\n', description: 'win32' }
];

// Directory for test file to go in
const TEST_DIR = fs.mkdtempSync(path.join(os.tmpdir()) + path.sep);

// Test file location
const TEST_PATH = path.join(TEST_DIR, 'test-file-name.txt');

// Timeout length to allow for filesystem hooks to be called
const TIMOUT_LENGTH = 50;

describe('RocketTurtleTail', () => {
  beforeEach('Create file', () => {
    // Create empty test file
    fs.writeFileSync(TEST_PATH, '');
  });

  afterEach(() => {
    // Remove empty test file
    fs.unlinkSync(TEST_PATH);
  });

  // Create test cases for DIFFERENT line endings
  LINE_ENDINGS.forEach((ending) => {
    describe('Line endings: ' + ending.description, () => {
      it('should read a single line written to a file', (done) => {
        fs.appendFileSync(TEST_PATH, 'FIRST_LINE' + ending.lineEnding);
        const onLineSpy = sinon.spy();
        const tail = new RocketTurtleTail(TEST_PATH);
        tail.on(RocketTurtleTail.EVENTS.LINE, onLineSpy);
        tail.start();

        setTimeout(() => {
          fs.appendFileSync(TEST_PATH, 'Testing' + ending.lineEnding, { encoding: 'utf-8' });
          setTimeout(() => {
            tail.stop();
            expect(onLineSpy.calledOnce).to.be.true; // standard ignore:line
            expect(onLineSpy.calledWithExactly('Testing')).to.be.true; // jshint ignore:line
            done();
          }, TIMOUT_LENGTH);
        }, TIMOUT_LENGTH);
      });

      it('should read MANY lines written to a file', (done) => {
        fs.appendFileSync(TEST_PATH, 'FIRST_LINE' + ending.lineEnding);
        const onLineSpy = sinon.spy();
        const tail = new RocketTurtleTail(TEST_PATH, { fromBeginning: true });
        tail.on(RocketTurtleTail.EVENTS.LINE, onLineSpy);
        tail.start();

        setTimeout(() => {
          const arr = [
            'line',
            'another line',
            'more lines',
            'WOOOOOOOO',
            ''
          ];
          fs.appendFileSync(TEST_PATH, arr.join(ending.lineEnding), { encoding: 'utf-8' });
          setTimeout(() => {
            tail.stop();
            expect(onLineSpy.callCount).to.equal(5);
            expect(onLineSpy.calledWithExactly('FIRST_LINE')).to.be.true;
            expect(onLineSpy.calledWithExactly('line')).to.be.true;
            expect(onLineSpy.calledWithExactly('another line')).to.be.true;
            expect(onLineSpy.calledWithExactly('more lines')).to.be.true;
            expect(onLineSpy.calledWithExactly('WOOOOOOOO')).to.be.true;
            done();
          }, TIMOUT_LENGTH);
        }, TIMOUT_LENGTH);
      });

      it('should honor fromBeginning: true', (done) => {
        fs.appendFileSync(TEST_PATH, 'FIRST_LINE' + ending.lineEnding);
        const onLineSpy = sinon.spy();
        const tail = new RocketTurtleTail(TEST_PATH, { fromBeginning: true });
        tail.on(RocketTurtleTail.EVENTS.LINE, onLineSpy);
        tail.start();
        setTimeout(() => {
          fs.appendFileSync(TEST_PATH, 'Testingzzz' + ending.lineEnding, { encoding: 'utf-8' });
          setTimeout(() => {
            tail.stop();
            expect(onLineSpy.calledTwice).to.be.true;
            expect(onLineSpy.calledWithExactly('FIRST_LINE')).to.be.true;
            expect(onLineSpy.calledWithExactly('Testingzzz')).to.be.true;
            done();
          }, TIMOUT_LENGTH);
        }, TIMOUT_LENGTH);
      });

      it('should honor fromBeginning: true with no new lines written', (done) => {
        fs.appendFileSync(TEST_PATH, 'FIRST_LINE' + ending.lineEnding);
        const onLineSpy = sinon.spy();
        const tail = new RocketTurtleTail(TEST_PATH, { fromBeginning: true });
        tail.on(RocketTurtleTail.EVENTS.LINE, onLineSpy);
        tail.start();
        setTimeout(() => {
          tail.stop();
          expect(onLineSpy.calledOnce).to.be.true;
          expect(onLineSpy.calledWithExactly('FIRST_LINE')).to.be.true;
          done();
        }, TIMOUT_LENGTH);
      });
    });
  });
});
