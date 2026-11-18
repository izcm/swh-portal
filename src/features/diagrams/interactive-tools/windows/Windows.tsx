import { Fragment, useId } from "react";
import { Check } from "lucide-react";
import { boundingBox, glyphStrokeLucide } from "@/lib/svg";
import { EdgeGradient } from "../../shared/gradients";
import type { windowLayout } from "./layout";

export function Windows({
  layout,
}: {
  layout: ReturnType<typeof windowLayout>;
}) {
  const { transform, windows, centers, unit, exit } = layout;

  const radius = unit * 0.32;
  const frontWindow = windows[windows.length - 1];

  // one connector per window, from its center to the next window's center
  const connectors = (() => {
    const dip = 0.08;

    const paths = centers.slice(1).map((end, i) => {
      const start = centers[i];
      const length = Math.hypot(end.x - start.x, end.y - start.y);

      // halfway between the two centers, pulled down a little
      const control = {
        x: (start.x + end.x) * 0.5,
        y: (start.y + end.y) * 0.5 + length * dip,
      };

      return `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;
    });

    const drawing = (i: number) =>
      paths[i] && (
        <path
          d={paths[i]}
          fill="none"
          stroke="var(--accent-ink)"
          strokeWidth={1}
          strokeDasharray="12 3"
        />
      );

    return { paths, drawing };
  })();

  // one extra window halfway between each window and the next
  const halfwayWindows = (() => {
    const items = windows.slice(0, -1).map((current, i) => {
      const next = windows[i + 1];

      return {
        ...current,
        x: (current.x + next.x) * 0.5 + i * unit * 0.5,
        y: (current.y + next.y) * 0.5 - i * unit * 0.25,
        width: current.width * 1.2,
      };
    });

    const box = boundingBox(
      items.flatMap(({ x, y, width, height }) => [
        { x, y },
        { x: x + width, y: y + height },
      ]),
    );

    const drawing = (i: number) => {
      if (!items[i]) return null;
      const { x, y, width, height } = items[i];

      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={radius}
          fill={`url(#${gradients.ground})`}
          stroke={`url(#${gradients.strokeFlipped})`}
          strokeWidth={1.2}
          opacity={1}
          // Prevent thin strokes from disappearing at certain screen sizes
          // due to SVG scaling and subpixel anti-aliasing.
          vectorEffect="non-scaling-stroke"
        />
      );
    };

    return { items, box, drawing };
  })();

  const gradients = (() => {
    const edge = useId();

    const ground = useId();
    const windowFill = useId();

    const stroke = useId();
    const strokeFlipped = useId();

    const { box } = halfwayWindows;

    const drawing = () => (
      <defs>
        <EdgeGradient
          id={edge}
          width={frontWindow.width}
          height={frontWindow.height}
        />

        <linearGradient
          id={ground}
          x1={box.x}
          x2={box.x + box.width}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--ground)" stopOpacity={0} />
          <stop offset="75%" stopColor="var(--ground)" stopOpacity={0.5} />
          <stop offset="100%" stopColor="var(--ground)" stopOpacity={1} />
        </linearGradient>

        <linearGradient id={windowFill}>
          <stop offset="0%" stopColor="var(--pane-fill)" />
          <stop offset="75%" stopColor="var(--ground)" />
          {/* <stop offset="100%" stopColor="var(--ground)" stopOpacity={1} /> */}
        </linearGradient>

        <linearGradient id={stroke}>
          <stop
            offset="0%"
            stopColor="var(--accent-bright)"
            stopOpacity={0.85}
          />
          <stop
            offset="100%"
            stopColor="var(--accent-bright)"
            stopOpacity={0}
          />
        </linearGradient>

        <linearGradient id={strokeFlipped} href={`#${stroke}`} x1={1} x2={0} />
      </defs>
    );

    return { edge, ground, windowFill, stroke, strokeFlipped, drawing };
  })();

  const panes = (() => {
    const drawing = (i: number) => {
      const { x, y, width, height, opacity } = windows[i];
      const isFront = i === windows.length - 1;

      return (
        <g transform={`translate(${x}, ${y})`}>
          <rect
            width={width}
            height={height}
            rx={radius}
            fill={
              isFront ? "var(--pane-fill)" : `url(#${gradients.windowFill})`
            }
            stroke={
              isFront ? "var(--accent-bright)" : `url(#${gradients.stroke})`
            }
            strokeWidth={isFront ? 1 : 1.2}
            // Prevent thin strokes from disappearing at certain screen sizes
            // due to SVG scaling and subpixel anti-aliasing.
            vectorEffect="non-scaling-stroke"
            opacity={opacity}
          />
        </g>
      );
    };

    return { drawing };
  })();

  // the line out of the front window, with a check mark at its end
  const exitLine = (() => {
    const drawing = () => {
      if (!exit) return null;
      const { start, end, radius: circleRadius } = exit;
      const checkSize = circleRadius * 1.25;

      return (
        <>
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="var(--accent-ink)"
            strokeWidth={1}
            strokeDasharray="12 3"
          />
          <g transform={`translate(${end.x}, ${end.y})`}>
            <circle
              r={circleRadius}
              fill="var(--ground)"
              stroke="var(--accent-bright)"
            />
            <Check
              x={-checkSize * 0.5}
              y={-checkSize * 0.5 + checkSize / 48}
              size={checkSize}
              stroke="var(--accent)"
              strokeWidth={glyphStrokeLucide(checkSize, 1.5)}
            />
          </g>
        </>
      );
    };

    return { drawing };
  })();

  return (
    <g transform={transform}>
      {gradients.drawing()}
      {windows.map((_, i) => (
        <Fragment key={i}>
          {panes.drawing(i)}
          {halfwayWindows.drawing(i)}
          {connectors.drawing(i)}
        </Fragment>
      ))}
      {exitLine.drawing()}
      {/* <DebugPoints points={centers} /> */}
    </g>
  );
}
