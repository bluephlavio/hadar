import { Unary, Binary, Hadar, Probe, Scene } from '../../core';
import { theme } from '../Theme';

const sketch = p => {

  const sourceColor = p.color(theme.palette.primary.main);
  const hadarColor = p.color(theme.palette.secondary.main);
  const probeColor = p.color(theme.palette.primary.dark);

  const moon = new Unary(1, sourceColor);
  const earth = new Unary(1, sourceColor);
  const earthMoon = new Binary(earth, moon, 20);
  const mercury = new Unary(1, sourceColor);
  const mars = new Unary(1, sourceColor);
  const phobos = new Unary(1, sourceColor);
  mars.addSatellite(phobos, 15);
  const sunA1 = new Unary(10, sourceColor);
  const sunA2 = new Unary(20, sourceColor);
  const sunA = new Binary(sunA1, sunA2, 10);
  const sunB = new Unary(30, sourceColor);
  const sys = new Binary(sunA, sunB, 50);
  sys.addSatellite(mercury, 100);
  sys.addSatellite(earthMoon, 200);
  sys.addSatellite(mars, 300);
  const hadar = new Hadar(hadarColor);
  sys.addSatellite(hadar, 250);

  const probe = new Probe.Builder(sys)
    .orbiting(sys, 200)
    .withColor(probeColor)
    .build();

  const scene = new Scene(sys, probe);

  let scaleFactor;
  let translationVector;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    scaleFactor = 1;
    translationVector = p.createVector(p.width / 2, p.height / 2);
  }

  p.draw = () => {
    p.background(255);
    p.translate(translationVector.x, translationVector.y);
    p.scale(scaleFactor);
    if (p.keyIsDown(p.UP_ARROW)) {
      scene.host.fire(true);
    } else if (p.keyIsDown(p.DOWN_ARROW)) {
      scene.host.fire(false);
    } else {
      scene.host.propulsion.set(0, 0);
    }
    scene.update(1, p);
  }

  p.canvasResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }

  p.mouseWheel = event => {
    scaleFactor += 1e-3 * event.delta;
  }

  p.mouseDragged = () => {
    translationVector.add(p.createVector(p.mouseX - p.pmouseX, p.mouseY - p.pmouseY));
  }

}

export default sketch;
