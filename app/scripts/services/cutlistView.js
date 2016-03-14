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
    var partMaxWidth = 0;

    this.setUp = function() {
      pixiArea.empty();
      // create an new instance of a pixi stage
      stage = new PIXI.Container();
      partsContainer = new PIXI.Container();
      sheetsContainer = new PIXI.Container();

      stage.addChild(partsContainer);
      stage.addChild(sheetsContainer);

      // create a renderer instance.
      renderer = PIXI.autoDetectRenderer(500, 500, {backgroundColor : 0xFFFFFF});
      pixiArea.append(renderer.view);
      renderer.render(stage);
    };

    this.drawParts = function (parts) {
      partsContainer.removeChildren();
      var title = new PIXI.Text('Parts', {font: '16px Arial'});
      partsContainer.addChild(title);
      var offset = title.getBounds().height+5;
      partMaxWidth = 0;
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
        partMaxWidth = Math.max(
          partMaxWidth,
          p.width,
          3+text.getBounds().width
        );
      });

      renderer.render(partsContainer);
    };

    this.drawSheet = function(sheet) {
      sheetsContainer.removeChildren();
      var rectangleSheet = new PIXI.Graphics();
      rectangleSheet.beginFill(0xf7e6c8); // very light brown
      rectangleSheet.lineStyle(1, 'black');
      rectangleSheet.drawRect(1, 1, sheet.x, sheet.y);
      sheetsContainer.addChild(rectangleSheet);
      sheetsContainer.x = partMaxWidth + 10;

      renderer.render(stage);
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
