import { Fragment, useId } from "react";
import { cityMapLayout } from "./cityMapLayout";
import { ScandinaviaOrthographic } from "./ScandinaviaOrthographic";
import { cities } from "./scandinaviaCities";

// blur: the circle's feGaussianBlur stdDeviation. not blurred if left out
type Ring = { radius: number; opacity: number; blur?: number };

// scandinavia's land, its coastline and the cities as glowing dots. `height`
// tall, its top-left at (x, y), turned `rotation` degrees around its middle
export function CityMap({
  x,
  y,
  height,
  rotation = 0,
  dotRadius,
}: {
  x: number;
  y: number;
  height: number;
  rotation?: number;
  dotRadius: number;
}) {
  const blurId = useId();

  const {
    rotate,
    transform: mapTransform,
    toDrawnMap,
  } = cityMapLayout({ x, y, height, rotation });

  const everyCountry = (fill: string) => ({
    norway: fill,
    sweden: fill,
    denmark: fill,
    finland: fill,
  });

  const placement = {
    x,
    y,
    height,
    transform: rotate,
  };

  const countryFills = [
    { fill: "oklch(from var(--pane-fill) l c h)", opacity: 1 },
  ];

  // the cities' x, y are in the map's own coordinates, so they're scaled to the
  // size it's drawn at
  const cityDots = (() => {
    // flat see-through circles stacked under the dot, the biggest the faintest
    // every busier level adds one more ring outside the last
    const dot: Ring = { radius: dotRadius, opacity: 1 };
    const ringStep = dotRadius * 1.5;

    const halo = (level: number): Ring[] =>
      level > 0
        ? [
            {
              radius: ringStep * level,
              opacity: 0,
              blur: ringStep * level,
            },
          ]
        : [];

    const ringsFor = (level: number): Ring[] => [
      ...halo(level),
      ...Array.from({ length: level + 1 }, (_, i) => ({
        radius: dotRadius + ringStep * (i + 1),
        opacity: 0.3 * 0.75 ** i,
      })).reverse(),
      dot,
    ];

    const points = Object.values(cities)
      .flat()
      .map(({ x, y, level }) => ({
        ...toDrawnMap({ x, y }),
        rings: ringsFor(level ?? 0),
      }));

    return { points };
  })();

  const landId = useId();

  return (
    <>
      <defs>
        <radialGradient id={landId} cx={0.5} cy={0} r={1}>
          <stop offset={0} stopColor="var(--ground)" stopOpacity={1} />
          <stop offset={1} stopColor="var(--accent)" stopOpacity={1} />
        </radialGradient>
      </defs>

      {countryFills.map(({ fill, opacity }, i) => (
        <ScandinaviaOrthographic
          key={i}
          {...placement}
          fills={everyCountry(fill)}
          fillOpacity={opacity}
          stroke="none"
          strokeWidth={0}
        />
      ))}

      <ScandinaviaOrthographic
        {...placement}
        fills={everyCountry("none")}
        stroke="var(--accent-bright)"
        strokeWidth={0.75}
      />

      {/* city dots */}
      <g transform={mapTransform}>
        {cityDots.points.map(({ x, y, rings }, i) => (
          <g key={i}>
            {rings.map(({ radius, opacity, blur }, j) => {
              const filterId = `${blurId}-${i}-${j}`;
              return (
                <Fragment key={j}>
                  {/* room for the blur: it reaches ~3× its stdDeviation past the circle */}
                  {blur !== undefined && (
                    <filter
                      id={filterId}
                      x="-100%"
                      y="-100%"
                      width="300%"
                      height="300%"
                    >
                      <feGaussianBlur stdDeviation={blur} />
                    </filter>
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill="var(--accent-bright)"
                    fillOpacity={opacity}
                    filter={
                      blur !== undefined ? `url(#${filterId})` : undefined
                    }
                  />
                </Fragment>
              );
            })}
          </g>
        ))}
      </g>
    </>
  );
}
