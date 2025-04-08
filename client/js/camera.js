define(function () {
  var Camera = Class.extend({
    init: function (renderer) {
      this.renderer = renderer;
      this.x = 0;
      this.y = 0;
      this.gridX = 0;
      this.gridY = 0;
      this.offset = 0.5;
      this.rescale();
    },

    rescale: function () {
      var factor = this.renderer.mobile ? 1 : 2;

      this.gridW = 15 * factor;
      this.gridH = 7 * factor;

      console.debug("---------");
      console.debug("Factor:" + factor);
      console.debug("W:" + this.gridW + " H:" + this.gridH);
    },

    setPosition: function (x, y) {
      this.x = x;
      this.y = y;

      this.gridX = Math.floor(x / 16);
      this.gridY = Math.floor(y / 16);
    },

    setGridPosition: function (x, y) {
      this.gridX = x;
      this.gridY = y;

      this.x = this.gridX * 16;
      this.y = this.gridY * 16;
    },

    lookAt: function (entity) {
      var r = this.renderer,
        x = Math.round(entity.x - Math.floor(this.gridW / 2) * r.tilesize),
        y = Math.round(entity.y - Math.floor(this.gridH / 2) * r.tilesize);

      this.setPosition(x, y);
    },

    forEachVisiblePosition: function (callback, extra) {
      var extra = extra || 0;
      for (
        var y = this.gridY - extra, maxY = this.gridY + this.gridH + extra * 2;
        y < maxY;
        y += 1
      ) {
        for (
          var x = this.gridX - extra,
            maxX = this.gridX + this.gridW + extra * 2;
          x < maxX;
          x += 1
        ) {
          callback(x, y);
        }
      }
    },

    isVisible: function (entity) {
      return this.isVisiblePosition(entity.gridX, entity.gridY);
    },

    isVisiblePosition: function (x, y) {
      if (
        y >= this.gridY &&
        y < this.gridY + this.gridH &&
        x >= this.gridX &&
        x < this.gridX + this.gridW
      ) {
        return true;
      } else {
        return false;
      }
    },

    focusEntity: function (entity) {
      if (!entity) {
        console.error("Cannot focus on null entity");
        return;
      }

      console.log("Focusing camera on entity at", entity.gridX, entity.gridY);

      // Completely reset camera position
      this.setPosition(0, 0);

      // First, use the direct approach to center the camera on the entity
      var r = this.renderer,
        tileSize = r.tilesize,
        halfScreenWidth = Math.floor(this.gridW / 2) * tileSize,
        halfScreenHeight = Math.floor(this.gridH / 2) * tileSize,
        x = Math.round(entity.x - halfScreenWidth),
        y = Math.round(entity.y - halfScreenHeight);

      // Ensure we're not positioning the camera out of bounds
      x = Math.max(
        0,
        Math.min(x, r.game.map.width * tileSize - this.gridW * tileSize)
      );
      y = Math.max(
        0,
        Math.min(y, r.game.map.height * tileSize - this.gridH * tileSize)
      );

      this.setPosition(x, y);

      console.log(
        "Camera position after focus:",
        this.x,
        this.y,
        "grid:",
        this.gridX,
        this.gridY
      );
    },
  });

  return Camera;
});