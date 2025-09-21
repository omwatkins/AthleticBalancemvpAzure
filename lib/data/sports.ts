import { SurfaceSpec } from "./surface-schema";

export const SURFACE_SPECS: Record<string, SurfaceSpec> = {
  basketball: {
    length: 94,
    width: 50,
    unit: "ft",
    markings: ["center circle", "three-point arc", "free throw lane"],
  },
  football: {
    length: 120, // including end zones
    width: 53.3,
    unit: "yd",
    markings: ["yard lines", "hash marks", "end zones"],
  },
  soccer: {
    length: 105,
    width: 68,
    unit: "m",
    markings: ["center circle", "penalty box", "goal area"],
  },
  baseball: {
    length: 90,
    width: 90,
    unit: "ft",
    markings: ["diamond basepaths", "pitcher's mound", "home plate"],
  },
  softball: {
    length: 60,
    width: 60,
    unit: "ft",
    markings: ["diamond basepaths", "pitching circle", "home plate"],
  },
  volleyball: {
    length: 60,
    width: 30,
    unit: "ft",
    markings: ["center line", "attack line", "service line"],
  },
  track: {
    length: 400,
    width: 9.76,
    unit: "m",
    markings: ["lane lines", "start/finish lines", "relay exchange zones"],
  },
  "cross country": {
    length: 5000,
    width: 5,
    unit: "m",
    markings: ["start line", "finish chute"],
  },
  tennis: {
    length: 78,
    width: 36,
    unit: "ft",
    markings: ["baseline", "service boxes", "center mark"],
  },
  lacrosse: {
    length: 110,
    width: 60,
    unit: "yd",
    markings: ["goal crease", "restraining box", "midfield line"],
  },
  wrestling: {
    length: 42,
    width: 42,
    unit: "ft",
    markings: ["outer circle", "inner circle", "starting lines"],
  },
  swimming: {
    length: 50,
    width: 25,
    unit: "m",
    markings: ["lane lines", "flags", "turn lines"],
  },
  hockey: {
    length: 200,
    width: 85,
    unit: "ft",
    markings: ["red line", "blue lines", "goal creases", "faceoff circles"],
  },
  golf: {
    length: 150,
    width: 150,
    unit: "yd",
    markings: ["tee box", "fairway", "green"],
  },
};

export function surfaceSpecFor(
  sport: string | null | undefined,
): SurfaceSpec | null {
  if (!sport) return null;
  const key = sport.toLowerCase();
  return SURFACE_SPECS[key] || null;
}
