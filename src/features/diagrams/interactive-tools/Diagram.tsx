import { cn } from "@/lib/cn";
import { deg, layoutUnit } from "@/lib/svg";

import { Floor, tileStyleNames } from "../shared/floor/Floor";
import {
  serviceFloorLayout,
  serviceFloorLook,
} from "../shared/floor/serviceFloorLayout";
import { Windows } from "./windows/Windows";
import { windowLayout } from "./windows/layout";

export function InteractiveToolsDiagram({ className }: { className?: string }) {
  const viewboxWidth = 540;
  const viewboxHeight = 360;

  const unit = layoutUnit(viewboxWidth);

  const windows = (() => {
    const layout = windowLayout({
      groupWidth: viewboxWidth * 0.8,
      boundedHeight: viewboxHeight,
      itemCount: 4,
    });

    const drawing = () => <Windows layout={layout} />;

    return { layout, drawing };
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
