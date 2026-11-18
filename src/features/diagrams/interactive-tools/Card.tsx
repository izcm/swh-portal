import { cn } from "@/lib/cn";

import { Windows } from "./windows/Windows";
import { windowLayout } from "./windows/layout";

export function InteractiveToolsCard({ className }: { className?: string }) {
  const viewboxWidth = 320;
  const viewboxHeight = 240;

  const windows = (() => {
    const groupWidth = viewboxWidth * 0.85;

    const layout = windowLayout({
      groupWidth,
      boundedHeight: viewboxHeight,
      itemCount: 3,
      exitEndX: viewboxWidth,
    });

    const drawing = () => <Windows layout={layout} />;

    return { layout, drawing };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      width="100%"
      height="100%"
      overflow="visible"
      className={cn(className)}
    >
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
