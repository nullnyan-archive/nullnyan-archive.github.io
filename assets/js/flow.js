var Flow = function () {
  var playlist = ['/audio/Amethyst_Caverns.ogg'];
  var audioVisual, canvas, canvas_context, context, audio, gain, analyser, source;
  this.working = false;
  this.init = function () {
    if (!(window.AudioContext || window.webkitAudioContext)) return false;
    with (window) AudioContext = AudioContext || webkitAudioContext;
    audioVisual = _id('spectrum');
    canvas = _id('canvas');
    canvas_context = canvas.getContext('2d');
    context = new AudioContext();
    audio = new Audio();
    gain = context.createGain();
    analyser = context.createAnalyser();
    source = context.createMediaElementSource(audio);
    with (audio)
      (src = playlist[(Math.random() * playlist.length) | 0]),
        (controls = loop = autoplay = true),
        (id = 'a'),
        (onended = this.next);
    audioVisual.appendChild(audio);
    source.connect(analyser);
    source.connect(gain);
    gain.connect(context.destination);
    gain.gain.value = -0.85;
    with (analyser) (fftSize = 8192), connect(context.destination);
    with (window)
      requestAnimFrame = (function () {
        return (
          requestAnimationFrame ||
          webkitRequestAnimationFrame ||
          mozRequestAnimationFrame ||
          function (callback) {
            setTimeout(callback, 1000 / 60);
          }
        );
      })();
    this.working = true;
  };
  this.show = function t() {
    if (!keys.visualizer) return false;
    window.requestAnimFrame(t);
    var i,
      j,
      sum,
      scaled_average,
      num_bars = canvas.width / 4,
      data = new Uint8Array(2048),
      bin_size = 0 | (data.length / num_bars);
    analyser.getByteFrequencyData(data);
    with (canvas_context) (fillStyle = '#a6f4f2') /*#e6e2d3*/, clearRect(0, 0, canvas.width, canvas.height);
    for (i = 0; i < num_bars; ++i) {
      sum = 0;
      for (j = 0; j < bin_size; ++j) sum += data[i * bin_size + j];
      scaled_average = (canvas.height * sum) / (bin_size * 256);
      sum = canvas.width / num_bars;
      canvas_context.fillRect(i * sum, canvas.height, sum - 2, -scaled_average);
    }
  };
  this.next = function () {
    audio.src = playlist[(Math.random() * playlist.length) | 0];
  };
};
