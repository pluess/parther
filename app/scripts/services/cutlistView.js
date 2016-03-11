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
      stage = new PIXI.Container();

      // create a renderer instance.
      renderer = PIXI.autoDetectRenderer(sheet.x+1, sheet.y+1);
      pixiArea.append(renderer.view);
    };

    this.updateParts = function (cutlist) {
      if (stage) {
        stage.removeChildren();
      }
      angular.forEach(cutlist, function(item, index) {
        var graphics = new PIXI.Graphics();
        if (item.usedBy!==null) {
          graphics.beginFill(0x99CCFF);
        }
        else {
          graphics.beginFill(0xFF9999);
        }
        graphics.lineStyle(1, 'black');
        graphics.drawRect(item.xorigin, item.yorigin, item.x, item.y);
        var text;
        if (item.usedBy!==null) {
          text = new PIXI.Text(''+(index+1)+': '+item.usedBy.name, {font: '14px Arial', fill: 'green'});
        }
        else {
          text = new PIXI.Text(''+(index+1), {font: '14px Arial', fill: 'green'});
        }
        text.position.x = item.xorigin+5;
        text.position.y = item.yorigin;
        graphics.addChild(text);
        stage.addChild(graphics);
        renderer.render(stage);
      });
    };
  });
