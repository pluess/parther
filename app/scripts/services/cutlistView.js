'use strict';

/**
 * @ngdoc service
 * @name partherApp.graphics
 * @description
 * # graphics
 * Service in the partherApp.
 */
angular.module('partherApp')
  .service('cutlistView', function () {

    var stage, renderer, graphics;

    (function () {
      // init PIXI
      // create an new instance of a pixi stage
      stage = new PIXI.Stage(0x66FF99);

      // create a renderer instance.
      renderer = PIXI.autoDetectRenderer(400, 300);

      $('#pixi-area').append(renderer.view);
    }());

    this.updateView = function (cutlist) {
      stage.removeChildren();
      angular.forEach(cutlist, function(item) {
        graphics = new PIXI.Graphics();
        graphics.beginFill(0xFFFFFF);
        graphics.lineStyle(1, 0xFF0000);
        graphics.drawRect(item.x, item.y, item.width, item.length);
        stage.addChild(graphics);
      });
      renderer.render(stage);
    };
  });
