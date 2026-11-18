import { cn } from "@/lib/cn";
import { alignCenter, deg, Gear, gearLayout } from "@/lib/svg";

export function AutomationCard({ className }: { className?: string }) {
  const viewboxWidth = 320;
  const viewboxHeight = 240;

  const gear = (radiusRatio: number) => {
    const radius = viewboxHeight * radiusRatio;
    const teethCount = 8;
    const holeRadius = radius * 0.55;
    return gearLayout({
      radius,
      teethCount,
      // a gear's "module" (2 · radius / teethCount), made taller
      toothHeight: ((2 * radius) / teethCount) * 1,
      toothShare: 0.6,
      toothLean: deg(20),
      holeRadius,
      holeRingRadius: holeRadius * 1.2,
      depth: radius * 0.1,
      tilt: deg(-10),
    });
  };

  const bigGear = (() => {
    const layout = gear(0.28);
    const translateX = 0;
    const translateY = 0;
    const drawing = () => (
      <g transform={`translate(${translateX}, ${translateY})`}>
        <Gear layout={layout} frontFill="var(--pane-fill)" />
      </g>
    );
    return { layout, translateX, translateY, drawing };
  })();

  // over the big gear's right side, so the teeth mesh
  const smallGear = (() => {
    const layout = gear(0.22);
    const translateX = bigGear.translateX + bigGear.layout.groupWidth * 0.625;
    const translateY = -40;
    const drawing = () => (
      <g transform={`translate(${translateX}, ${translateY})`}>
        <Gear layout={layout} frontFill="var(--pane-fill)" />
      </g>
    );
    return { layout, translateX, translateY, drawing };
  })();

  // both gears, as big as the viewbox allows and centered in it
  const gearPair = (() => {
    const groupWidth = smallGear.translateX + smallGear.layout.groupWidth;

    const top = Math.min(bigGear.translateY, smallGear.translateY);
    const bottom = Math.max(
      bigGear.translateY + bigGear.layout.groupHeight,
      smallGear.translateY + smallGear.layout.groupHeight,
    );
    const groupHeight = bottom - top;

    const scale = Math.min(
      viewboxWidth / groupWidth,
      viewboxHeight / groupHeight,
    );

    const { offset: translateX } = alignCenter(
      viewboxWidth,
      groupWidth * scale,
    );
    const { offset } = alignCenter(viewboxHeight, groupHeight * scale);
    const translateY = offset - top * scale;

    return { translateX, translateY, scale };
  })();

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      width="100%"
      height="100%"
      overflow="visible"
      // preserveAspectRatio="xMidYMid meet"
      className={cn(className)}
    >
      <g
        transform={`translate(${gearPair.translateX}, ${gearPair.translateY}) scale(${gearPair.scale})`}
      >
        {smallGear.drawing()}
        {bigGear.drawing()}
      </g>
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
