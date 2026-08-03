"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  MapPinned,
  Ruler,
  X,
} from "lucide-react";
import type {
  LatLngExpression,
  Map as LeafletMap,
  Marker as LeafletMarker,
  Polyline as LeafletPolyline,
} from "leaflet";

import { Button } from "@/components/ui/button";
import {
  getPlaceKind,
  getPlaceRegion,
  placeEraLabel,
  type BiblePlace,
  type BiblePlaceRegionId,
} from "@/lib/bible-places";
import { cn } from "@/lib/utils";

import "leaflet/dist/leaflet.css";

const REGION_MARKER: Record<BiblePlaceRegionId, string> = {
  kanaan: "#b45309",
  galilea: "#0284c7",
  mesir: "#c2410c",
  mesopotamia: "#7c3aed",
  mediterania: "#0f766e",
  lainnya: "#475569",
};

const DEFAULT_CENTER: LatLngExpression = [31.9, 35.2];
const DEFAULT_ZOOM = 6;

type HolyLandGoogleMapProps = {
  places: BiblePlace[];
  activeSlug?: string | null;
  onSelect?: (slug: string | null) => void;
  className?: string;
};

/** Jarak haversine dalam kilometer. */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

function PlaceStoriesPreview({
  place,
  className,
  distanceLabel,
}: {
  place: BiblePlace;
  className?: string;
  distanceLabel?: string | null;
}) {
  const region = getPlaceRegion(place.region);
  const kind = getPlaceKind(place.kind);
  const stories = place.stories.slice(0, 4);
  const more = place.stories.length - stories.length;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--m-line)] bg-[var(--m-paper)]/95 shadow-lg backdrop-blur-sm",
        className,
      )}
    >
      <div className="border-b border-[var(--m-line)] px-3.5 py-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--m-ink)]">
              {place.name}
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-[var(--m-accent)]">
              {kind.label} · {region.label} · {place.stories.length} kisah
            </p>
            {distanceLabel ? (
              <p className="mt-1 text-[11px] font-semibold text-[var(--m-ink)]">
                {distanceLabel}
              </p>
            ) : null}
          </div>
          <span
            className="mt-1 size-2.5 shrink-0 rounded-full ring-2 ring-white"
            style={{ backgroundColor: REGION_MARKER[place.region] }}
            aria-hidden
          />
        </div>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--m-ink-soft)]">
          {place.blurb}
        </p>
      </div>
      <ul className="max-h-[11.5rem] space-y-0 overflow-y-auto overscroll-contain">
        {stories.map((story) => (
          <li
            key={`${story.reference}-${story.title}`}
            className="border-b border-[var(--m-line)]/70 px-3.5 py-2 last:border-b-0"
          >
            <div className="flex items-center gap-1.5">
              <span className="rounded bg-[var(--m-wash)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--m-ink-soft)]">
                {placeEraLabel(story.era)}
              </span>
              <span className="truncate text-[10px] font-medium text-[var(--m-accent)]">
                {story.reference}
              </span>
            </div>
            <p className="mt-0.5 text-xs font-semibold text-[var(--m-ink)]">
              {story.title}
            </p>
            <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-[var(--m-ink-soft)]">
              {story.summary}
            </p>
          </li>
        ))}
      </ul>
      {more > 0 ? (
        <p className="border-t border-[var(--m-line)] px-3.5 py-1.5 text-[10px] text-[var(--m-ink-soft)]">
          +{more} kisah lainnya di halaman detail
        </p>
      ) : null}
      <div className="border-t border-[var(--m-line)] px-3.5 py-2">
        <Link
          href={`/baca/peta/${place.slug}`}
          className="text-xs font-semibold text-[var(--m-accent)] hover:underline"
        >
          Buka detail tempat →
        </Link>
      </div>
    </div>
  );
}

/** Peta tempat Alkitab dengan pin + ukur jarak. */
export function HolyLandGoogleMap({
  places,
  activeSlug,
  onSelect,
  className,
}: HolyLandGoogleMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, LeafletMarker>>(new Map());
  const lineRef = useRef<LeafletPolyline | null>(null);

  const [ready, setReady] = useState(false);
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);
  const [measureMode, setMeasureMode] = useState(false);
  const [measureFrom, setMeasureFrom] = useState<string | null>(null);
  const [measureTo, setMeasureTo] = useState<string | null>(null);

  const onSelectRef = useRef(onSelect);
  const measureModeRef = useRef(measureMode);
  const measureFromRef = useRef(measureFrom);
  const measureToRef = useRef(measureTo);
  onSelectRef.current = onSelect;
  measureModeRef.current = measureMode;
  measureFromRef.current = measureFrom;
  measureToRef.current = measureTo;

  const previewSlug = hoverSlug ?? activeSlug ?? measureTo ?? measureFrom;
  const previewPlace =
    places.find((place) => place.slug === previewSlug) ?? null;

  const fromPlace = places.find((place) => place.slug === measureFrom) ?? null;
  const toPlace = places.find((place) => place.slug === measureTo) ?? null;
  const measuredKm =
    fromPlace && toPlace
      ? distanceKm(
          { lat: fromPlace.lat, lng: fromPlace.lng },
          { lat: toPlace.lat, lng: toPlace.lng },
        )
      : null;

  const placeKey = useMemo(
    () => places.map((place) => place.slug).join("|"),
    [places],
  );

  const distanceLabel =
    fromPlace && toPlace && measuredKm != null
      ? `${fromPlace.name} → ${toPlace.name} · ${formatDistance(measuredKm)}`
      : measureMode && measureFrom && !measureTo
        ? "Ketuk pin kedua untuk mengukur jarak"
        : null;

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;
      setReady(true);
      requestAnimationFrame(() => map.invalidateSize());
    }

    void init();

    return () => {
      cancelled = true;
      lineRef.current?.remove();
      lineRef.current = null;
      for (const marker of markersRef.current.values()) marker.remove();
      markersRef.current.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    async function syncMarkers() {
      const map = mapRef.current;
      if (!map || !ready) return;
      const L = (await import("leaflet")).default;

      for (const marker of markersRef.current.values()) marker.remove();
      markersRef.current.clear();

      if (places.length === 0) return;

      const bounds = L.latLngBounds([]);

      for (const place of places) {
        const color = REGION_MARKER[place.region];
        const icon = L.divIcon({
          className: "bab-map-pin",
          html: `<span style="
            display:block;width:16px;height:16px;border-radius:999px;
            background:${color};border:2px solid #fff;
            box-shadow:0 1px 4px rgba(0,0,0,.35);
          "></span>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        const marker = L.marker([place.lat, place.lng], {
          icon,
          title: place.name,
          riseOnHover: true,
        }).addTo(map);

        marker.bindTooltip(place.name, {
          direction: "top",
          offset: [0, -10],
          opacity: 0.95,
        });

        marker.on("click", () => {
          onSelectRef.current?.(place.slug);
          setHoverSlug(place.slug);

          if (!measureModeRef.current) return;

          const currentFrom = measureFromRef.current;
          const currentTo = measureToRef.current;
          if (!currentFrom || currentTo) {
            setMeasureFrom(place.slug);
            setMeasureTo(null);
            return;
          }
          if (currentFrom !== place.slug) {
            setMeasureTo(place.slug);
          }
        });

        marker.on("mouseover", () => {
          if (!measureModeRef.current) setHoverSlug(place.slug);
        });

        markersRef.current.set(place.slug, marker);
        bounds.extend([place.lat, place.lng]);
      }

      if (places.length === 1) {
        map.setView([places[0]!.lat, places[0]!.lng], 10);
      } else {
        map.fitBounds(bounds.pad(0.18));
      }
    }

    void syncMarkers();
  }, [placeKey, places, ready]);

  useEffect(() => {
    async function syncMeasureLine() {
      const map = mapRef.current;
      if (!map || !ready) return;
      const L = (await import("leaflet")).default;

      lineRef.current?.remove();
      lineRef.current = null;

      if (!fromPlace || !toPlace) return;

      lineRef.current = L.polyline(
        [
          [fromPlace.lat, fromPlace.lng],
          [toPlace.lat, toPlace.lng],
        ],
        {
          color: "#b42318",
          weight: 3,
          dashArray: "8 6",
          opacity: 0.9,
        },
      ).addTo(map);

      const mid: LatLngExpression = [
        (fromPlace.lat + toPlace.lat) / 2,
        (fromPlace.lng + toPlace.lng) / 2,
      ];
      lineRef.current.bindTooltip(
        formatDistance(measuredKm ?? 0),
        { permanent: true, direction: "center", className: "bab-distance-tip" },
      );
      map.fitBounds(lineRef.current.getBounds().pad(0.35));
      void mid;
    }

    void syncMeasureLine();
  }, [fromPlace, toPlace, measuredKm, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !activeSlug) return;
    const place = places.find((item) => item.slug === activeSlug);
    if (!place) return;
    map.panTo([place.lat, place.lng]);
    setHoverSlug(activeSlug);
  }, [activeSlug, places, ready]);

  useEffect(() => {
    async function restylePins() {
      const L = (await import("leaflet")).default;
      for (const [slug, marker] of markersRef.current) {
        const place = places.find((item) => item.slug === slug);
        if (!place) continue;
        const selected =
          slug === previewSlug ||
          slug === measureFrom ||
          slug === measureTo;
        const size = selected ? 20 : 16;
        const color = REGION_MARKER[place.region];
        marker.setIcon(
          L.divIcon({
            className: "bab-map-pin",
            html: `<span style="
              display:block;width:${size}px;height:${size}px;border-radius:999px;
              background:${color};border:2px solid #fff;
              box-shadow:0 1px 4px rgba(0,0,0,.35);
              outline:${slug === measureFrom || slug === measureTo ? "2px solid #b42318" : "none"};
              outline-offset:2px;
            "></span>`,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          }),
        );
      }
    }
    void restylePins();
  }, [previewSlug, measureFrom, measureTo, places, ready]);

  function clearMeasure() {
    setMeasureFrom(null);
    setMeasureTo(null);
  }

  function toggleMeasure() {
    setMeasureMode((current) => {
      const next = !current;
      if (!next) clearMeasure();
      return next;
    });
  }

  function flyToPlace(slug: string) {
    const place = places.find((item) => item.slug === slug);
    const map = mapRef.current;
    if (!place || !map) return;
    setHoverSlug(slug);
    onSelect?.(slug);
    map.flyTo([place.lat, place.lng], Math.max(map.getZoom(), 9), {
      duration: 0.7,
    });
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[var(--m-line)] bg-[var(--m-wash)]",
        className,
      )}
    >
      <div
        ref={containerRef}
        className="z-0 aspect-square w-full sm:aspect-[5/4] [&_.leaflet-control-attribution]:text-[9px]"
        role="application"
        aria-label="Peta tempat Alkitab"
      />

      <div className="pointer-events-none absolute top-2.5 right-2.5 left-2.5 z-[500] flex items-start justify-between gap-2">
        <div className="pointer-events-auto flex flex-col gap-1.5">
          <Button
            type="button"
            size="sm"
            variant={measureMode ? "default" : "secondary"}
            className="h-9 rounded-xl border border-[var(--m-line)] bg-[var(--m-paper)]/95 font-semibold shadow-sm"
            onClick={toggleMeasure}
          >
            <Ruler className="size-3.5" />
            {measureMode ? "Selesai ukur" : "Ukur jarak"}
          </Button>
          {measureMode || measureFrom || measureTo ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 rounded-xl bg-[var(--m-paper)]/90 text-xs font-semibold shadow-sm"
              onClick={clearMeasure}
            >
              <X className="size-3.5" />
              Reset jarak
            </Button>
          ) : null}
        </div>

        {previewPlace ? (
          <div
            className="pointer-events-auto max-h-[58%] w-full max-w-sm overflow-y-auto sm:w-80"
            onMouseEnter={() => setHoverSlug(previewPlace.slug)}
          >
            <PlaceStoriesPreview
              place={previewPlace}
              distanceLabel={distanceLabel}
            />
          </div>
        ) : (
          <div className="pointer-events-none max-w-[14rem] rounded-xl border border-[var(--m-line)] bg-[var(--m-paper)]/95 px-3 py-2 text-[11px] text-[var(--m-ink-soft)] shadow-sm sm:max-w-xs">
            {measureMode
              ? "Mode ukur: ketuk dua pin untuk melihat jaraknya."
              : "Ketuk pin untuk melihat kisah di lokasi itu."}
          </div>
        )}
      </div>

      {measuredKm != null && fromPlace && toPlace ? (
        <div className="pointer-events-none absolute bottom-14 left-1/2 z-[500] -translate-x-1/2">
          <div className="rounded-full bg-[var(--m-ink)] px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
            <MapPinned className="mr-1.5 inline size-3.5 opacity-80" />
            {fromPlace.name} → {toPlace.name}: {formatDistance(measuredKm)}
          </div>
        </div>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 z-[500] max-h-[32%] overflow-y-auto bg-gradient-to-t from-black/70 via-black/45 to-transparent px-2.5 pt-8 pb-2.5">
        <div className="flex flex-wrap gap-1.5">
          {places.map((place) => {
            const active =
              place.slug === previewSlug ||
              place.slug === measureFrom ||
              place.slug === measureTo;
            return (
              <button
                key={place.slug}
                type="button"
                onClick={() => {
                  if (measureMode) {
                    if (!measureFrom || (measureFrom && measureTo)) {
                      setMeasureFrom(place.slug);
                      setMeasureTo(null);
                    } else if (measureFrom !== place.slug) {
                      setMeasureTo(place.slug);
                    }
                    setHoverSlug(place.slug);
                    onSelect?.(place.slug);
                    mapRef.current?.panTo([place.lat, place.lng]);
                  } else {
                    flyToPlace(place.slug);
                  }
                }}
                className={cn(
                  "rounded-full px-2 py-1 text-[10px] font-semibold text-white ring-1 transition",
                  active
                    ? "bg-white/35 ring-white"
                    : "bg-black/40 ring-white/30 hover:bg-black/55",
                )}
              >
                {place.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
