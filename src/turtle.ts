export interface Point {
  x: number;
  y: number;
}

export type Color = string;

export interface Turtle {
  forward(distance: number): void;
  turn(angle: number): void;
  setColor(color: Color): void;
}

export class SimpleTurtle implements Turtle {
  private position: Point = { x: 0, y: 0 };
  private angle: number = 0;
  private color: Color = "black";
  private path: { start: Point; end: Point; color: Color }[] = [];

  forward(distance: number): void {
    const radians = (Math.PI / 180) * this.angle;
    const newX = this.position.x + distance * Math.cos(radians);
    const newY = this.position.y + distance * Math.sin(radians);
    const newPoint: Point = { x: newX, y: newY };
    this.path.push({
      start: { ...this.position },
      end: newPoint,
      color: this.color,
    });
    this.position = newPoint;
  }

  turn(angle: number): void {
    this.angle = (this.angle + angle) % 360;
  }

  setColor(color: Color): void {
    this.color = color;
  }

  getPath(): { start: Point; end: Point; color: Color }[] {
    return this.path;
  }
}
