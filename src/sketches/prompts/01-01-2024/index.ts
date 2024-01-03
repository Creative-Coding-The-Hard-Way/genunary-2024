import { Page } from "~/src/lib/page";
import P5 from "p5";

function sketch(p5: P5) {
  let w = 1;
  let h = 1;
  const max_age = 60 * 25;
  let color_bias = 0;

  class Particle {
    private x: number;
    private y: number;
    private age: number;

    constructor() {
      this.reset();
    }

    reset() {
      this.x = p5.random(0, w);
      this.y = p5.random(0, h);
      this.age = Math.ceil(p5.random(0, max_age));
    }

    move() {
      const t = p5.millis() / 1000.0;
      const angle = p5.map(
        p5.noise((3 * this.x) / w, (3 * this.y) / h, (1.0 / 25.0) * t),
        0,
        1,
        -p5.TWO_PI,
        p5.TWO_PI
      );
      const v = P5.Vector.fromAngle(angle, 1);
      this.x += v.x;
      this.y += v.y;
      this.age += 1;
      p5.stroke(color_bias + p5.map(angle, 0, p5.TWO_PI, -60, 60), 60, 60);

      if (this.age > max_age) {
        this.reset();
      }
    }

    draw() {
      p5.point(this.x, this.y);
    }
  }

  let particles: Particle[] = [];

  p5.windowResized = () => {
    w = window.innerWidth * 0.75;
    h = window.innerHeight * 0.75;
    p5.resizeCanvas(w, h);
  };

  p5.setup = () => {
    p5.createCanvas(w, h);
    p5.windowResized();

    p5.colorMode(p5.HSL);
    p5.noiseSeed(1234);

    color_bias = p5.random(0, 360);

    p5.background(color_bias, 25, 10);
    p5.strokeWeight(4);

    for (let i = 0; i < 1000; i++) {
      particles.push(new Particle());
    }
  };

  p5.draw = () => {
    p5.background((color_bias + 180) % 360, 25, 10, 0.02);
    p5.stroke(255);

    const t = p5.millis() / 1000.0;
    color_bias = (t * (360 / 40)) % 360;

    for (const particle of particles) {
      particle.move();
      particle.draw();
    }
  };
}
new Page("Particles, Lots Of Them", sketch);
