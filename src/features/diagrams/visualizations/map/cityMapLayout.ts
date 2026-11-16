import { type Point } from "@/lib/svg";
import { scandinaviaOrthographicBounds } from "./ScandinaviaOrthographic";

// where the city map sits: `height` tall, top-left at (x, y), turned `rotation`
// degrees around its middle. toDrawnMap + transform put map-coordinate points on it
export function cityMapLayout({
  x,
  y,
  height,
  rotation = 0,
}: {
  x: number;
  y: number;
  height: number;
  rotation?: number;
}) {
  const {
    x: boundsX,
    y: boundsY,
    width: boundsWidth,
    height: boundsHeight,
  } = scandinaviaOrthographicBounds;
  const scale = height / boundsHeight;
  const width = boundsWidth * scale;

  const rotate = `rotate(${rotation}, ${width * 0.5}, ${height * 0.5})`;
  const transform = `translate(${x}, ${y}) ${rotate}`;

  const toDrawnMap = ({ x, y }: Point) => ({
    x: (x - boundsX) * scale,
    y: (y - boundsY) * scale,
  });

  return { width, rotate, transform, toDrawnMap };
}
