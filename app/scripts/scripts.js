const minutes = 9;
const the_interval = 0.3 * 60 * 1000;

// Move the mouse across the screen as a sine wave.
const robot = require('robotjs');
const txtgen = require('txtgen');

// Speed up the mouse.
robot.setMouseDelay(2);

const twoPI = Math.PI * 2.0;
const screenSize = robot.getScreenSize();
const height = screenSize.height / 2 - 10;
const { width } = screenSize;

const myArray = [txtgen.paragraph(), txtgen.sentence(), txtgen.article()];

const article = myArray[Math.floor(Math.random() * myArray.length)];

setInterval(function() {
  for (let x = 0; x < width; x++) {
    y = height * Math.sin((twoPI * x) / width) + height;
    robot.moveMouse(x, y);
  }

  // Type "Hello World".
  robot.typeString(article);

  // Press enter.
  robot.keyTap('enter');
  // do your stuff here
}, the_interval);
