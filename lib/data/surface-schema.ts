export type MeasurementUnit = "ft" | "yd" | "m";

export interface SurfaceSpec {
  /** Length of the playing surface */
  length: number;
  /** Width of the playing surface */
  width: number;
  /** Unit used for length and width */
  unit: MeasurementUnit;
  /** Key markings that must appear on the surface */
  markings: string[];
}
