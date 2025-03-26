import { drawLine } from "../src/turtle";

export function drawSquare(centerX: number, centerY: number, sideLength: number): void {
  const half = sideLength / 2;
  drawLine(centerX - half, centerY - half, centerX + half, centerY - half);
  drawLine(centerX + half, centerY - half, centerX + half, centerY + half);
  drawLine(centerX + half, centerY + half, centerX - half, centerY + half);
  drawLine(centerX - half, centerY + half, centerX - half, centerY - half);
}

export function chordLength(r: number, theta: number): number {
  return 2 * r * Math.sin(theta / 2);
}

export function drawApproximateCircle(centerX: number, centerY: number, radius: number): void {
  const segments = 60;
  const angleStep = (2 * Math.PI) / segments;

  for (let i = 0; i < segments; i++) {
    const angle1 = i * angleStep;
    const angle2 = (i + 1) * angleStep;

    const x1 = centerX + radius * Math.cos(angle1);
    const y1 = centerY + radius * Math.sin(angle1);
    const x2 = centerX + radius * Math.cos(angle2);
    const y2 = centerY + radius * Math.sin(angle2);

    drawLine(x1, y1, x2, y2);
  }
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function findPath(startX: number, startY: number, endX: number, endY: number): [number, number][] {
  const path: [number, number][] = [];
  const steps = 10;

  for (let i = 0; i <= steps; i++) {
    const x = startX + ((endX - startX) * i) / steps;
    const y = startY + ((endY - startY) * i) / steps;
    path.push([x, y]);
  }

  return path;
}

export function drawPersonalArt(): void {
  const centerX = 250;
  const centerY = 250;

  for (let i = 0; i < 20; i++) {
    const angle = (i * 2 * Math.PI) / 20;
    const radius = 100;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    drawApproximateCircle(x, y, 15 + (i % 5));
    drawLine(centerX, centerY, x, y);
  }

  drawSquare(centerX, centerY, 60);
}
