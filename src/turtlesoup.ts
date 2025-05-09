import { Turtle, SimpleTurtle, Point, Color } from "./turtle";
import * as fs from "fs";
import { execSync } from "child_process";

/**
 * Draws a square of the given side length using the turtle.
 * @param turtle The turtle to use for drawing.
 * @param sideLength The length of each side of the square in pixels.
 */
export function drawSquare(turtle: Turtle, sideLength: number): void {
  for (let i = 0; i < 4; i++) {
    turtle.forward(sideLength);
    turtle.turn(90); // Turn 90 degrees to the right
  }
}

/**
 * Calculates the length of a chord of a circle.
 * @param radius Radius of the circle.
 * @param angleInDegrees Angle subtended by the chord at the center of the circle (in degrees).
 * @returns The length of the chord.
 */
export function chordLength(radius: number, angleInDegrees: number): number {
  const angleInRadians = (Math.PI / 180) * angleInDegrees;
  return 2 * radius * Math.sin(angleInRadians / 2);
}

/**
 * Draws an approximate circle using the turtle.
 * @param turtle The turtle to use.
 * @param radius The radius of the circle.
 * @param numSides The number of sides to approximate the circle with.
 */
export function drawApproximateCircle(
  turtle: Turtle,
  radius: number,
  numSides: number
): void {
  const angle = 360 / numSides;
  const sideLength = chordLength(radius, angle);
  for (let i = 0; i < numSides; i++) {
    turtle.forward(sideLength);
    turtle.turn(angle);
  }
}

/**
 * Calculates the distance between two points.
 * @param p1 The first point.
 * @param p2 The second point.
 * @returns The distance between p1 and p2.
 */
export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Finds a path (sequence of turns and moves) for the turtle to visit a list of points in order.
 * @param turtle The turtle to move.
 * @param points An array of points to visit in order.
 * @returns An array of instructions representing the path.
 */
export function findPath(turtle: Turtle, points: Point[]): string[] {
  const instructions: string[] = [];
  if (points.length === 0) return instructions;

  let currentPos = points[0];
  for (let i = 1; i < points.length; i++) {
    const nextPos = points[i];
    const dx = nextPos.x - currentPos.x;
    const dy = nextPos.y - currentPos.y;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const dist = distance(currentPos, nextPos);
    instructions.push(`turn ${angle.toFixed(2)}`);
    instructions.push(`forward ${dist.toFixed(2)}`);
    currentPos = nextPos;
  }
  return instructions;
}

/**
 * Draws your personal art using the turtle.
 * Be creative and implement something interesting!
 * Use at least 20 lines of non-repetitive code.
 * You may use helper methods, loops, etc., and the `color` method of the Turtle.
 * @param turtle The turtle to use.
 */
export function drawPersonalArt(turtle: Turtle): void {
  const colors = ["red", "green", "blue", "orange", "purple"];
  for (let i = 0; i < 36; i++) {
    turtle.setColor(colors[i % colors.length]);
    drawApproximateCircle(turtle, 50, 36);
    turtle.turn(10);
  }
}

function generateHTML(
  pathData: { start: Point; end: Point; color: Color }[]
): string {
  const canvasWidth = 500;
  const canvasHeight = 500;
  const scale = 1;
  const offsetX = canvasWidth / 2;
  const offsetY = canvasHeight / 2;

  let pathStrings = "";
  for (const segment of pathData) {
    const x1 = segment.start.x * scale + offsetX;
    const y1 = segment.start.y * scale + offsetY;
    const x2 = segment.end.x * scale + offsetX;
    const y2 = segment.end.y * scale + offsetY;
    pathStrings += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${segment.color}" stroke-width="2"/>`;
  }

  return `<!DOCTYPE html>
<html>
<head>
    <title>Turtle Graphics Output</title>
    <style>
        body { margin: 0; }
        canvas { display: block; }
    </style>
</head>
<body>
    <svg width="${canvasWidth}" height="${canvasHeight}" style="background-color:#f0f0f0;">
        ${pathStrings}
    </svg>
</body>
</html>`;
}

function saveHTMLToFile(
  htmlContent: string,
  filename: string = "output.html"
): void {
  fs.writeFileSync(filename, htmlContent);
  console.log(`Drawing saved to ${filename}`);
}

function openHTML(filename: string = "output.html"): void {
  try {
    execSync(`open ${filename}`);
  } catch {
    try {
      execSync(`start ${filename}`);
    } catch {
      try {
        execSync(`xdg-open ${filename}`);
      } catch {
        console.log("Could not open the file automatically");
      }
    }
  }
}

export function main(): void {
  const turtle = new SimpleTurtle();

  // Draw a square
  drawSquare(turtle, 100);

  // Draw an approximate circle
  drawApproximateCircle(turtle, 50, 36);

  // Calculate distance between two points
  const p1: Point = { x: 0, y: 0 };
  const p2: Point = { x: 100, y: 100 };
  console.log("Distance between p1 and p2:", distance(p1, p2));

  // Find path between points
  const pointsToVisit: Point[] = [
    { x: 0, y: 0 },
    { x: 50, y: 50 },
    { x: 100, y: 0 },
  ];
  const pathInstructions = findPath(turtle, pointsToVisit);
  console.log("Path instructions:", pathInstructions);

  // Draw personal art
  drawPersonalArt(turtle);

  const htmlContent = generateHTML((turtle as SimpleTurtle).getPath());
  saveHTMLToFile(htmlContent);
  openHTML();
}

if (require.main === module) {
  main();
}
