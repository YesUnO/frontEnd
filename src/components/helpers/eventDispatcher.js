import Phaser from 'phaser'

/* eslint-disable no-unused-vars */

let instance = null
export default class EventDispatcher extends Phaser.Events.EventEmitter {
  constructor () {
    super()
    if (instance == null) {
      instance = this
    }
  }
  static getInstance () {
    if (instance == null) {
      instance = new EventDispatcher()
    }
    return instance
  }
}
