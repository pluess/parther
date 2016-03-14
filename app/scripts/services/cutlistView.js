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

    var renderer;
    var stage;
    var partsContainer;
    var sheetsContainer;
    var pixiArea = $('#pixi-area');
    
    this.setUp = function() {
      pixiArea.empty();
      // create an new instance of a pixi stage
      stage = new PIXI.Container();
      partsContainer = new PIXI.Container();
      sheetsContainer = new PIXI.Container();

      stage.addChild(partsContainer);
      //stage.addChild(sheetsContainer);

      // create a renderer instance.
      renderer = PIXI.autoDetectRenderer(500, 500, {backgroundColor : 0xFFFFFF});
      pixiArea.append(renderer.view);
      renderer.render(stage);
    };

    this.updateParts = function (parts) {
      partsContainer.removeChildren();
      var title = new PIXI.Text('Parts', {font: '16px Arial'});
      partsContainer.addChild(title);
      var offset = title.getBounds().height+5;
      angular.forEach(parts, function(p) {
        var rectanglePart = new PIXI.Graphics();
        rectanglePart.beginFill(0xd3b176); // light brown
        rectanglePart.lineStyle(1, 'black');
        rectanglePart.drawRect(1, 1, p.width, p.height);
        var text = new PIXI.Text(p.name+'('+ p.width+'x'+ p.height+')', {font: '12px Arial'});
        rectanglePart.addChild(text);
        text.y = 3;
        text.x = 3;
        partsContainer.addChild(rectanglePart);
        rectanglePart.y = offset;
        offset = offset + p.height+15;
      });

      renderer.render(partsContainer);
    };

    this.updateSheet = function(sheet) {

      // create an new instance of a pixi stage
      stage = new PIXI.Container();

      // create a renderer instance.
      renderer = PIXI.autoDetectRenderer(sheet.x+1, sheet.y+1);
      pixiArea.append(renderer.view);
    };

    this.updatePartsInSheet = function (cutlist) {
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
        graphics.drawRect(item.xorigin+1, item.yorigin, item.x, item.y);
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
