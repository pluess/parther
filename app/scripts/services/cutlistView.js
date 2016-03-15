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

        /** @type {Phaser.Graphics} */
        var sheetGraphics;

        /** @type Phaser.Sprite */
        var currentPartSprite;

        var parts;

        var sheet;

        function create() {
            game.stage.backgroundColor = 0xffffff;

            partsGroup = game.add.group();

            sheetsGroup = game.add.group();
            sheetGraphics = game.add.graphics(0, 0, sheetsGroup);

            drawParts();
            drawSheet();
        }

        function drawParts() {
            if (partsGroup && parts) {
                var offset = 0;
                angular.forEach(parts, function (p) {
                    /** @type Phaser.Graphics */
                    var partGraphic = game.add.graphics(0, offset, partsGroup);
                    partGraphic.part = p;
                    partGraphic.lineStyle(1, 0x000000);
                    partGraphic.beginFill(0xd3b176); // light brown
                    partGraphic.drawRect(0, 0, p.width, p.height);
                    partGraphic.endFill();
                    partGraphic.inputEnabled = true;
                    partGraphic.events.onInputDown.add(initNewPart);
                    offset += p.height + 10;
                });

            }
            alignGroups();
        }

        function drawSheet() {
            if (sheetGraphics && sheet) {
                sheetGraphics.clear();
                sheetGraphics.lineStyle(1, 0x000000);
                sheetGraphics.beginFill(0xe5d2b0); // very light brown
                sheetGraphics.drawRect(0, 0, sheet.x, sheet.y);
                sheetGraphics.endFill();
            }
            alignGroups();
        }

        function alignGroups() {
            if (partsGroup && sheetsGroup) {
                sheetsGroup.x = partsGroup.width + 10;
            }
        }

        /**
         * @param Phaser.Graphics partGraphic
         */
        function initNewPart(templatePartGraphic) {
            if (currentPartSprite) {
                currentPartSprite.destroy();
            }
            /** @type {Phaser.Graphics} */
            var graphics = game.add.graphics(templatePartGraphic.world.x + 5, templatePartGraphic.world.y + 5);
            graphics.lineStyle(1, 0x000000);
            graphics.beginFill(0xd3b176); // light brown
            graphics.drawRect(0, 0, templatePartGraphic.part.width, templatePartGraphic.part.height);
            graphics.endFill();

            currentPartSprite = game.add.sprite(graphics.world.x, graphics.world.y, graphics.generateTexture());
            currentPartSprite.inputEnabled = true;
            currentPartSprite.input.enableDrag();
            currentPartSprite.part = templatePartGraphic.part;

            graphics.destroy();
        }

        this.setUp = function () {
            game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-area', {create: create});
        };

        this.setParts = function (inParts) {
            parts = inParts;
            drawParts();
        };

        this.setSheet = function (inSheet) {
            sheet = inSheet;
            drawSheet();
        };

    }]);
