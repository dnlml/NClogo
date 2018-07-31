const css = require('../styles/main.scss');
const sprite = require.context('../svg/sprite', false, /\.svg$/);
sprite.keys().forEach(sprite);

const WebFont = require('webfontloader');
const Logo = require('./parts/logo');

class App {
  constructor () {
    new Logo();
  }
}

new App();
// document.addEventListener('DOMContentLoaded', function () {
//   WebFont.load({
//     custom: {
//       families: ['']
//     },
//     active: function () {
//       new App();
//     },
//     inactive: function () {
//       new App();
//     }
//   });
// });
