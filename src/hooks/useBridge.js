const bridge = window.AndroidBridge || {};

export const useBridge = () => ({
  requestPermission: bridge.reqPerm || (() => Promise.resolve(false)),
  takePhoto: bridge.takePic || (() => Promise.resolve('')),
  getLocation: bridge.getLoc || (() => Promise.resolve('')),
  getDeviceInfo: bridge.getDev || (() => Promise.resolve('{}')),
  speakText: bridge.speak || (() => {}),
  notify: bridge.notify || (() => {}),
  isAvailable: !!window.AndroidBridge,
});
