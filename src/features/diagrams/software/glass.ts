import "./glass.css";

// the look of the old ISOCube: sharp dark glass at 80%, middle edge on.

// export const glassFill = "var(--accent-faint)";

// more electric maybe later with some retouches?
// const glassFill = "oklch(from var(--accent) 0.32 0.2 h / 0.35)";

export const glassCube = {
  radius: 0,
  fills: {
    roof: "var(--glass-roof)",
    left: "var(--glass-left)",
    right: "var(--glass-right)",
    floor: [],
  },
  strokeWidth: 1,
};

// ISOCube drew every edge twice (face outline + edge line) and its edge
// gradient is see-through, so the doubled edges were brighter: two layers of
// 50% / 100% / 35% stack up to 75% / 100% / 58%, which is what this is
export const glassEdgeOpacity: [number, number, number] = [0.5, 0.5, 0.5];
