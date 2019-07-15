(() => {
  let meter;

  window.addEventListener('load', askForAudioInput);

  function askForAudioInput() {
    try {
      // Pede para usar audio
      navigator.mediaDevices.getUserMedia({ audio: true }).
      then(gotStream).
      catch(didntGetStream);
    } catch (e) {
      console.info(`getUserMedia threw exception: ${e}`);
    }
  }

  // Recebe um objeto do tipo MediaStream
  function gotStream(stream) {
    // Gráfico de processamento de áudio
    const audioContext = new AudioContext();

    // Interpreta o MediaStream como audio e conecta-o ao gráfico de processamento de áudio
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Cria um medidor de volume usando lib externa
    meter = createAudioMeter(audioContext);

    // Connecta o medidor ao audio
    mediaStreamSource.connect(meter);

    createVolumeBar();
    run();
  }

  function didntGetStream() {
    console.info('Stream generation failed.');
  }

  function createVolumeBar() {
    const width = 500;
    const height = 50;
    const canvasContext = document.querySelector('#meter').getContext('2d');

    // Limpa o background do canvas
    canvasContext.clearRect(0, 0, width, height);

    // Checa se o audio é agudo ou grave
    if (meter.checkClipping()) {
      canvasContext.fillStyle = 'red';
    } else {
      canvasContext.fillStyle = 'green';
    }

    // Muda o tamanho da barra de acordo com o volume
    canvasContext.fillRect(0, 0, meter.volume * width * 1.4, height);

    // Navegador chama onLevelChange no próximo loop de repaint
    // recursivo, continua se chamando a partir do primeiro setup
    window.requestAnimationFrame(createVolumeBar);
  }

  function run() {
    let minVolume = 0.5;
    let interval = null;

    // verifica a cada 2 milisegundos se o miado é maior que o volume mínimo
    interval = window.setInterval(() => {
      let degrees = meter.volume - minVolume;

      // Se a diferença entre o volume e o limite definido for maior que 0
      if (degrees > 0) {
        // multiplica por 100000 para aumentar a quantidade de voltas
        spin(degrees * 100000);
        clearInterval(interval);
        // delay para a roda retomar velocidade com o mesmo miado
        setTimeout(run, 5000);
      }
    }, 200);
  }

  function showTreat() {
    const treat = document.querySelector('#descTreat');
    treat.innerHTML = prendas.splice(Math.floor(Math.random()*prendas.length), 1);
  }

  function spin(spinRange) {
    const treat = document.querySelector('#descTreat');
    treat.innerHTML = '';
    const spinWheel = document.querySelector('#wheel');
    spinWheel.style.transform = `rotate(${spinRange}deg)`;
    setTimeout(() => showTreat(), 4000);
  }
})();