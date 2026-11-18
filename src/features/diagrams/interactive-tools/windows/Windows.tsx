import { Fragment, useId } from "react";
import { boundingBox } from "@/lib/svg";
import { EdgeGradient } from "../../shared/gradients";
import type { windowLayout } from "./layout";

export function Windows({
  layout,
}: {
  layout: ReturnType<typeof windowLayout>;
}) {
  const { transform, windows, centers, unit } = layout;

  const radius = unit * 0.33;
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

    return { paths };
  })();

  // one extra window halfway between each window and the next
  const halfwayWindows = windows.slice(0, -1).map((current, i) => {
    const next = windows[i + 1];

    return {
      ...current,
      x: (current.x + next.x) * 0.5 + i * unit * 0.5,
      y: (current.y + next.y) * 0.5 - i * unit * 0.25,
      width: current.width * 1.2,
    };
  });

  const halfwayBox = boundingBox(
    halfwayWindows.flatMap(({ x, y, width, height }) => [
      { x, y },
      { x: x + width, y: y + height },
    ]),
  );

  const edgeGradientId = useId();

  const groundGradient = useId();
  const windowFillGradient = useId();

  const strokeGradient = useId();
  const strokeGradientFlipped = useId();

  return (
    <g transform={transform}>
      <defs>
        <EdgeGradient
          id={edgeGradientId}
          width={frontWindow.width}
          height={frontWindow.height}
        />

        <linearGradient
          id={groundGradient}
          x1={halfwayBox.x}
          x2={halfwayBox.x + halfwayBox.width}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--ground)" stopOpacity={0} />
          <stop offset="75%" stopColor="var(--ground)" stopOpacity={0.5} />
          <stop offset="100%" stopColor="var(--ground)" stopOpacity={1} />
        </linearGradient>

        <linearGradient id={windowFillGradient}>
          <stop offset="0%" stopColor="var(--pane-fill)" />
          <stop offset="75%" stopColor="var(--ground)" />
          {/* <stop offset="100%" stopColor="var(--ground)" stopOpacity={1} /> */}
        </linearGradient>

        <linearGradient id={strokeGradient}>
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

        <linearGradient
          id={strokeGradientFlipped}
          href={`#${strokeGradient}`}
          x1={1}
          x2={0}
        />
      </defs>
      {windows.map(({ x, y, width, height, opacity }, i) => (
        <Fragment key={i}>
          <g transform={`translate(${x}, ${y})`}>
            <rect
              width={width}
              height={height}
              rx={radius}
              fill={
                i === windows.length - 1
                  ? "var(--pane-fill)"
                  : `url(#${windowFillGradient})`
              }
              stroke={
                i === windows.length - 1
                  ? "var(--accent-bright)"
                  : `url(#${strokeGradient})`
              }
              strokeWidth={i === windows.length - 1 ? 1 : 1.2}
              // Prevent thin strokes from disappearing at certain screen sizes
              // due to SVG scaling and subpixel anti-aliasing.
              vectorEffect="non-scaling-stroke"
              opacity={opacity}
            />
          </g>
          {halfwayWindows[i] &&
            (() => {
              const { x, y, width, height } = halfwayWindows[i];
              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx={radius}
                  fill={`url(#${groundGradient})`}
                  stroke={`url(#${strokeGradientFlipped})`}
                  strokeWidth={1.2}
                  opacity={1}
                  // Prevent thin strokes from disappearing at certain screen sizes
                  // due to SVG scaling and subpixel anti-aliasing.
                  vectorEffect="non-scaling-stroke"
                />
              );
            })()}
          {connectors.paths[i] && (
            <path
              d={connectors.paths[i]}
              fill="none"
              stroke="var(--accent-ink)"
              strokeWidth={1}
              strokeDasharray="12 3"
            />
          )}
        </Fragment>
      ))}
      {/* <DebugPoints points={centers} /> */}
    </g>
  );
}
