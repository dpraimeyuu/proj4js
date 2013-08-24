define(['../common'],function(common) {
  return {

    /* Initialize the Cylindrical Equal Area projection
  -------------------------------------------*/
    init: function() {
      //no-op
      if (!this.sphere) {
        this.k0 = common.msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
      }
    },


    /* Cylindrical Equal Area forward equations--mapping lat,long to x,y
    ------------------------------------------------------------*/
    forward: function(p) {
      var lon = p.x;
      var lat = p.y;
      var x, y;
      /* Forward equations
      -----------------*/
      var dlon = common.adjust_lon(lon - this.long0);
      if (this.sphere) {
        x = this.x0 + this.a * dlon * Math.cos(this.lat_ts);
        y = this.y0 + this.a * Math.sin(lat) / Math.cos(this.lat_ts);
      }
      else {
        var qs = common.qsfnz(this.e, Math.sin(lat));
        x = this.x0 + this.a * this.k0 * dlon;
        y = this.y0 + this.a * qs * 0.5 / this.k0;
      }

      p.x = x;
      p.y = y;
      return p;
    }, //ceaFwd()

    /* Cylindrical Equal Area inverse equations--mapping x,y to lat/long
    ------------------------------------------------------------*/
    inverse: function(p) {
      p.x -= this.x0;
      p.y -= this.y0;
      var lon, lat;

      if (this.sphere) {
        lon = common.adjust_lon(this.long0 + (p.x / this.a) / Math.cos(this.lat_ts));
        lat = Math.asin((p.y / this.a) * Math.cos(this.lat_ts));
      }
      else {
        lat = common.iqsfnz(this.e, 2 * p.y * this.k0 / this.a);
        lon = common.adjust_lon(this.long0 + p.x / (this.a * this.k0));
      }

      p.x = lon;
      p.y = lat;
      return p;
    } //ceaInv()
  };

});
