import { Page } from "~/src/lib/page";
import P5 from "p5";

function sketch(p5: P5) {
  const s = Math.min(window.innerWidth, window.innerHeight);
  const w = s * 0.75;
  const h = s * 0.75;

  p5.setup = () => {
    p5.createCanvas(w, h);
  };

  p5.draw = () => {
    const t = p5.frameCount / 60.0;
    const angle = (t * p5.TWO_PI) / 10;
    const rw = w * Math.cos(angle);
    const rh = h * Math.sin(angle);

    p5.background(0, 25); //, 1);
    p5.translate(w / 2, h / 2);
    p5.scale(1, -1);
    p5.stroke(255);
    p5.strokeWeight(4);
    p5.fill(20, 20, 128, 10);
    p5.rectMode(p5.CENTER);
    for (let i = 0; i < 10; i++) {
      p5.rotate((p5.TWO_PI / 360) * 10);
      p5.scale(0.8, 0.8);
      p5.rect(0, 0, rw, rh);
    }
  };
}

new Page("Droste Effect", sketch);
