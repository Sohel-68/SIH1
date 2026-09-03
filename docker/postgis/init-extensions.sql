-- ==============================================================================
-- GeoStrata: Database Extension Initializer
-- Platform: PostgreSQL 16 + PostGIS 3.4
-- Standards: ISO 19152 Land Administration Domain Model (LADM)
-- ==============================================================================

-- Core Geospatial Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS postgis_raster;

-- 3D Volumetric and Solid Geometry Processing (SFCGAL)
-- Enables ST_3DIntersects, ST_Volume, ST_MakeSolid, ST_Extrude
CREATE EXTENSION IF NOT EXISTS postgis_sfcgal;

-- UUID Generation for globally unique cadastral & title identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Full-text search and cryptographic hashing for tamper-evident audit logs
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Verify PostGIS Version and 3D SFCGAL support
DO $$
BEGIN
    RAISE NOTICE 'GeoStrata Spatial Database Initialized Successfully.';
    RAISE NOTICE 'PostGIS Version: %', postgis_full_version();
END $$;
