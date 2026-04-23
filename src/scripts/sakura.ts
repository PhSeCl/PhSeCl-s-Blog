export const DEFAULT_PETAL_COLORS = [
  'rgba(255, 200, 220, 0.7)',
  'rgba(255, 220, 235, 0.6)',
  'rgba(250, 190, 210, 0.65)',
  'rgba(255, 235, 245, 0.55)',
  'rgba(240, 180, 200, 0.5)',
] as const;

type Range = [number, number];
type PetalShape = 'ellipse' | 'petal';

export interface SakuraConfig {
  viewportWidth: number;
  isMobile: boolean;
  countRange: Range;
  sizeRange: Range;
  speedRange: Range;
  wobbleRange: Range;
  rotationRange: Range;
  depthRange: Range;
  interactionRadius: number;
  interactionStrength: number;
  mouseVelocityInfluence: number;
  colors: string[];
  blurEnabled: boolean;
  enableMouseInteraction: boolean;
  dprCap: number;
  mobileBreakpoint: number;
  petalShapeChance: number;
}

export type SakuraConfigOverrides = Partial<SakuraConfig> & {
  viewportWidth?: number;
};

interface PointerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  fallSpeed: number;
  drift: number;
  rotation: number;
  rotationSpeed: number;
  wobblePhase: number;
  wobbleSpeed: number;
  wobbleAmplitude: number;
  flipPhase: number;
  flipSpeed: number;
  color: string;
  depth: number;
  opacity: number;
  shape: PetalShape;
  blur: number;
}

const TAU = Math.PI * 2;

function randomInRange([min, max]: Range): number {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function getResponsivePetalCount(range: Range, ratio = Math.random()): number {
  const normalizedRatio = clamp(ratio, 0, 1);
  const [min, max] = range;
  return Math.round(min + (max - min) * normalizedRatio);
}

export function createSakuraConfig(overrides: SakuraConfigOverrides = {}): SakuraConfig {
  const viewportWidth =
    overrides.viewportWidth ??
    (typeof window !== 'undefined' ? window.innerWidth : 1280);
  const mobileBreakpoint = overrides.mobileBreakpoint ?? 768;
  const isMobile = overrides.isMobile ?? viewportWidth < mobileBreakpoint;

  const base: SakuraConfig = {
    viewportWidth,
    isMobile,
    countRange: isMobile ? [50, 80] : [150, 200],
    sizeRange: isMobile ? [5, 12] : [6, 18],
    speedRange: isMobile ? [0.3, 0.8] : [0.3, 1.0],
    wobbleRange: [0.5, 1.5],
    rotationRange: [0.01, 0.03],
    depthRange: [0.4, 1.0],
    interactionRadius: 120,
    interactionStrength: 0.55,
    mouseVelocityInfluence: 0.08,
    colors: [...DEFAULT_PETAL_COLORS],
    blurEnabled: !isMobile,
    enableMouseInteraction: !isMobile,
    dprCap: 2,
    mobileBreakpoint,
    petalShapeChance: 0.3,
  };

  return {
    ...base,
    ...overrides,
    colors: overrides.colors ? [...overrides.colors] : [...base.colors],
    isMobile,
  };
}

export function mergeSakuraConfig(
  base: SakuraConfig,
  overrides: SakuraConfigOverrides = {},
): SakuraConfig {
  const nextViewportWidth = overrides.viewportWidth ?? base.viewportWidth;
  const responsiveShift =
    overrides.viewportWidth !== undefined || overrides.mobileBreakpoint !== undefined;
  const responsiveBase = createSakuraConfig({
    viewportWidth: nextViewportWidth,
    mobileBreakpoint: overrides.mobileBreakpoint ?? base.mobileBreakpoint,
  });

  return {
    ...base,
    ...overrides,
    viewportWidth: nextViewportWidth,
    isMobile: overrides.isMobile ?? responsiveBase.isMobile,
    countRange: overrides.countRange ?? (responsiveShift ? responsiveBase.countRange : base.countRange),
    sizeRange: overrides.sizeRange ?? (responsiveShift ? responsiveBase.sizeRange : base.sizeRange),
    speedRange: overrides.speedRange ?? (responsiveShift ? responsiveBase.speedRange : base.speedRange),
    blurEnabled: overrides.blurEnabled ?? (responsiveShift ? responsiveBase.blurEnabled : base.blurEnabled),
    enableMouseInteraction:
      overrides.enableMouseInteraction ??
      (responsiveShift ? responsiveBase.enableMouseInteraction : base.enableMouseInteraction),
    colors: overrides.colors ? [...overrides.colors] : [...base.colors],
  };
}

export class SakuraController {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;
  private config: SakuraConfig;
  private petals: Petal[] = [];
  private animationFrame = 0;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private running = false;
  private pausedByVisibility = false;
  private pointer: PointerState = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };

  constructor(canvas: HTMLCanvasElement, config: SakuraConfigOverrides = {}) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.config = createSakuraConfig(config);
    this.handleResize = this.handleResize.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);
    this.loop = this.loop.bind(this);
  }

  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.handleResize();
  }

  start(): void {
    if (!this.context || this.running) {
      return;
    }

    this.running = true;
    this.pausedByVisibility = false;
    this.handleResize();
    this.attachEvents();

    if (!this.petals.length) {
      this.createPetals();
    }

    this.animationFrame = window.requestAnimationFrame(this.loop);
  }

  stop(): void {
    this.running = false;
    window.cancelAnimationFrame(this.animationFrame);
    this.detachEvents();
  }

  updateConfig(overrides: SakuraConfigOverrides): void {
    this.config = mergeSakuraConfig(this.config, overrides);
    this.handleResize();
    this.createPetals();
  }

  private attachEvents(): void {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    if (this.config.enableMouseInteraction) {
      window.addEventListener('pointermove', this.handlePointerMove);
      window.addEventListener('pointerleave', this.handlePointerLeave);
      window.addEventListener('pointercancel', this.handlePointerLeave);
    }
  }

  private detachEvents(): void {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerleave', this.handlePointerLeave);
    window.removeEventListener('pointercancel', this.handlePointerLeave);
  }

  private handleResize(): void {
    if (!this.context) {
      return;
    }

    this.config = mergeSakuraConfig(this.config, {
      viewportWidth: window.innerWidth,
    });

    this.dpr = Math.min(window.devicePixelRatio || 1, this.config.dprCap);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    if (this.running) {
      this.createPetals();
    }
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      this.pausedByVisibility = this.running;
      window.cancelAnimationFrame(this.animationFrame);
      return;
    }

    if (this.pausedByVisibility && this.running) {
      this.pausedByVisibility = false;
      this.animationFrame = window.requestAnimationFrame(this.loop);
    }
  }

  private handlePointerMove(event: PointerEvent): void {
    const nextX = event.clientX;
    const nextY = event.clientY;

    this.pointer.vx = nextX - this.pointer.x;
    this.pointer.vy = nextY - this.pointer.y;
    this.pointer.x = nextX;
    this.pointer.y = nextY;
    this.pointer.active = true;
  }

  private handlePointerLeave(): void {
    this.pointer.active = false;
    this.pointer.vx = 0;
    this.pointer.vy = 0;
  }

  private createPetals(): void {
    const count = getResponsivePetalCount(this.config.countRange);
    this.petals = Array.from({ length: count }, () => this.createPetal(true)).sort(
      (left, right) => left.depth - right.depth,
    );
  }

  private createPetal(initial = false): Petal {
    const depth = randomInRange(this.config.depthRange);
    const y = initial
      ? Math.random() * this.height
      : -20 - Math.random() * 120;

    return {
      x: Math.random() * this.width,
      y,
      size: randomInRange(this.config.sizeRange),
      fallSpeed: randomInRange(this.config.speedRange),
      drift: -0.18 + Math.random() * 0.36,
      rotation: Math.random() * TAU,
      rotationSpeed:
        (Math.random() > 0.5 ? 1 : -1) * randomInRange(this.config.rotationRange),
      wobblePhase: Math.random() * TAU,
      wobbleSpeed: 0.01 + Math.random() * 0.015,
      wobbleAmplitude: randomInRange(this.config.wobbleRange),
      flipPhase: Math.random() * TAU,
      flipSpeed: 0.02 + Math.random() * 0.02,
      color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
      depth,
      opacity: clamp(0.35 + Math.random() * 0.4, 0.2, 0.9) * depth,
      shape: Math.random() < this.config.petalShapeChance ? 'petal' : 'ellipse',
      blur:
        this.config.blurEnabled
          ? clamp((1 - depth) * 1.4, 0, 1.25)
          : 0,
    };
  }

  private recyclePetal(index: number): void {
    this.petals[index] = this.createPetal(false);
  }

  private loop(): void {
    if (!this.running || !this.context || document.hidden) {
      return;
    }

    this.context.clearRect(0, 0, this.width, this.height);

    for (let index = 0; index < this.petals.length; index += 1) {
      const petal = this.petals[index];
      this.updatePetal(petal);
      this.drawPetal(petal);

      if (petal.y > this.height + 40) {
        this.recyclePetal(index);
      }
    }

    this.animationFrame = window.requestAnimationFrame(this.loop);
  }

  private updatePetal(petal: Petal): void {
    petal.wobblePhase += petal.wobbleSpeed;
    petal.flipPhase += petal.flipSpeed;
    petal.rotation += petal.rotationSpeed * petal.depth;

    const wobbleOffset = Math.sin(petal.wobblePhase) * petal.wobbleAmplitude;
    petal.x += (petal.drift + wobbleOffset) * petal.depth;
    petal.y += petal.fallSpeed * petal.depth;

    if (petal.x < -40) {
      petal.x = this.width + 30;
    } else if (petal.x > this.width + 40) {
      petal.x = -30;
    }

    if (this.config.enableMouseInteraction && this.pointer.active) {
      const dx = petal.x - this.pointer.x;
      const dy = petal.y - this.pointer.y;
      const distance = Math.hypot(dx, dy);

      if (distance > 0 && distance < this.config.interactionRadius) {
        const ratio = 1 - distance / this.config.interactionRadius;
        const force = ratio * this.config.interactionStrength * petal.depth;
        const normalizedX = dx / distance;
        const normalizedY = dy / distance;

        petal.x += normalizedX * force * 14 + this.pointer.vx * this.config.mouseVelocityInfluence;
        petal.y += normalizedY * force * 9 + this.pointer.vy * (this.config.mouseVelocityInfluence * 0.5);
      }
    }
  }

  private drawPetal(petal: Petal): void {
    if (!this.context) {
      return;
    }

    const scaleXSign = Math.cos(petal.flipPhase) >= 0 ? 1 : -1;
    const scaleX = scaleXSign * (0.2 + Math.abs(Math.cos(petal.flipPhase)) * 0.8);

    this.context.save();
    this.context.globalAlpha = petal.opacity;
    this.context.translate(petal.x, petal.y);
    this.context.rotate(petal.rotation);
    this.context.scale(scaleX, 1);

    if (this.config.blurEnabled && petal.blur > 0) {
      this.context.filter = `blur(${petal.blur}px)`;
    }

    this.context.fillStyle = petal.color;
    this.context.beginPath();

    if (petal.shape === 'petal') {
      const width = petal.size * 0.38;
      const height = petal.size * 0.7;
      this.context.moveTo(0, -height);
      this.context.bezierCurveTo(width, -height * 0.75, width, height * 0.2, 0, height);
      this.context.bezierCurveTo(-width, height * 0.2, -width, -height * 0.75, 0, -height);
    } else {
      this.context.ellipse(0, 0, petal.size * 0.32, petal.size * 0.48, 0, 0, TAU);
    }

    this.context.fill();
    this.context.filter = 'none';
    this.context.restore();
  }
}
