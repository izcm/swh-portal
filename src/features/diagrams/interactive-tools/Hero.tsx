import { cn } from "@/lib/cn";
import { deg, glyphStrokeLucide, layoutUnit } from "@/lib/svg";

import { Floor, tileStyleNames } from "../shared/floor/Floor";
import {
  serviceFloorLayout,
  serviceFloorLook,
} from "../shared/floor/serviceFloorLayout";
import { Windows } from "./windows/Windows";
import { windowLayout } from "./windows/layout";
import { Check } from "lucide-react";

export function InteractiveToolsHero({ className }: { className?: string }) {
  const viewboxWidth = 540;
  const viewboxHeight = 360;

  const unit = layoutUnit(viewboxWidth);

  const windows = (() => {
    const groupWidth = viewboxWidth * 0.75;

    const layout = windowLayout({
      groupWidth,
      boundedHeight: viewboxHeight,
      itemCount: 4,
    });

    const drawing = () => <Windows layout={layout} />;

    return { layout, width: groupWidth, drawing };
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

  const frontWindow = windows.layout.windows[3];
  const frontWindowCenter = {
    x: frontWindow.x + frontWindow.width * 0.5,
    y: frontWindow.y + frontWindow.height * 0.5,
  };

  const checkMarkCirle = (() => {
    const radius = unit * 0.6;
    const checkSize = radius * 1.2;

    const distance = viewboxWidth - windows.width;

    const dx = Math.sin(deg(60)) * distance;
    const dy = Math.cos(deg(60)) * distance;

    const drawing = () => (
      <g
        transform={`${windows.layout.transform} translate(${frontWindowCenter.x}, ${frontWindowCenter.y})`}
      >
        <line
          // d={connectors.paths[i]}
          x2={dx}
          y2={dy}
          fill="none"
          stroke="var(--accent-ink)"
          strokeWidth={1}
          strokeDasharray="12 3"
        />
        <g transform={`translate(${dx}, ${dy})`}>
          <circle
            cx={0}
            cy={0}
            r={radius}
            fill="var(--pane-fill)"
            stroke="var(--accent-bright)"
          />

          <Check
            x={-checkSize * 0.5}
            y={-checkSize * 0.5 + checkSize / 48}
            size={checkSize}
            stroke="var(--accent-bright)"
            strokeWidth={glyphStrokeLucide(checkSize, 2)}
          />
        </g>
      </g>
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
      {checkMarkCirle.drawing()}

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
