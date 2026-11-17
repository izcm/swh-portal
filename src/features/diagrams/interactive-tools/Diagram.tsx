import { cn } from "@/lib/cn";
import {
  alignCenter,
  alignEnd,
  cascadeLayout,
  deg,
  layoutUnit,
} from "@/lib/svg";

import { Floor, tileStyleNames } from "../shared/floor/Floor";
import {
  serviceFloorLayout,
  serviceFloorLook,
} from "../shared/floor/serviceFloorLayout";

// // the menu board's rows: one per action
// const actions: MenuBoardRow[] = [
//   { icon: Plus, lines: ["Create task"] },
//   { icon: User, lines: ["Assign to"] },
//   { icon: Eye, lines: ["Track item"] },
// ];

export function InteractiveToolsDiagram({ className }: { className?: string }) {
  const viewboxWidth = 540;
  const viewboxHeight = 360;

  const unit = layoutUnit(viewboxWidth);

  const windows = (() => {
    const heightToWidthRatio = 0.8;

    const layout = cascadeLayout({
      groupWidth: viewboxWidth * 0.8,
      heightToWidthRatio,
      angle: deg(-10),
      count: 4,
      gapX: 80,
      gapY: 60,
      side: "left",
    });

    const { item, gapX, gapY, count } = layout;

    // the cascade is already viewboxWidth wide, so only shrink it to fit the height
    const scale = Math.min(1, viewboxHeight / layout.stackHeight);
    const translateX = 0;

    // front to back. nudges on top of each window's layout spot
    const windowStyles: {
      dx?: number;
      dy?: number;
      height?: number;
      opacity?: number;
    }[] = [
      { opacity: 1 },
      { dx: -gapX * 0.2, height: item.height * 1.08, opacity: 0.85 },
      {
        dx: gapX * 0,
        dy: -gapY * 0.2,
        height: item.height * 0.92,
        opacity: 0.7,
      },
      { dy: gapY * 0.15, opacity: 0.5 },
    ];

    const drawing = () => (
      <g
        transform={`translate(${translateX}, 0) scale(${scale}) ${layout.transform}`}
      >
        {layout.items.map((base, i) => {
          // items go back to front, windowStyles front to back
          const {
            dx = 0,
            dy = 0,
            height = base.height,
            opacity = 1,
          } = windowStyles[count - 1 - i] ?? {};

          return (
            <rect
              key={i}
              x={base.x + dx}
              y={base.y + dy}
              width={base.width}
              height={height}
              rx={12}
              fill="var(--pane-fill)"
              stroke="var(--accent-bright)"
              strokeWidth={1}
              opacity={opacity}
            />
          );
        })}
      </g>
    );
    return { drawing };
  })();

  const floor = (() => {
    const layout = serviceFloorLayout({
      viewboxWidth,
      viewboxHeight,
      angle: deg(11.25),
    });

    const drawing = () => (
      <Floor
        layout={layout}
        {...serviceFloorLook}
        tileStyle={tileStyleNames[0]}
        tileOpacity={0.1}
      />
    );

    return { drawing };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      overflow="visible"
      className={cn("block w-full", className)}
    >
      {floor.drawing()}

      {windows.drawing()}
      {/* debug: the viewbox's edges */}
      <rect
        className="svg-debug"
        width={viewboxWidth}
        height={viewboxHeight}
        fill="none"
        stroke="#aab4e6" // lavender
        strokeWidth={0.75}
        strokeDasharray="6 4"
      />
    </svg>
  );
}
