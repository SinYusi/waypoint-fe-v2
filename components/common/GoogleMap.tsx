"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils/utils";
import newMarkerIconUrl from "@/public/icons/new_marker.svg?url";

type LatLngLiteral = {
  lat: number;
  lng: number;
};

type MarkerIconOption = {
  url: unknown;
};

type GoogleMapInstance = {
  setCenter: (position: LatLngLiteral) => void;
  setZoom: (zoom: number) => void;
  getZoom?: () => number;
  fitBounds: (bounds: unknown, padding?: number) => void;
};

type GoogleSizeInstance = {
  width: number;
  height: number;
};

type GooglePointInstance = {
  x: number;
  y: number;
};

type GoogleMarkerIcon = {
  url: string;
  scaledSize?: GoogleSizeInstance;
  anchor?: GooglePointInstance;
};

type GoogleMarkerInstance = {
  setMap: (map: GoogleMapInstance | null) => void;
  setPosition: (position: LatLngLiteral) => void;
  setTitle: (title: string) => void;
  setIcon: (icon: GoogleMarkerIcon | string | null) => void;
};

type GoogleOverlayInstance = {
  setMap: (map: GoogleMapInstance | null) => void;
};

type GoogleMapsApi = {
  maps: {
    Map: new (
      mapDiv: HTMLElement,
      opts: Record<string, unknown>,
    ) => GoogleMapInstance;
    Marker: new (opts: {
      map: GoogleMapInstance;
      position: LatLngLiteral;
      title?: string;
      icon?: GoogleMarkerIcon | string;
    }) => GoogleMarkerInstance;
    Size: new (width: number, height: number) => GoogleSizeInstance;
    Point: new (x: number, y: number) => GooglePointInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OverlayView: new () => any;
    LatLng: new (lat: number, lng: number) => unknown;
    LatLngBounds: new () => { extend: (point: unknown) => void };
    importLibrary?: (name: string) => Promise<unknown>;
  };
};

type MarkerItem = {
  position: LatLngLiteral;
  title?: string;
};

export type OverlayMarkerItem = {
  position: LatLngLiteral;
  element: HTMLElement;
};

type GoogleMapProps = {
  center: LatLngLiteral;
  zoom?: number;
  markerPosition?: LatLngLiteral;
  markerTitle?: string;
  markerIcon?: MarkerIconOption;
  markers?: MarkerItem[];
  overlayMarkers?: OverlayMarkerItem[];
  fitPositions?: LatLngLiteral[];
  className?: string;
  apiKey?: string;
  mapOptions?: Record<string, unknown>;
  showZoomControls?: boolean;
};

declare global {
  interface Window {
    google?: GoogleMapsApi;
    __googleMapsApiPromise?: Promise<void>;
    __googleMapsApiOnLoad?: () => void;
  }
}

const GOOGLE_MAP_SCRIPT_ID = "google-maps-sdk";
const GOOGLE_MAP_API_VERSION = "weekly";
const FIXED_MARKER_WIDTH = 41;
const FIXED_MARKER_HEIGHT = 50;
const FIXED_MARKER_ANCHOR_X = 20.5;
const FIXED_MARKER_ANCHOR_Y = 50;
const MIN_ZOOM = 0;
const MAX_ZOOM = 21;

function loadGoogleMapsApi(apiKey: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Google Maps API can only be loaded in the browser."),
    );
  }

  if (window.google?.maps) {
    return Promise.resolve();
  }

  if (window.__googleMapsApiPromise) {
    return window.__googleMapsApiPromise;
  }

  window.__googleMapsApiPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      GOOGLE_MAP_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    const callbackName = "__googleMapsApiOnLoad";
    const scriptSrc = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=${GOOGLE_MAP_API_VERSION}&loading=async&callback=${callbackName}`;

    const handleError = () => {
      window.__googleMapsApiPromise = undefined;
      window.__googleMapsApiOnLoad = undefined;
      reject(new Error("Failed to load Google Maps API script."));
    };

    window.__googleMapsApiOnLoad = () => {
      if (window.google?.maps) {
        resolve();
        return;
      }

      window.__googleMapsApiPromise = undefined;
      reject(
        new Error(
          "Google Maps API callback fired, but maps namespace is unavailable.",
        ),
      );
    };

    if (existingScript) {
      if (window.google?.maps) {
        resolve();
        return;
      }

      if (!existingScript.src.includes(`callback=${callbackName}`)) {
        existingScript.remove();
      } else {
        existingScript.addEventListener("error", handleError);
        return;
      }
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAP_SCRIPT_ID;
    script.src = scriptSrc;
    script.async = true;
    script.defer = true;
    script.addEventListener("error", handleError);

    document.head.appendChild(script);

    window.setTimeout(() => {
      if (!window.google?.maps) {
        handleError();
      }
    }, 15000);
  });

  return window.__googleMapsApiPromise;
}

async function createMapInstance(
  mapDiv: HTMLElement,
  options: Record<string, unknown>,
): Promise<GoogleMapInstance> {
  if (!window.google?.maps) {
    throw new Error("Google Maps API is unavailable.");
  }

  const maps = window.google.maps;

  if (maps.importLibrary) {
    const mapsLibrary = (await maps.importLibrary("maps")) as {
      Map?: new (
        mapDiv: HTMLElement,
        opts: Record<string, unknown>,
      ) => GoogleMapInstance;
    };

    if (mapsLibrary?.Map) {
      return new mapsLibrary.Map(mapDiv, options);
    }
  }

  if (typeof maps.Map !== "function") {
    throw new Error("Google Maps Map constructor is unavailable.");
  }

  return new maps.Map(mapDiv, options);
}

function buildMarkerIcon(markerIcon: MarkerIconOption): GoogleMarkerIcon {
  const resolvedUrl = resolveIconUrl(markerIcon.url);
  const icon: GoogleMarkerIcon = {
    url: resolvedUrl,
  };

  if (window.google?.maps?.Size) {
    icon.scaledSize = new window.google.maps.Size(
      FIXED_MARKER_WIDTH,
      FIXED_MARKER_HEIGHT,
    );
  }

  if (window.google?.maps?.Point) {
    icon.anchor = new window.google.maps.Point(
      FIXED_MARKER_ANCHOR_X,
      FIXED_MARKER_ANCHOR_Y,
    );
  }

  return icon;
}

function resolveIconUrl(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (typeof record.src === "string") {
      return record.src;
    }

    if ("default" in record) {
      return resolveIconUrl(record.default);
    }
  }

  // Fallback keeps marker rendering even if SVG import shape changes by bundler.
  return "/icons/new_marker.svg";
}

export default function GoogleMap({
  center,
  zoom = 14,
  markerPosition,
  markerTitle,
  markerIcon = { url: newMarkerIconUrl },
  markers,
  overlayMarkers,
  fitPositions,
  className,
  apiKey,
  mapOptions,
  showZoomControls = false,
}: GoogleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<GoogleMapInstance | null>(null);
  const markerRef = useRef<GoogleMarkerInstance | null>(null);
  const markersRef = useRef<GoogleMarkerInstance[]>([]);
  const overlaysRef = useRef<GoogleOverlayInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);

  const resolvedApiKey = useMemo(
    () => apiKey ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    [apiKey],
  );
  const isMissingApiKey = !resolvedApiKey;

  useEffect(() => {
    let isMounted = true;

    if (isMissingApiKey) {
      return;
    }

    loadGoogleMapsApi(resolvedApiKey)
      .then(async () => {
        if (!isMounted || !mapContainerRef.current) {
          return;
        }

        mapRef.current = await createMapInstance(mapContainerRef.current, {
          center,
          zoom,
          disableDefaultUI: true,
          zoomControl: false,
          ...mapOptions,
        });

        setIsMapReady(true);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Google Maps 로딩 중 오류가 발생했습니다.",
        );
        setIsLoading(false);
      });

    return () => {
      isMounted = false;

      markerRef.current?.setMap(null);
      markerRef.current = null;
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      overlaysRef.current.forEach((o) => o.setMap(null));
      overlaysRef.current = [];
      mapRef.current = null;
      setIsMapReady(false);
    };
  }, [mapOptions, resolvedApiKey, isMissingApiKey]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current || !window.google?.maps) return;

    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];

    if (!overlayMarkers || overlayMarkers.length === 0) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const maps = window.google.maps as any;

    class PinOverlay extends maps.OverlayView {
      private pos: LatLngLiteral;
      private el: HTMLElement;
      private container: HTMLDivElement;

      constructor(pos: LatLngLiteral, el: HTMLElement) {
        super();
        this.pos = pos;
        this.el = el;
        this.container = document.createElement("div");
        this.container.style.cssText =
          "position:absolute;transform:translate(-50%,-100%)";
      }

      onAdd() {
        this.container.appendChild(this.el);
        this.getPanes()?.overlayMouseTarget?.appendChild(this.container);
      }

      draw() {
        const point = this.getProjection().fromLatLngToDivPixel(
          new maps.LatLng(this.pos.lat, this.pos.lng),
        );
        if (point) {
          this.container.style.left = `${point.x}px`;
          this.container.style.top = `${point.y}px`;
        }
      }

      onRemove() {
        this.container.parentNode?.removeChild(this.container);
      }
    }

    overlaysRef.current = overlayMarkers.map(({ position, element }) => {
      const overlay = new PinOverlay(position, element) as unknown as GoogleOverlayInstance;
      overlay.setMap(mapRef.current!);
      return overlay;
    });

    return () => {
      overlaysRef.current.forEach((o) => o.setMap(null));
      overlaysRef.current = [];
    };
  }, [isMapReady, overlayMarkers]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current || !window.google?.maps) return;
    if (!markers || markers.length === 0) return;

    const icon = buildMarkerIcon({ url: newMarkerIconUrl });

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = markers.map(
      ({ position, title }) =>
        new window.google!.maps.Marker({
          map: mapRef.current!,
          position,
          title,
          icon,
        }),
    );
  }, [isMapReady, markers]);

  useEffect(() => {
    setCurrentZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current || !window.google?.maps) return;
    if (!fitPositions || fitPositions.length === 0) return;

    const maps = window.google.maps as typeof window.google.maps & {
      LatLngBounds: new () => { extend: (point: unknown) => void };
      LatLng: new (lat: number, lng: number) => unknown;
    };

    const bounds = new maps.LatLngBounds();
    fitPositions.forEach(({ lat, lng }) =>
      bounds.extend(new maps.LatLng(lat, lng)),
    );
    mapRef.current.fitBounds(bounds, 40);
  }, [isMapReady, fitPositions]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setCenter(center);
  }, [center]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setZoom(currentZoom);
  }, [currentZoom]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current || !window.google?.maps) {
      return;
    }

    const icon = markerIcon ? buildMarkerIcon(markerIcon) : null;

    if (!markerPosition) {
      markerRef.current?.setMap(null);
      markerRef.current = null;
      return;
    }

    if (!markerRef.current) {
      markerRef.current = new window.google.maps.Marker({
        map: mapRef.current,
        position: markerPosition,
        title: markerTitle,
        icon: icon ?? undefined,
      });
      return;
    }

    markerRef.current.setPosition(markerPosition);
    markerRef.current.setTitle(markerTitle || "");
    markerRef.current.setIcon(icon);
  }, [isMapReady, markerPosition, markerTitle, markerIcon]);

  const applyZoom = (next: number) => {
    const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
    setCurrentZoom(clamped);
  };

  const handleZoomIn = () => {
    const base = mapRef.current?.getZoom?.() ?? currentZoom;
    applyZoom(base + 1);
  };

  const handleZoomOut = () => {
    const base = mapRef.current?.getZoom?.() ?? currentZoom;
    applyZoom(base - 1);
  };

  return (
    <div
      className={cn(
        "relative w-full aspect-335/228 overflow-hidden rounded-xl border border-[#E2E2E2]",
        className,
      )}
    >
      <div ref={mapContainerRef} className="h-full w-full" />

      {showZoomControls && !isMissingApiKey && !errorMessage && !isLoading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 items-center">
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={!isMapReady}
            className={cn(
              "h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            aria-label="Zoom in"
          >
            <span className="text-2xl leading-none text-muted-foreground">
              +
            </span>
          </button>

          <button
            type="button"
            onClick={handleZoomOut}
            disabled={!isMapReady}
            className={cn(
              "h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            aria-label="Zoom out"
          >
            <span className="text-2xl leading-none text-muted-foreground">
              -
            </span>
          </button>
        </div>
      )}

      {isLoading && !errorMessage && !isMissingApiKey && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 typography-body-sm-md text-neutral-600">
          지도를 불러오는 중...
        </div>
      )}

      {errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 p-4 text-center typography-body-sm-md text-red-600">
          {errorMessage}
        </div>
      )}

      {isMissingApiKey && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 p-4 text-center typography-body-sm-md text-red-600">
          Google Maps API 키가 없습니다. NEXT_PUBLIC_GOOGLE_MAPS_API_KEY를
          설정해주세요.
        </div>
      )}
    </div>
  );
}
