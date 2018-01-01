
/*!
sarine.viewer.slider - v1.0.0 -  Monday, January 1st, 2018, 2:01:26 PM 
 The source code, name, and look and feel of the software are Copyright © 2015 Sarine Technologies Ltd. All Rights Reserved. You may not duplicate, copy, reuse, sell or otherwise exploit any portion of the code, content or visual design elements without express written permission from Sarine Technologies Ltd. The terms and conditions of the sarine.com website (http://sarine.com/terms-and-conditions/) apply to the access and use of this software.
 */

(function() {
  var SarineSlider, Viewer,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Viewer = (function() {
    var error, rm;

    rm = ResourceManager.getInstance();

    function Viewer(options) {
      console.log("");
      this.first_init_defer = $.Deferred();
      this.full_init_defer = $.Deferred();
      this.src = options.src, this.element = options.element, this.autoPlay = options.autoPlay, this.callbackPic = options.callbackPic;
      this.id = this.element[0].id;
      this.element = this.convertElement();
      Object.getOwnPropertyNames(Viewer.prototype).forEach(function(k) {
        if (this[k].name === "Error") {
          return console.error(this.id, k, "Must be implement", this);
        }
      }, this);
      this.element.data("class", this);
      this.element.on("play", function(e) {
        return $(e.target).data("class").play.apply($(e.target).data("class"), [true]);
      });
      this.element.on("stop", function(e) {
        return $(e.target).data("class").stop.apply($(e.target).data("class"), [true]);
      });
      this.element.on("cancel", function(e) {
        return $(e.target).data("class").cancel().apply($(e.target).data("class"), [true]);
      });
    }

    error = function() {
      return console.error(this.id, "must be implement");
    };

    Viewer.prototype.first_init = Error;

    Viewer.prototype.full_init = Error;

    Viewer.prototype.play = Error;

    Viewer.prototype.stop = Error;

    Viewer.prototype.convertElement = Error;

    Viewer.prototype.cancel = function() {
      return rm.cancel(this);
    };

    Viewer.prototype.loadImage = function(src) {
      return rm.loadImage.apply(this, [src]);
    };

    Viewer.prototype.setTimeout = function(delay, callback) {
      return rm.setTimeout.apply(this, [this.delay, callback]);
    };

    return Viewer;

  })();

  this.Viewer = Viewer;

  SarineSlider = (function(_super) {
    var pluginDimention;

    __extends(SarineSlider, _super);

    pluginDimention = void 0;

    function SarineSlider(options) {
      this.preloadAssets = __bind(this.preloadAssets, this);
      SarineSlider.__super__.constructor.call(this, options);
      this.isAvailble = true;
      this.resourcesPrefix = options.baseUrl + "atomic/v1/assets/";
      this.atomConfig = configuration.experiences.filter(function(exp) {
        return exp.atom === "jewelrySequence";
      })[0];
      this.resources = [
        {
          element: 'script',
          src: 'threesixty.min.js'
        }, {
          element: 'link',
          src: 'threesixty.css'
        }
      ];
    }

    SarineSlider.prototype.convertElement = function() {
      var margin;
      pluginDimention = this.element.parent().height() !== 0 ? this.element.parent().height() : 300;
      margin = pluginDimention / 2 - 15;
      return this.element.append('<div id="sarine-slider" class="threesixty ringImg"><div class="spinner" style="margin-top:' + margin + 'px;"><span>0%</span></div><ol class="threesixty_images"></ol></div></div>');
    };

    SarineSlider.prototype.preloadAssets = function(callback) {
      var element, loaded, resource, totalScripts, triggerCallback, _i, _len, _ref, _results;
      loaded = 0;
      totalScripts = this.resources.map(function(elm) {
        return elm.element === 'script';
      });
      triggerCallback = function(callback) {
        loaded++;
        if (loaded === totalScripts.length - 1 && callback !== void 0) {
          return setTimeout((function(_this) {
            return function() {
              return callback();
            };
          })(this), 500);
        }
      };
      element;
      _ref = this.resources;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        resource = _ref[_i];
        element = document.createElement(resource.element);
        if (resource.element === 'script') {
          $(document.body).append(element);
          element.onload = element.onreadystatechange = function() {
            return triggerCallback(callback);
          };
          element.src = this.resourcesPrefix + resource.src + cacheVersion;
          _results.push(element.type = "text/javascript");
        } else {
          element.href = this.resourcesPrefix + resource.src + cacheVersion;
          element.rel = "stylesheet";
          element.type = "text/css";
          _results.push($(document.head).prepend(element));
        }
      }
      return _results;
    };

    SarineSlider.prototype.first_init = function() {
      var defer, _t;
      defer = $.Deferred();
      _t = this;
      this.preloadAssets(function() {
        var src;
        this.firstImageName = _t.atomConfig.imagePattern.replace("*", "1");
        src = "" + configuration.rawdataBaseUrl + "/" + _t.atomConfig.ImagesPath + "/" + configuration.jewelryId + "/slider/" + this.firstImageName + cacheVersion;
        return _t.loadImage(src).then(function(img) {
          if (img.src.indexOf('data:image') === -1 && img.src.indexOf('no_stone') === -1) {
            return defer.resolve(_t);
          } else {
            _t.isAvailble = false;
            _t.element.empty();
            this.canvas = $("<canvas>");
            this.canvas[0].width = img.width;
            this.canvas[0].height = img.height;
            this.ctx = this.canvas[0].getContext('2d');
            this.ctx.drawImage(img, 0, 0, img.width, img.height);
            this.canvas.attr({
              'class': 'no_stone'
            });
            _t.element.append(this.canvas);
            return defer.resolve(_t);
          }
        });
      });
      return defer;
    };

    SarineSlider.prototype.full_init = function() {
      var defer;
      defer = $.Deferred();
      if (this.isAvailble) {
        this.ringImg = this.element.find('.ringImg');
        this.imagePath = "" + configuration.rawdataBaseUrl + "/" + this.atomConfig.ImagesPath + "/" + configuration.jewelryId + "/slider/";
        this.filePrefix = this.atomConfig.imagePattern.replace(/\*.[^/.]+$/, '');
        this.fileExt = "." + (this.atomConfig.imagePattern.split('.').pop());
        this.ringImg.ThreeSixty({
          totalFrames: this.atomConfig.NumberOfImages,
          endFrame: this.atomConfig.NumberOfImages,
          currentFrame: 1,
          imgList: '.threesixty_images',
          progress: '.spinner',
          imagePath: this.imagePath,
          filePrefix: this.filePrefix,
          ext: this.fileExt + cacheVersion,
          height: pluginDimention,
          width: pluginDimention,
          navigation: false,
          responsive: true
        });
      }
      defer.resolve(this);
      return defer;
    };

    SarineSlider.prototype.play = function() {};

    SarineSlider.prototype.stop = function() {};

    return SarineSlider;

  })(Viewer);

  this.SarineSlider = SarineSlider;

}).call(this);
