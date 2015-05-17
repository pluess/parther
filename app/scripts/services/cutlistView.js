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

    var stage, renderer;
    var pixiArea = $('#pixi-area');

    this.updateSheet = function(sheet) {
      pixiArea.empty();
      // create an new instance of a pixi stage
      stage = new PIXI.Stage(0x66FF99);

      // create a renderer instance.
      renderer = PIXI.autoDetectRenderer(sheet.x+1, sheet.y+1);
      pixiArea.append(renderer.view);
    };

    this.updateParts = function (cutlist) {
      if (stage) {
        stage.removeChildren();
      }
      angular.forEach(cutlist, function(item, count) {
        var graphics = new PIXI.Graphics();
        graphics.beginFill(0xFFFFFF);
        graphics.lineStyle(1, 0xFF0000);
        graphics.drawRect(item.xorigin, item.yorigin, item.x, item.y);
        var text = new PIXI.Text(count+1, {font: '10px Arial', fill: 'green'});
        text.position.x = item.xorigin+5;
        text.position.y = item.yorigin;
        graphics.addChild(text);
        stage.addChild(graphics);
        renderer.render(stage);
      });
    };
  });
