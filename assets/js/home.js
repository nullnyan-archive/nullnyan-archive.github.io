function _id(id) {
  return document.getElementById(id);
}

function _selector(s) {
  return document.querySelectorAll(s);
}

function _each(nodelist, callback) {
  Array.prototype.forEach.call(nodelist, callback);
}

function _apply(selector, callback) {
  _each(_selector(selector), callback);
}

function _create(e, id) {
  var T = document.createElement(e);
  if (typeof id === 'string') T.id = id;
  return T;
}

var av_w = 0,
  av_h = 0,
  delta = 0,
  r = -1,
  i = 0,
  j = 0,
  w = 0,
  h = 0,
  zone = {X: 0, Y: 0},
  map = [];
var flow, star;
var keys = {visualizer: false, log: false, move: false};

function hexes_move() {
  av_w = w - 700;
  av_h = h - 220;
  zone.X = w - 600 - ((zone.X / 106) | 0) * 3 - 100;
  zone.Y = h - 100 - ((zone.Y / 90) | 0) * 3 - 114;
  for (i = 0; i <= ((zone.X / 106) | 0); i++)
    for (j = 0; j <= ((zone.Y / 90) | 0); j++)
      if (!(j % 2)) map.push({X: 550 + i * 106, Y: 50 + j * 90});
      else map.push({X: 550 + i * 106 + 55 - 2, Y: 50 + j * 90});
  _apply('#boardlist a', function (element) {
    if (map.length < 1) delta = false;
    else {
      r = (Math.random() * map.length) | 0;
      delta = map[r];
    }
    if (delta) {
      element.style.left = delta.X + 'px';
      element.style.top = delta.Y + 'px';
      map.splice(r, 1);
    } else {
      element.style.left = ((550 + Math.random() * av_w) | 0) + 'px';
      element.style.top = ((50 + Math.random() * av_h) | 0) + 'px';
    }
    element.style.opacity = 1;
  });
}

function log() {
  if (keys.log) return false;
  keys.log = true;
  var timeout;
  var string,
    g,
    id,
    k = 0,
    pre = _id('logtxt'),
    color,
    intag = false;
  pre.parentNode.style.left = '0px';
  var add = function () {
    k = 0;
    string = txt[0] + '\n';
    var parse = function () {
      if (string[k] == '/' && /(D|R|G|B)/i.test(string[k + 1])) {
        if (string[k + 1] == 'D') {
          k += 2;
          intag = !intag;
          if (intag) {
            color = _create('i');
            color.setAttribute('gray', true);
          } else pre.appendChild(color);
        }
        if (string[k + 1] == 'R') {
          k += 2;
          intag = !intag;
          if (intag) {
            color = _create('i');
            color.setAttribute('red', true);
          } else pre.appendChild(color);
        }
        if (string[k + 1] == 'G') {
          k += 2;
          intag = !intag;
          if (intag) {
            color = _create('i');
            color.setAttribute('green', true);
          } else pre.appendChild(color);
        }
        if (string[k + 1] == 'B') {
          k += 2;
          intag = !intag;
          if (intag) {
            color = _create('i');
            color.setAttribute('blue', true);
          } else pre.appendChild(color);
        }
      } else {
        if (intag) color.innerHTML += string[k++];
        else pre.innerHTML += string[k++];
      }
      if (string[k] === undefined) {
        clearInterval(id);
        resolve();
      }
    };
    var resolve = function () {
      txt.splice(0, 1);
      if (txt.length > 0) timeout = setTimeout(add, ((Math.random() * 6) | (0 + 3)) * 1000);
      else {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          pre.style.left = '-500px';
          pre.parentNode.style.left = '-500px';
          keys.log = false;
        }, 10000);
      }
    };
    var reject = function () {
      console.error('Error in log promise');
    };
    if (window.Promise !== undefined) {
      g = new Promise(function (resolve, reject) {
        id = setInterval(parse, 10);
      });
      g.then(resolve, reject);
      g.catch(function (e) {
        console.error(e);
      });
    } else id = setInterval(parse, 10);
  };
  timeout = setTimeout(add, ((Math.random() * 6) | (0 + 3)) * 1000);
}

document.addEventListener(
  'keydown',
  function (event) {
    if (event.keyCode == 86) {
      if (!flow.working) return false;
      event.preventDefault();
      keys.visualizer = !keys.visualizer;
      var v = _id('spectrum');
      if (v) v.style.display = keys.visualizer ? 'block' : 'none';
      if (keys.visualizer && flow) flow.show();
    }
    if (event.keyCode == 76) {
      keys.log = !keys.log;
      var pre = _id('logtxt');
      if (!keys.log) pre.style.left = pre.parentNode.style.left = '-500px';
      else pre.style.left = pre.parentNode.style.left = '0px';
    }
    if (event.keyCode == 77) hexes_move();
  },
  false,
);
document.addEventListener(
  'DOMContentLoaded',
  function () {
    (w = document.documentElement.clientWidth), (h = document.documentElement.clientHeight);
    star = _id('star');
    var playerDOM =
      '<div id="spectrum" style="display:' +
      (keys.visualizer ? 'block' : 'none') +
      '"><canvas id="canvas" width="' +
      w +
      '" height="100"></canvas></div>';
    var audioDOM =
      '<audio src="/audio/Amethyst_Caverns.ogg" controls=false loop=true autoplay=true volume="0.1"></audio>';
    var starsDOM = '<canvas id="starfield" width="' + w + '" height="' + h + '"></canvas>';
    _id('player').innerHTML = playerDOM;
    _id('stars').innerHTML = starsDOM;
    var background = document.getElementById('background_loader');
    background.src = '/assets/img/bckg.jpg';
    background.onload = function () {
      document.getElementById('background').style.background =
        'url(' + background.src + ') 0 0 / 100% auto no-repeat transparent';
      document.getElementById('background').style.opacity = 1;
    };
    _id('logo').onclick = function (event) {
      event.preventDefault();
      hexes_move();
    };
    flow = new Flow();
    if (window.addEventListener) {
      window.addEventListener(
        'load',
        function () {
          //hexes_move();
          stars_start();
          flow.init();
          if (!flow.working) _id('player').innerHTML = audioDOM;
          hexes_move(); //setTimeout(hexes_move,15000);
        },
        false,
      );
    }
    star.style.left = (((w - 20) * Math.random()) | 0) + 10 + 'px';
    star.style.top = (((h - 20) * Math.random()) | 0) + 10 + 'px';
    star.style.visibility = 'visible';
    star.style.opacity = 1;
    star.addEventListener(
      'click',
      function () {
        log();
      },
      false,
    );
    setInterval(function () {
      star.style.opacity = star.style.opacity == '0' ? 1 : 0;
    }, 5000);
    setTimeout(log, 120000);
  },
  false,
);

var txt = [
  // D: gray, B: blue, R: red, G: green
  '[SpaceXTCS Console] v4.3.1b\n/B[XTCS]/B Init . . .',
  '~ Welcome aboard, anonymous! ~\n/D------------------------------/D',

  '\nanonymous@xtcs:~$ xtcs-connect -stype open -Z false -g 9000 -l type=GSA>90 --channel 0nyan --nearest 2>&1\nDetermining GSA for #0nyan...',
  'Connecting to nyan:827:AF14:16:Z08-359410 . . .',
  '/DUsing protocol GSA / global_space_address version 92.04 (c) Macrosoft 2029/D',
  '/B[GSA]/B Connected.',
  '/B[GSA]/B Waiting for server handshake invite . . .',
  '/B[GSA]/B Got response.\n/B[GSA]/B ! Ready to open connection bridge !',
  'Initializing TLS4.2 / Satellite Extranet CR:SD8',
  '- Sent cipher suites.',
  '- Verifying certificates.',
  '= Connection /GOK/G =\n',
  '[client hello] Now broadcasting on nyan:827/359410#0nyan `Nyanet`',

  '\nanonymous@xtcs:~$ xtcs-stat\nRetrieving statistics . . .',
  '~ Spaceship board №4047 model AX087-14',
  '~ [temperature inside: ' + (Math.random() * 5 + 24).toFixed(2) + ' C]',
  '~ [current speed: 0.98AE/min]',
  '~ [engine state: #01:OK #02:OK #03:/R!failure!/R #04:OK]',
  '~ [engine fuel: Q Type-8 (absolute fuel formula)]',
  '~ [vector: z301.148001/x10.901312/y97.9]',
  "~ [distance to nearest station: Station M905 'PulseA9' /D(retranslator)/D\n\t<-> 921.9 AE+]",
  "~ [now heading to: Station E1F3G37 'Mischa'\n\t(system: Tau Ceti / GSA=mint:1024:EFG9:63:U99-13370#nullchan) ]",
  '~ [distance to route aim: x:E1F3G37 <-> 34.090076 pc\n\t~ 111,188192 light years ~ 7031582,708125 AE ~ 105,190984e+16 m]',
  '~ [estimating time for arrival: 4883,043547 days ~ 13,37 years]',
  '/D= end of statistics =/D',

  '\nanonymous@xtcs:~$ xtcs-info\nRetrieving additional information . . .',
  '/B[System Interface]/B Available keys: /Gv l m/G',
  '~ `v` to enable visualizer. (now:' + (keys.visualizer ? 'active' : 'disabled') + ')',
  '~ `l` to toggle log window.',
  '~ `m` to move hexagons. ',
];
//window.addEventListener('resize',stars_resize,false);
//window.addEventListener('orientationchange',stars_resize,false);
//window.addEventListener('mousedown',function(){ context.fillStyle='rgba(0,0,0,'+opacity+')'; },false);
//window.addEventListener('mouseup',function(){ context.fillStyle='rgb(0,0,0)'; },false);
//window.addEventListener('DOMMouseScroll',stars_mouse_wheel,false);
//document.onmousemove=stars_move;
//document.onkeypress=stars_key_manager;
//document.onkeyup=stars_release;
//document.onmousewheel=stars_mouse_wheel;
/*


  "\nanonymous@xtcs:~$ make tea -j2 -t green;oolong --cups 2",
  "Tea...\tfound",
  "Cups...\tfound",
  "Waiting for water...",
  "1%","12%","23%","46%","68%","80%",
  "Got temperature of oolong, trying to transfer water",
  "14% of water packets lost",
  "jitter: 2% ping: 128ms",
  "Sugar...\tSugar not found; assuming user loves tea without sugar",
  "Allocating cups...","420 ml of memory used",
  "Compiling tea...",
  "Tea compiled successfully. Enjoy.",

  "\nanonymous@xtcs:~$ anecdote",
  "~ Nietzsche: God is dead.\nGod: Nietzsche is dead.\nEFG: Mne pohuj.","~ Rate this anecdote?","anonymous@xtcs:~$ 2/10",
  "\nanonymous@xtcs:~$ anecdote",
  "~ Sherlock Holmes and Dr Watson went on a camping trip. After a good meal and a bottle of wine they lay down for the night, and went to sleep. Some hours later, Holmes awoke and nudged his faithful friend awake.\n`Watson, look up at the sky and tell me what you see.`\nWatson replied, `I see millions and millions of stars.\n`What does that tell you?` Holmes questioned.\nWatson pondered for a minute. `Astronomically, it tells me that there are millions of galaxies and potentially billions of planets. Astrologically, I observe that Saturn is in Leo. Horologically, I deduce that the time is approximately a quarter past three. Theologically, I can see that God is all powerful and that we are small and insignificant. Meteorologically, I suspect that we will have a beautiful day tomorrow. What does it tell you?`\nHolmes was silent for a minute, then spoke. `Watson, you retard. It tells me that some bastard has stolen my pipe!`\n`Here's your pipe.` Watson reclaimed and pulled out the pipe out of the ass. Holmes observed the sky every day, but Watson could not anymore without a pipe.",
  "anonymous@xtcs:~$ idle\nNow in idle state."
*/
