
/*!
sarine.viewer.slider - v0.4.0 -  Tuesday, October 18th, 2016, 1:51:02 PM 
 The source code, name, and look and feel of the software are Copyright © 2015 Sarine Technologies Ltd. All Rights Reserved. You may not duplicate, copy, reuse, sell or otherwise exploit any portion of the code, content or visual design elements without express written permission from Sarine Technologies Ltd. The terms and conditions of the sarine.com website (http://sarine.com/terms-and-conditions/) apply to the access and use of this software.
 */

(function() {
  var SarineSlider,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SarineSlider = (function(_super) {
    var pluginDimention;

    __extends(SarineSlider, _super);

    pluginDimention = void 0;

    function SarineSlider(options) {
      this.preloadAssets = __bind(this.preloadAssets, this);
      SarineSlider.__super__.constructor.call(this, options);
      this.ImagesPath = options.ImagesPath, this.ImageName = options.ImageName, this.NumberOfImages = options.NumberOfImages, this.ImageExtention = options.ImageExtention, this.ImagePrefix = options.ImagePrefix;
      this.isAvailble = true;
      this.resourcesPrefix = options.baseUrl + "atomic/v1/assets/";
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
        src = configuration.configUrl + _t.ImagesPath + _t.ImageName + _t.ImageExtention;
        return _t.loadImage(src).then(function(img) {
          if (img.src.indexOf('data:image') === -1 && img.src.indexOf('no_stone') === -1) {
            return defer.resolve(_t);
          } else {
            _t.isAvailble = false;
            $('#sarine-slider').remove();
            this.canvas = $("<canvas>");
            this.canvas[0].width = img.width;
            this.canvas[0].height = img.height;
            this.ctx = this.canvas[0].getContext('2d');
            this.ctx.drawImage(img, 0, 0, img.width, img.height);
            this.canvas.attr({
              'class': 'no_stone'
            });
            return _t.element.append(this.canvas);
          }
        });
      });
      return defer;
    };

    SarineSlider.prototype.full_init = function() {
      var defer;
      defer = $.Deferred();
      if (this.isAvailble) {
        $('.ringImg').ThreeSixty({
          totalFrames: this.NumberOfImages,
          endFrame: this.NumberOfImages,
          currentFrame: 1,
          imgList: '.threesixty_images',
          progress: '.spinner',
          imagePath: configuration.configUrl + '/images/',
          filePrefix: this.ImagePrefix,
          ext: this.ImageExtention,
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
