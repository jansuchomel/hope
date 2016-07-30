import axios from 'axios';

import { wrapInPromise } from '../utils/misc';

class Api {
  constructor() {
    this.root = 'http://127.0.0.1:8080';

    this.listeners = new Map();

    this.wsConnection = new WebSocket('ws://127.0.0.1:8080/ws');
    this.wsConnection.onmessage = this.handleMessage.bind(this);

    this.getAvailableSources = this.getAvailableSources.bind(this);
    this.getSource = this.getSource.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
  }

  handleMessage(message) {
    const parsed = JSON.parse(message.data);
    if (this.listeners.has(parsed.event)) {
      this.listeners.get(parsed.event).forEach(listener => {
        listener(parsed.data);
      });
    }
  }

  addListener(event, listener) {
    let oldListeners = [];
    if (this.listeners.has(event)) {
      oldListeners = this.listeners.get(event);
    }
    oldListeners.push(listener);
    this.listeners.set(event, oldListeners);
  }

  getAvailableSources() {
    return axios.get(`${this.root}/available_sources`);
  }

  getSource(source) {
    return axios.get(`${this.root}/library/${source}`);
  }

  play(source, trackId) {
    return wrapInPromise(() => {
      this.wsConnection.send(JSON.stringify({
        method: 'play',
        params: [source, trackId],
      }));
    });
  }

  pause() {
    return wrapInPromise(() => {
      this.wsConnection.send(JSON.stringify({
        method: 'pause',
      }));
    });
  }

  resume() {
    return wrapInPromise(() => {
      this.wsConnection.send(JSON.stringify({
        method: 'resume',
      }));
    });
  }
}

const singleton = new Api();
export default singleton;
