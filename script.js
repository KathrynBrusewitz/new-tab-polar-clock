const canvas = document.getElementById('canvas');
const point = new Point(200, 200, 180);
const clock = new PolarClock(canvas, point, 15, 2);
const menu = document.getElementById('menu');
const backgroundImageURL = document.getElementById('backgroundImageURL');
const opacity = document.getElementById('opacity');
const backgroundColor = document.getElementById('backgroundColor');
const save = document.getElementById('save');
const digitalTime = document.getElementById('digitalTime');
const positionCenter = document.getElementById('positionCenter');
const positionBottom = document.getElementById('positionBottom');
const digitalSize = document.getElementById('digitalSize');
const digitalFace = document.getElementById('digitalFace');
const digitalFont = document.getElementById('digitalFont');
const digitalOpacity = document.getElementById('digitalOpacity');
const digitalColor = document.getElementById('digitalColor');
const barColor = [
  document.getElementById('second'),
  document.getElementById('minute'),
  document.getElementById('hour'),
  document.getElementById('weekday'),
  document.getElementById('date'),
  document.getElementById('month'),
];

const restoreSettings = () => {
  chrome.storage.sync.get({
    barColor: ['#000', '#333', '#555', '#777', '#888', '#999'],
    backgroundImageURL: '',
    backgroundColor: '#f8f8f8',
    digitalColor: '#f8f8f8',
    opacity: 80,
    digitalOpacity: 80,
    digitalPosition: 'relative',
    digitalSize: 20,
    digitalFont: 'Roboto Mono',
  }, (res) => {
    digitalTime.style.position = res.digitalPosition;
    digitalTime.style.fontSize = `${res.digitalSize}px`;
    digitalSize.value = res.digitalSize;
    if (res.digitalFont.length > 0) {
      digitalFace.href = `https://fonts.googleapis.com/css?family=${res.digitalFont.split(' ').join('+')}`;
    }
    digitalTime.style.fontFamily = `${res.digitalFont}, monospace`;
    digitalFont.value = res.digitalFont;
    positionCenter.checked = res.digitalPosition === 'absolute';
    positionBottom.checked = res.digitalPosition === 'relative';
    opacity.value = res.opacity;
    digitalOpacity.value = res.digitalOpacity;
    digitalTime.style.opacity = res.digitalOpacity * 0.01;
    canvas.style.opacity = res.opacity * 0.01;
    backgroundColor.value = res.backgroundColor;
    digitalColor.value = res.digitalColor;
    digitalTime.style.color = res.digitalColor;
    document.body.style.backgroundColor = res.backgroundColor;
    res.barColor.forEach((color, index) => {
      clock.color[index] = color;
      barColor[index].value = color;
    });
    if (res.backgroundImageURL.length > 0) {
      backgroundImageURL.value = res.backgroundImageURL;
      document.body.style.backgroundImage = `url(${res.backgroundImageURL})`;
    }
  });
};

const saveSettings = () => {
  chrome.storage.sync.set({
    digitalPosition: positionCenter.checked ? 'absolute' : 'relative',
    digitalSize: digitalSize.value,
    digitalFont: digitalFont.value,
    backgroundImageURL: backgroundImageURL.value,
    barColor: barColor.map(element => element.value),
    backgroundColor: backgroundColor.value,
    digitalColor: digitalColor.value,
    opacity: opacity.value,
    digitalOpacity: digitalOpacity.value,
  }, () => {
    // Let user know options were saved
    save.textContent = 'Saved!';
    setTimeout(() => {
      save.textContent = 'Save Settings';
    }, 2000);
  });
  restoreSettings();
};

const toggleMenu = () => {
  menu.classList.toggle('hidden');
};

document.body.onload = () => {
  const tick = 1000;
  const timeFormat = 'HH:mm:ss';
  clock.start(tick);
  setInterval(() => {
    digitalTime.innerHTML = moment().format(timeFormat);
  }, tick);
};

document.addEventListener('DOMContentLoaded', restoreSettings);
canvas.addEventListener('click', toggleMenu);
digitalTime.addEventListener('click', toggleMenu);
save.addEventListener('click', saveSettings);


barColor.forEach((element, index) => {
  element.addEventListener('change', () => {
    clock.color[index] = element.value;
  });
});

opacity.addEventListener('input', () => {
  canvas.style.opacity = opacity.value * 0.01;
});

digitalOpacity.addEventListener('input', () => {
  digitalTime.style.opacity = digitalOpacity.value * 0.01;
});

digitalSize.addEventListener('input', () => {
  digitalTime.style.fontSize = `${digitalSize.value}px`;
});

digitalColor.addEventListener('change', () => {
  digitalTime.style.color = digitalColor.value;
});

backgroundColor.addEventListener('change', () => {
  document.body.style.backgroundColor = backgroundColor.value;
});

backgroundImageURL.addEventListener('keyup', (e) => {
  if (e.which === 13) {
    document.body.style.backgroundImage = `url(${backgroundImageURL.value})`;
  }
});

positionCenter.addEventListener('change', () => {
  digitalTime.style.position = positionCenter.checked ? 'absolute' : 'relative';
});

positionBottom.addEventListener('change', () => {
  digitalTime.style.position = positionCenter.checked ? 'absolute' : 'relative';
});

digitalFont.addEventListener('keyup', (e) => {
  if (e.which === 13) {
    if (digitalFont.value.length > 0) {
      digitalFace.href = `https://fonts.googleapis.com/css?family=${digitalFont.value.split(' ').join('+')}`;
      digitalTime.style.fontFamily = `${digitalFont.value}, monospace`;
    } else {
      digitalTime.style.fontFamily = 'monospace';
    }
  }
});
