import { cascadeLayout, deg, layoutUnit, pointOnLine } from "@/lib/svg";

export function windowLayout({
  groupWidth,
  boundedHeight,
  itemCount,
  exitEndX,
}: {
  groupWidth: number;
  boundedHeight: number;
  itemCount: number;
  exitEndX?: number;
}) {
  const heightToWidthRatio = 0.8;

  const gapXShare = 0.56;
  const gapYShare = 0.43;

  // the window width that fits itemCount windows plus their gaps in groupWidth
  const itemWidth = groupWidth / (1 + (itemCount - 1) * gapXShare);

  const layout = cascadeLayout({
    groupWidth,
    heightToWidthRatio,
    angle: deg(-10),
    count: itemCount,
    gapX: itemWidth * gapXShare,
    gapY: itemWidth * gapYShare,
    side: "left",
  });

  const { item, gapX, gapY, count, stackHeight, items } = layout;

  const scale = Math.min(1, boundedHeight / stackHeight);
  const translateX = 0;

  // front to back. nudges on top of each window's layout spot
  const windowStyles: {
    dx?: number;
    dy?: number;
    height?: number;
    opacity?: number;
  }[] = [
    { opacity: 1, dx: gapX * 0.4 },
    { dx: gapX * 0.4, height: item.height * 1.08, opacity: 1 },
    {
      dx: -gapX * 0.2,
      dy: -gapY * 0.2,
      height: item.height * 0.92,
      opacity: 1,
    },
    { dy: gapY * 0.15, opacity: 1 },
  ];

  // back to front, each with its windowStyles nudge applied
  const windows = items.map((base, i) => {
    const {
      dx = 0,
      dy = 0,
      height = base.height,
      opacity = 1,
    } = windowStyles[count - 1 - i] ?? {};

    return {
      x: base.x + dx,
      y: base.y + dy,
      width: base.width,
      height,
      opacity,
    };
  });

  // connector must come through middle of front window
  // const frontItem = layout.items[0];
  const centers = windows.map(({ x, y, width, height }) => ({
    x: x + width * 0.5,
    y: y + height * 0.5,
  }));

  // middle of each window's layout spot, before the windowStyles nudges
  const absoluteCenters = items.map(({ x, y, width, height }) => ({
    x: x + width * 0.5,
    y: y + height * 0.5,
  }));

  // in the windows' own space, so it scales with them
  const unit = layoutUnit(groupWidth);

  // a line out of the front window, in the same direction as the connectors,
  // ending where the check mark's right edge touches exitEndX in the viewbox
  const exit = (() => {
    if (exitEndX === undefined) return undefined;

    const radius = unit * 0.75;
    const from = centers[centers.length - 2];
    const to = centers[centers.length - 1];

    // the windows' transform only scales x (skewY leaves x alone), so undo the scale
    const endX = (exitEndX - translateX) / scale - radius;
    const t = (endX - from.x) / (to.x - from.x);

    return { start: to, end: pointOnLine(from, to, t), radius };
  })();

  return {
    transform: `translate(${translateX}, 0) scale(${scale}) ${layout.transform}`,
    windows,
    centers,
    absoluteCenters,
    exit,
    unit,
  };
}
