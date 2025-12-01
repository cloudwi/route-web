"use client";

import { useEffect, useRef } from "react";
import { useNaverMap } from "@/hooks/useNaverMap";
import { Place } from "@/types";

interface NaverMapProps {
  places: Place[];
  onPlaceClick?: (place: Place) => void;
  selectedPlaceId?: string;
}

export default function NaverMap({
  places,
  onPlaceClick,
  selectedPlaceId,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const polylineRef = useRef<naver.maps.Polyline | null>(null);
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
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

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

    // 경로 폴리라인 그리기 (2개 이상 장소가 있을 때)
    if (places.length >= 2) {
      const path = places.map(
        (place) => new naver.maps.LatLng(place.lat, place.lng)
      );

      polylineRef.current = new naver.maps.Polyline({
        map: mapInstanceRef.current,
        path: path,
        strokeColor: "#3b82f6",
        strokeWeight: 4,
        strokeOpacity: 0.7,
        strokeStyle: "shortdash",
        strokeLineCap: "round",
        strokeLineJoin: "round",
      });
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

      mapInstanceRef.current.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 100,
        left: 50,
      });
    }
  }, [places, naver, selectedPlaceId]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">지도를 로딩중입니다...</p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" />;
}
