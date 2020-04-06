// querySelectorAll().forEach polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback) {
    for (var i = 0; i < this.length; i++) {
      callback.call(window, this[i], i, this);
    }
  };
}
