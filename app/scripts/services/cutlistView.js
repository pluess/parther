'use strict';

/**
 * @ngdoc service
 * @name partherApp.graphics
 * @description
 * # graphics
 * Service in the partherApp.
 */
angular.module('partherApp')
  .service('cutlistView', ['$log', function ($log) {

      /** @type {Phaser.Game} */
      var game;

      /** @type {Phaser.Group} */
      var partsGroup;

      /** @type {Phaser.Group} */
      var sheetsGroup;

      /** @type Phaser.Graphics */
      var partsGraphics;

      var parts;

      function create() {
          game.stage.backgroundColor = 0xffffff;

          partsGroup = game.add.group();

          partsGraphics = game.add.graphics(0, 0 ,partsGroup );
      }

      function update() {
          partsGraphics.clear();
          partsGraphics.lineStyle(1, 0x000000);
          partsGraphics.beginFill(0xd3b176);

          var offset = 0;
          angular.forEach(parts, function (p) {
              partsGraphics.drawRect(0, offset, p.width, p.height);
              offset += p.height + 10;
          });

          partsGraphics.endFill();
      }

      this.setUp = function () {
          game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-area', {create: create, update: update});
      };

      this.setParts = function (inParts) {
          parts = inParts;
      };

/*
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
*/

/*    this.drawSheet = function(sheet) {
      sheetsContainer.removeChildren();
      var rectangleSheet = new PIXI.Graphics();
      rectangleSheet.beginFill(0xf7e6c8); // very light brown
      rectangleSheet.lineStyle(1, 'black');
      rectangleSheet.drawRect(1, 1, sheet.x, sheet.y);
      sheetsContainer.addChild(rectangleSheet);
      sheetsContainer.x = partMaxWidth + 10;

      renderer.render(stage);
    };*/

/*    this.updatePartsInSheet = function (cutlist) {
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
    };*/

  }]);
