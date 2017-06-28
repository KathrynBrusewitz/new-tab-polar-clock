const canvas = document.getElementById('canvas');
const point = new Point(200, 200, 180);
const clock = new PolarClock(canvas, point, 15, 2);
const menuButton = document.getElementById('menuButton');
const menu = document.getElementById('menu');
const status = document.getElementById('status');
let menuIsOpen = false;
const backgroundImageURL = document.getElementById('backgroundImageURL');
const opacity = document.getElementById('opacity');
const backgroundColor = document.getElementById('backgroundColor');
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
    opacity: 80,
  }, (res) => {
    opacity.value = res.opacity;
    canvas.style.opacity = res.opacity * 0.01;
    backgroundColor.value = res.backgroundColor;
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
    backgroundImageURL: backgroundImageURL.value,
    barColor: barColor.map(element => element.value),
    backgroundColor: backgroundColor.value,
    opacity: opacity.value,
  }, () => {
    // Let user know options were saved
    status.textContent = 'Settings have been saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 4000);
  });
  restoreSettings();
};

const toggleMenu = () => {
  menuIsOpen = !menuIsOpen;
  menuButton.src = menuIsOpen ? 'chevron-right.svg' : 'chevron-left.svg';
  menu.classList.toggle('hidden');
};

document.body.onload = () => {
  clock.start(25);
};

menuButton.addEventListener('click', toggleMenu);
document.addEventListener('DOMContentLoaded', restoreSettings);
document.getElementById('save').addEventListener('click', saveSettings);


barColor.forEach((element, index) => {
  element.addEventListener('change', () => {
    clock.color[index] = element.value;
  });
});

opacity.addEventListener('input', () => {
  canvas.style.opacity = opacity.value * 0.01;
});

backgroundColor.addEventListener('change', () => {
  document.body.style.backgroundColor = backgroundColor.value;
});

backgroundImageURL.addEventListener('change', () => {
  document.body.style.backgroundImageURL = backgroundImageURL.value;
});
