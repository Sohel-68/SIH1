/**
 * Survey of India (SOI) & DILRMP Cadastral Precision Standards
 */

export const CADASTRAL_TOLERANCES = {
  // Maximum horizontal accuracy in meters
  MAX_BOUNDARY_ACCURACY_METERS: 0.05, // 5 cm (Survey-Grade DGPS / RTK)
  MAX_TOPO_ACCURACY_METERS: 0.25,     // 25 cm (Auxiliary features)

  // Satellite and geometric dilution
  MIN_SATELLITE_COUNT: 6,
  MAX_HDOP: 2.0,

  // Geometry closure limits
  MAX_POLYGON_CLOSURE_METERS: 0.15, // 15 cm closure tolerance

  // Photographic evidence minimums
  MIN_REQUIRED_CORNER_PHOTOS: 4,

  // RTK Rover age of differential correction
  MAX_CORRECTION_AGE_SECONDS: 5.0,
};
