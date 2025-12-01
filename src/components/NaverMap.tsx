"use client";

import { useEffect, useRef } from "react";
import { useNaverMap } from "@/hooks/useNaverMap";
import { Place, RouteSection } from "@/types";

interface NaverMapProps {
  places: Place[];
  onPlaceClick?: (place: Place) => void;
  selectedPlaceId?: string;
  routeSections?: RouteSection[];
}

// 교통수단별 색상
const TRAFFIC_COLORS: Record<number, string> = {
  1: "#0052A4", // 지하철 - 파란색
  2: "#5BB025", // 버스 - 초록색
  3: "#888888", // 도보 - 회색
};

export default function NaverMap({
  places,
  onPlaceClick,
  selectedPlaceId,
  routeSections,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const polylinesRef = useRef<naver.maps.Polyline[]>([]);
  const onPlaceClickRef = useRef(onPlaceClick);
  const { isLoaded, naver } = useNaverMap();

  useEffect(() => {
    onPlaceClickRef.current = onPlaceClick;
  }, [onPlaceClick]);

  // 지도 초기화 (한 번만 실행)
  useEffect(() => {
    if (!isLoaded || !naver || !mapRef.current || mapInstanceRef.current) return;

    const defaultCenter = new naver.maps.LatLng(37.5665, 126.978);

    mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 15,
      logoControl: false,
      scaleControl: false,
      mapDataControl: false,
    });
  }, [isLoaded, naver]);

  // 마커 및 경로 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current || !naver) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 기존 폴리라인 제거
    polylinesRef.current.forEach((polyline) => polyline.setMap(null));
    polylinesRef.current = [];

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

    // 경로 폴리라인 그리기
    if (places.length >= 2) {
      // routeSections가 있고 sub_paths 정보가 있으면 실제 경로 그리기
      const hasDetailedRoute = routeSections?.some(
        (section) => section.transit?.sub_paths && section.transit.sub_paths.length > 0
      );

      if (hasDetailedRoute && routeSections) {
        // 대중교통 상세 경로 그리기
        routeSections.forEach((section) => {
          if (section.transit?.sub_paths) {
            section.transit.sub_paths.forEach((subPath) => {
              // 좌표가 있는 구간만 그리기
              if (subPath.start_x && subPath.start_y && subPath.end_x && subPath.end_y) {
                const path = [
                  new naver.maps.LatLng(subPath.start_y, subPath.start_x),
                  new naver.maps.LatLng(subPath.end_y, subPath.end_x),
                ];

                const color = TRAFFIC_COLORS[subPath.traffic_type] || "#3b82f6";
                const isDotted = subPath.traffic_type === 3; // 도보는 점선

                const polyline = new naver.maps.Polyline({
                  map: mapInstanceRef.current,
                  path: path,
                  strokeColor: color,
                  strokeWeight: subPath.traffic_type === 3 ? 3 : 5,
                  strokeOpacity: 0.8,
                  strokeStyle: isDotted ? "shortdash" : "solid",
                  strokeLineCap: "round",
                  strokeLineJoin: "round",
                });

                polylinesRef.current.push(polyline);
              }
            });
          }
        });

        // 각 장소 간 연결 (sub_paths가 없는 구간용)
        for (let i = 0; i < places.length - 1; i++) {
          const section = routeSections[i];
          const hasPaths = section?.transit?.sub_paths && section.transit.sub_paths.length > 0;

          if (!hasPaths) {
            // sub_paths가 없으면 직선으로 연결
            const path = [
              new naver.maps.LatLng(places[i].lat, places[i].lng),
              new naver.maps.LatLng(places[i + 1].lat, places[i + 1].lng),
            ];

            const polyline = new naver.maps.Polyline({
              map: mapInstanceRef.current,
              path: path,
              strokeColor: "#3b82f6",
              strokeWeight: 4,
              strokeOpacity: 0.7,
              strokeStyle: "shortdash",
              strokeLineCap: "round",
              strokeLineJoin: "round",
            });

            polylinesRef.current.push(polyline);
          }
        }
      } else {
        // 상세 경로 정보가 없으면 직선으로 연결
        const path = places.map(
          (place) => new naver.maps.LatLng(place.lat, place.lng)
        );

        const polyline = new naver.maps.Polyline({
          map: mapInstanceRef.current,
          path: path,
          strokeColor: "#3b82f6",
          strokeWeight: 4,
          strokeOpacity: 0.7,
          strokeStyle: "shortdash",
          strokeLineCap: "round",
          strokeLineJoin: "round",
        });

        polylinesRef.current.push(polyline);
      }
    }

    // 장소가 있으면 지도 범위 조정
    if (places.length > 0) {
      const bounds = new naver.maps.LatLngBounds(
        new naver.maps.LatLng(places[0].lat, places[0].lng),
        new naver.maps.LatLng(places[0].lat, places[0].lng)
      );

      places.forEach((place) => {
        bounds.extend(new naver.maps.LatLng(place.lat, place.lng));
      });

      // 경로의 중간 좌표도 bounds에 포함
      if (routeSections) {
        routeSections.forEach((section) => {
          section.transit?.sub_paths?.forEach((subPath) => {
            if (subPath.start_x && subPath.start_y) {
              bounds.extend(new naver.maps.LatLng(subPath.start_y, subPath.start_x));
            }
            if (subPath.end_x && subPath.end_y) {
              bounds.extend(new naver.maps.LatLng(subPath.end_y, subPath.end_x));
            }
          });
        });
      }

      mapInstanceRef.current.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 100,
        left: 50,
      });
    }
  }, [places, naver, selectedPlaceId, routeSections]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">지도를 로딩중입니다...</p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" />;
}
