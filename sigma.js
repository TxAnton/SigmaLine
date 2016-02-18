// Generated by CoffeeScript 1.8.0
(function() {
  var SerialPort, Sigma, config, logger;

  SerialPort = require("serialport").SerialPort;

  logger = require('./logger.js');

  config = require('./config.js');

  Sigma = (function() {
    function Sigma() {
      this.DEFAULT_COLOR = "\\a";
      this.SIGMA_LENGTH = 13;
      this.port = new SerialPort(config.getComPort(), config.getComConfig(), false);
      this.win = config.getSigmaWindow();
      this.color = this.codeColor(config.getSigmaColor());
      this.numberColor = this.codeColor(config.getSigmaNumberColor());
      this.LETTER_CODES = {
        'А': 'A'.charCodeAt(0),
        'Б': 0x81,
        'В': 'B'.charCodeAt(0),
        'Г': 0x83,
        'Д': 0x84,
        'Е': 'E'.charCodeAt(0),
        'Ё': 0x86,
        'Ж': 0x87,
        'З': 0x88,
        'И': 0x89,
        'Й': 0x8A,
        'К': 'K'.charCodeAt(0),
        'Л': 0x8C,
        'М': 'M'.charCodeAt(0),
        'Н': 'H'.charCodeAt(0),
        'О': 'O'.charCodeAt(0),
        'П': 0x90,
        'Р': 'P'.charCodeAt(0),
        'С': 'C'.charCodeAt(0),
        'Т': 'T'.charCodeAt(0),
        'У': 0x94,
        'Ф': 0x95,
        'Х': 'X'.charCodeAt(0),
        'Ц': 0x97,
        'Ч': 0x98,
        'Ш': 0x99,
        'Щ': 0x9A,
        'Ъ': 0x9B,
        'Ы': 0x9C,
        'Ь': 'b'.charCodeAt(0),
        'Э': 0x9E,
        'Ю': 0x9F,
        'Я': 0xA0,
        'а': 'a'.charCodeAt(0),
        'б': 0xA2,
        'в': 0xA3,
        'г': 0xA4,
        'д': 0xA5,
        'е': 'e'.charCodeAt(0),
        'ё': 0xA7,
        'ж': 0xA8,
        'з': 0xA9,
        'и': 0xAA,
        'й': 0xAB,
        'к': 'k'.charCodeAt(0),
        'л': 0xAD,
        'м': 0xAE,
        'н': 0xAF,
        'о': 'o'.charCodeAt(0),
        'п': 0xB1,
        'р': 'p'.charCodeAt(0),
        'с': 'c'.charCodeAt(0),
        'т': 0xE0,
        'у': 0xE1,
        'ф': 0xE2,
        'х': 'x'.charCodeAt(0),
        'ц': 0xE4,
        'ч': 0xE5,
        'ш': 0xE6,
        'щ': 0xE7,
        'ъ': 0xE8,
        'ы': 0xE9,
        'ь': 0xEA,
        'э': 0xEB,
        'ю': 0xEC,
        'я': 0xED
      };
    }

    Sigma.prototype.send = function(buffer) {
      return this.port.open((function(_this) {
        return function(err) {
          if (err) {
            logger.log("Eror Opening Com Port " + err);
          }
          logger.log("sending " + (buffer.toString()) + "  json= " + (JSON.stringify(buffer)));
          return _this.port.write(buffer, function(err, res) {
            if (err) {
              logger.log("Eror Writing Com Port " + err);
            }
            if (res) {
              return logger.log("Com Port Result " + res);
            }
          });
        };
      })(this));
    };

    Sigma.prototype.codeColor = function(str) {
      var color;
      color = this.DEFAULT_COLOR;

      /*
      Не очень ясно что из этого работает, взято
        здесь http://dz.livejournal.com/362438.html
        и здесь http://eta4ever.livejournal.com/35676.html
        // \a - dark red
        // \b - red
        // \d - light yellow
        // \c - dark orange
        // \e - light orange
        // \e - very light orange
        // \g - green
        // \h - light green
        // \i - rainbow
        // \j - layers g y r
        // \k - vert bicolor red/orange
        // \l - vert bicolor green/red
        // \m revers green onred
        // \n reverse red on green
        // \o oragnge on red
        // \p yellow on green
        // \q - change font char ytable
        // \r - double width
        // \s - (orange?) standard font
        // \t - double size
        // \\u - big size
        // \v - triple size
        // \w - half size
       */
      switch (str) {
        case "dark-red":
          color = "\\a";
          break;
        case "red":
          color = "\\b";
          break;
        case "light-yellow":
          color = "\\d";
          break;
        case "dark-orange":
          color = "\\c";
          break;
        case "light-orange":
          color = "\\e";
          break;
        case "green":
          color = "\\g";
          break;
        case "light-green":
          color = "\\h";
          break;
        case "rainbow":
          color = "\\i";
          break;
        case "red-orange":
          color = "\\k";
          break;
        case "green-red":
          color = "\\l";
          break;
        case "orange-red":
          color = "\\o";
          break;
        case "yellow-green":
          color = "\\p";
      }
      return color;
    };

    Sigma.prototype.codeString = function(str) {
      var ch, i, newStr, _i, _len, _ref;
      newStr = '';
      for (i = _i = 0, _len = str.length; _i < _len; i = ++_i) {
        ch = str[i];
        if ((0x7f > (_ref = ch.charCodeAt(0)) && _ref > 0)) {
          newStr += ch;
        } else if (this.LETTER_CODES[ch]) {
          newStr += String.fromCharCode(this.LETTER_CODES[ch]);
        } else {
          newStr += '.';
        }
      }
      return new Buffer(newStr);
    };

    Sigma.prototype.writeNextInQueue = function(next) {
      var free, spaces;
      free = this.SIGMA_LENGTH - this.win.length;
      spaces = free - next.length;
      spaces = spaces > 0 ? spaces : 1;
      spaces = (new Buffer(spaces)).fill(' ').toString('');
      return this.write(this.color + this.win + spaces + this.numberColor + next);
    };

    Sigma.prototype.write = function(message) {
      var buffer;
      if (message == null) {
        message = '';
      }
      logger.log("Write message <" + message + "> to sigma");
      buffer = this.codeString("~128~f01B" + message);
      buffer = Buffer.concat([buffer, new Buffer([0, 0x0d, 0x0d, 0x0d])]);
      return this.send(buffer);
    };

    return Sigma;

  })();

  module.exports = new Sigma();

}).call(this);
