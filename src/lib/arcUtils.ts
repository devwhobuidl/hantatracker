import { Case } from "./data";

export function createArc(start: [number, number], end: [number, number], points = 50) {
  const line: [number, number][] = [];

  // Calculate midpoint and distance
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Control point for quadratic bezier
  // We want the arc to bend away from the center to look like it's hovering
  const midX = (start[0] + end[0]) / 2;
  const midY = (start[1] + end[1]) / 2;

  // Perpendicular offset for arc height
  // Higher distance = higher arc
  const arcHeight = distance * 0.2;
  const angle = Math.atan2(dy, dx);
  const controlX = midX + Math.cos(angle + Math.PI / 2) * arcHeight;
  const controlY = midY + Math.sin(angle + Math.PI / 2) * arcHeight;

  for (let i = 0; i <= points; i++) {
    const t = i / points;
    // Quadratic Bezier Formula: (1-t)^2*P0 + 2(1-t)t*P1 + t^2*P2
    const x = Math.pow(1 - t, 2) * start[0] + 2 * (1 - t) * t * controlX + Math.pow(t, 2) * end[0];
    const y = Math.pow(1 - t, 2) * start[1] + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * end[1];
    line.push([x, y]);
  }

  return line;
}

export function generateOutbreakArcs(cases: Case[]) {
  const features: {
    type: "Feature";
    properties: {
      id: string;
      status: string;
    };
    geometry: {
      type: "LineString";
      coordinates: [number, number][];
    };
  }[] = [];

  // Connect some cases to represent "spread"
  // Connect Case 5 (Zurich) to others
  const zurich = cases.find(c => c.location.includes("ZURICH"));
  if (zurich) {
    const others = cases.filter(c => c.id !== zurich.id).slice(0, 5);
    others.forEach(other => {
      features.push({
        type: "Feature",
        properties: {
          id: `arc-${zurich.id}-${other.id}`,
          status: other.status
        },
        geometry: {
          type: "LineString",
          coordinates: createArc([zurich.lng, zurich.lat], [other.lng, other.lat])
        }
      });
    });
  }

  return {
    type: "FeatureCollection" as const,
    features
  };
}
