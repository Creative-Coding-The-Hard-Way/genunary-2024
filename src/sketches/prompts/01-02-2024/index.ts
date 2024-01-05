import { Page } from "~/src/lib/page";
import P5 from "p5";

interface Lch {
  /**
   * Lightness [0-1].
   */
  L: number;

  /**
   * Chroma [0-1].
   */
  C: number;

  /**
   * Hue [0-360].
   */
  h: number;
}

/**
 * Represents an Oklab color.
 * https://bottosson.github.io/posts/oklab/
 */
interface Lab {
  /**
   * Lightness [0-1];
   */
  L: number;

  /**
   * How green/red the color is [0-1].
   */
  a: number;

  /**
   * How blue/yellow the color is [0-1].
   */
  b: number;
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert polar Oklch to non-polar Oklab colors.
 */
function oklch_to_oklab(lch: Lch): Lab {
  const { L, C, h } = lch;
  const h_rad = (h * Math.PI) / 180.0;
  return {
    L,
    a: C * Math.cos(h_rad),
    b: C * Math.sin(h_rad),
  };
}

/**
 * Convert Oklab colors to rgb.
 */
function oklab_to_rgb(lab: Lab): Rgb {
  const l_ = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
  const m_ = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
  const s_ = lab.L - 0.0894841775 * lab.a - 1.291485548 * lab.b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return {
    r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

function sketch(p5: P5) {
  const em = Math.min(50, Math.round(window.innerWidth / 25));
  const w = 12 * em;
  const h = 10 * em;

  let hue_bar = {
    top: em,
    bottom: h - em,
    left: w - 2 * em,
    right: w - em,
    hue: 240,
  };

  p5.mouseClicked = () => {
    if (p5.mouseX < hue_bar.left || p5.mouseX > hue_bar.right) {
      return;
    }
    if (p5.mouseY < hue_bar.top || p5.mouseY > hue_bar.bottom) {
      return;
    }
    hue_bar.hue = p5.map(p5.mouseY, hue_bar.top, hue_bar.bottom, 0, 360);
    p5.redraw();
  };

  p5.setup = () => {
    p5.createCanvas(w, h);
    p5.colorMode(p5.RGB, 1.0);
    p5.noStroke();
  };

  p5.draw = () => {
    p5.background(0);

    // Draw the rectangle
    {
      p5.push();

      p5.noStroke();
      const top = em;
      const bottom = h - em;
      const left = em;
      const right = bottom;

      p5.fill(0.25);
      p5.rect(left, top, right - left, bottom - top);

      const outside_range = (n: number): boolean => {
        return n < 0 || n > 1;
      };

      for (let y = top; y <= bottom; y++) {
        const L = p5.map(y, top, bottom, 1, 0);
        for (let x = left; x <= right; x++) {
          const C = p5.map(x, left, right, 0, 0.38);
          const { r, g, b } = oklab_to_rgb(
            oklch_to_oklab({ L, C, h: hue_bar.hue })
          );
          if (outside_range(r) || outside_range(g) || outside_range(b)) {
            break;
          }
          p5.stroke(r, g, b);
          p5.point(x, y);
        }
      }

      //p5.rect(left, top, right - left, bottom - top);

      p5.pop();
    }

    // Draw the picker bar
    {
      p5.push();
      // draw the bar
      const L = 0.8;
      const C = 0.38;
      for (let i = hue_bar.top; i < hue_bar.bottom; i++) {
        const h = p5.map(i, hue_bar.top, hue_bar.bottom, 0, 360);
        const c = oklab_to_rgb(oklch_to_oklab({ L, C, h }));
        p5.stroke(c.r, c.g, c.b);
        p5.line(hue_bar.left, i, hue_bar.right, i);
      }

      // draw the bar's 'chosen hue'
      const h = p5.map(hue_bar.hue, 0, 360, hue_bar.top, hue_bar.bottom);
      p5.stroke("white");
      p5.line(hue_bar.left, h, hue_bar.right, h);
      p5.pop();
    }

    p5.noLoop();
  };
}
new Page("No Palettes", sketch);
