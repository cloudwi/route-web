"use client";

import { useEffect, useRef, useMemo } from "react";
import { useNaverMap } from "@/hooks/useNaverMap";
import { Place } from "@/types";

interface NaverMapProps {
  places: Place[];
  onPlaceClick?: (place: Place) => void;
  selectedPlaceId?: string;
  onRouteCalculated?: (route: RouteInfo | null) => void;
}

export interface RouteSection {
  distance: number; // 미터
  duration: number; // 밀리초
}

export interface RouteInfo {
  distance: number; // 미터
  duration: number; // 밀리초
  path: { lat: number; lng: number }[];
  sections?: RouteSection[]; // 구간별 정보
}

// places 배열을 캐시 키로 변환
const getPlacesCacheKey = (places: Place[]): string => {
  return places.map((p) => `${p.id}-${p.lat}-${p.lng}`).join("|");
};

export default function NaverMap({
  places,
  onPlaceClick,
  selectedPlaceId,
  onRouteCalculated,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const polylineRef = useRef<naver.maps.Polyline | null>(null);
  const routeCacheRef = useRef<{ key: string; path: { lat: number; lng: number }[] | null }>({ key: "", path: null });
  const onRouteCalculatedRef = useRef(onRouteCalculated);
  const onPlaceClickRef = useRef(onPlaceClick);
  const { isLoaded, naver } = useNaverMap();

  // ref 업데이트 (useEffect 내에서 수행)
  useEffect(() => {
    onRouteCalculatedRef.current = onRouteCalculated;
  }, [onRouteCalculated]);

  useEffect(() => {
    onPlaceClickRef.current = onPlaceClick;
  }, [onPlaceClick]);

  // places 캐시 키 메모이제이션
  const placesCacheKey = useMemo(() => getPlacesCacheKey(places), [places]);

  useEffect(() => {
    if (!isLoaded || !naver || !mapRef.current) return;

    const center =
      places.length > 0
        ? new naver.maps.LatLng(places[0].lat, places[0].lng)
        : new naver.maps.LatLng(37.5665, 126.978);

    mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
      center,
      zoom: 15,
      logoControl: false,
      scaleControl: false,
      mapDataControl: false,
    });
  }, [isLoaded, naver, places]);

  // 마커 업데이트 (selectedPlaceId 변경 시에도 실행, 하지만 API 호출 안함)
  useEffect(() => {
    if (!mapInstanceRef.current || !naver) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 마커 생성
    places.forEach((place, index) => {
      const isSelected = selectedPlaceId === place.id;

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(place.lat, place.lng),
        map: mapInstanceRef.current,
        title: place.name,
        icon: {
          content: `
            <div style="
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
            ">
              <div style="
                background: ${isSelected ? "#3b82f6" : "#ffffff"};
                color: ${isSelected ? "#ffffff" : "#3b82f6"};
                border: 3px solid #3b82f6;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 16px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              ">${index + 1}</div>
              <div style="
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 10px solid #3b82f6;
                margin-top: -2px;
              "></div>
            </div>
          `,
          anchor: new naver.maps.Point(18, 46),
        },
      });

      naver.maps.Event.addListener(marker, "click", () => {
        onPlaceClickRef.current?.(place);
      });

      markersRef.current.push(marker);
    });
  }, [places, naver, selectedPlaceId]);

  // 경로 API 호출 (places가 변경될 때만, 캐시 활용)
  useEffect(() => {
    if (!mapInstanceRef.current || !naver) return;

    // 기존 폴리라인 제거
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (places.length < 2) {
      onRouteCalculatedRef.current?.(null);
      return;
    }

    // 캐시 확인 - 같은 places면 API 호출 안함
    if (routeCacheRef.current.key === placesCacheKey) {
      const cachedPath = routeCacheRef.current.path;
      if (cachedPath && cachedPath.length > 0) {
        const path = cachedPath.map(
          (coord) => new naver.maps.LatLng(coord.lat, coord.lng)
        );
        polylineRef.current = new naver.maps.Polyline({
          map: mapInstanceRef.current,
          path: path,
          strokeColor: "#3b82f6",
          strokeWeight: 5,
          strokeOpacity: 0.9,
          strokeStyle: "solid",
          strokeLineCap: "round",
          strokeLineJoin: "round",
        });
      }
      return;
    }

    // API 호출
    const fetchAndDrawRoute = async () => {
      try {
        const start = { lat: places[0].lat, lng: places[0].lng };
        const goal = { lat: places[places.length - 1].lat, lng: places[places.length - 1].lng };
        const waypoints = places.length > 2
          ? places.slice(1, -1).map((p) => ({ lat: p.lat, lng: p.lng }))
          : undefined;

        const response = await fetch("/api/directions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ start, goal, waypoints }),
        });

        if (!response.ok) {
          console.warn("Directions API failed, using straight lines");
          routeCacheRef.current = { key: placesCacheKey, path: null };
          drawFallbackRoute();
          return;
        }

        const data = await response.json();

        // 캐시 저장
        routeCacheRef.current = { key: placesCacheKey, path: data.path };

        onRouteCalculatedRef.current?.({
          distance: data.summary.distance,
          duration: data.summary.duration,
          path: data.path,
          sections: data.sections,
        });

        // 폴리라인 그리기
        if (data.path && data.path.length > 0) {
          const path = data.path.map(
            (coord: { lat: number; lng: number }) => new naver.maps.LatLng(coord.lat, coord.lng)
          );

          polylineRef.current = new naver.maps.Polyline({
            map: mapInstanceRef.current,
            path: path,
            strokeColor: "#3b82f6",
            strokeWeight: 5,
            strokeOpacity: 0.9,
            strokeStyle: "solid",
            strokeLineCap: "round",
            strokeLineJoin: "round",
          });
        }
      } catch (error) {
        console.warn("Failed to fetch directions:", error);
        routeCacheRef.current = { key: placesCacheKey, path: null };
        drawFallbackRoute();
      }
    };

    const drawFallbackRoute = () => {
      const path = places.map(
        (place) => new naver.maps.LatLng(place.lat, place.lng)
      );

      polylineRef.current = new naver.maps.Polyline({
        map: mapInstanceRef.current,
        path: path,
        strokeColor: "#3b82f6",
        strokeWeight: 4,
        strokeOpacity: 0.6,
        strokeStyle: "shortdash",
        strokeLineCap: "round",
        strokeLineJoin: "round",
      });
    };

    fetchAndDrawRoute();

    // 지도 범위 조정
    if (places.length > 0) {
      const bounds = new naver.maps.LatLngBounds(
        new naver.maps.LatLng(places[0].lat, places[0].lng),
        new naver.maps.LatLng(places[0].lat, places[0].lng)
      );

      places.forEach((place) => {
        bounds.extend(new naver.maps.LatLng(place.lat, place.lng));
      });

      mapInstanceRef.current.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 100,
        left: 50,
      });
    }
  }, [placesCacheKey, naver, places]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">지도를 로딩중입니다...</p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" />;
}
