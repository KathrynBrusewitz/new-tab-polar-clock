/**
 * @param {Number} x canvas
 * @param {Number} y canvas
 * @param {Number} radius
 */
const Point = function Point(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
};

/**
 * end of months for feb
 */
const getEndOfMonth = (date) => {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const year = date.getYear();
  const month = date.getMonth();

  return (month === 1 && year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) ? 29 : days[month];
};

/**
 * time radian
 */
const getTimeRadian = () => {
  const now = new Date();
  const eom = getEndOfMonth(now);

  const second = (now.getSeconds() + now.getMilliseconds() / 1000) * Math.PI / 30;
  const minute = (now.getMinutes() * Math.PI / 30) + second / 60;
  const hour = (now.getHours() * Math.PI / 12) + minute / 24;
  const weekday = (now.getDay() * Math.PI / 3.5) + hour / 7;
  const date = ((now.getDate() - 1) * Math.PI / (eom/2)) + hour / eom;
  const month = (now.getMonth() * Math.PI / 6) + date / 12;

  return {
    second,
    minute,
    hour,
    weekday,
    date,
    month,
  };
};

/**
 * @param {Object} canvas
 * @param {Point} point
 * @param {Number} line
 * @param {Number} margin
 * @param {Array.<String>} color
 */
const PolarClock = function PolarClock(canvas, point, line, margin, color) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.point = point;
  this.line = line;
  this.margin = margin;
  this.color = color || ['#333', '#555', '#777', '#000', '#BBB', '#999'];
};

/**
 * @param {Number} interval (ms)
 */
PolarClock.prototype.start = function start(interval) {
  const self = this;
  const point = this.getPoint();

  setInterval(() => {
    self.step(point);
  }, interval);
};

/**
 * clear
 */
PolarClock.prototype.clear = function clear() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

/**
 * @return {Point}
 */
PolarClock.prototype.getPoint = function getPoint() {
  return new Point(this.point.x, this.point.y, this.point.radius);
};

/**
 * @param {Point} point
 */
PolarClock.prototype.step = function step(point) {
  const now = getTimeRadian();
  const line = this.line;
  const margin = this.margin;
  const color = this.color;

  this.clear();
  if (color[0]) this.draw(0, point, now.second);
  if (color[1]) this.draw(1, point, now.minute);
  if (color[2]) this.draw(2, point, now.hour);
  if (color[3]) this.draw(3, point, now.weekday);
  if (color[4]) this.draw(4, point, now.date);
  if (color[5]) this.draw(5, point, now.month);
};

/**
 * @param {Number} index
 * @param {Point} point
 * @param {Number} radian
 */
PolarClock.prototype.draw = function draw(index, point, radian) {
  this.point = new Point(
    point.x,
    point.y,
    point.radius - (this.line + this.margin) * index,
  );

  this.arc(this.color[index], this.line, 0, radian);
};

/**
 * @param {String} color
 * @param {Number} width
 * @param {Number} start
 * @param {Number} end
 */
PolarClock.prototype.arc = function arc(color, width, start, end) {
  const context = this.context;
  const point = this.point;
  const x = -point.y;
  const y = point.x;
  const r = point.radius - width;

  context.save();
  context.rotate(-Math.PI / 2);
  context.strokeStyle = color;
  context.lineWidth = width;
  context.beginPath();
  context.arc(x, y, r, start, end, false);
  context.stroke();
  context.restore();
};
