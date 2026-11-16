import { cn } from "@/lib/cn";
import { alignCenter, DebugPoints, layoutUnit } from "@/lib/svg";
import { CityMap } from "./map/CityMap";
import { cityMapLayout } from "./map/cityMapLayout";
import { scandinaviaOrthographicBounds } from "./map/ScandinaviaOrthographic";
import { cities } from "./map/scandinaviaCities";

export function GeoVisualization({ className }: { className?: string }) {
  const viewboxHeight = 240;
  const viewboxWidth =
    (viewboxHeight * scandinaviaOrthographicBounds.width) /
    scandinaviaOrthographicBounds.height;

  const unit = layoutUnit(viewboxHeight);

  const cityMap = (() => {
    const height = viewboxHeight;
    const width =
      (height * scandinaviaOrthographicBounds.width) /
      scandinaviaOrthographicBounds.height;
    const { offset: x } = alignCenter(viewboxWidth, width);

    const drawing = () => (
      <CityMap
        x={x}
        y={0}
        height={height}
        rotation={15}
        dotRadius={unit * 0.07}
      />
    );

    const layout = cityMapLayout({ x, y: 0, height, rotation: 15 });

    return { drawing, layout };
  })();

  const stavanger = cityMap.layout.toDrawnMap(
    cities.norway.find((c) => c.city === "Stavanger")!,
  );

  // const tooltip = (() => {
  //   const
  // })

  return (
    <svg
      viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`}
      width="100%"
      height="100%"
      overflow="visible"
      preserveAspectRatio="xMidYMid meet"
      className={cn(className)}
    >
      {cityMap.drawing()}
      <g transform={cityMap.layout.transform}>
        {Array.from({ length: 4 }).map((_, i) => (
          <circle
            r={4 + i * 5}
            cx={stavanger.x}
            cy={stavanger.y}
            fill="var(--accent)"
            opacity={i * 0.02}
          />
        ))}

        {/* <DebugPoints points={[stavanger]} color="red" radius={12} /> */}
      </g>
    </svg>
  );
}
