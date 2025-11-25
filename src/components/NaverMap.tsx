"use client";

import {useEffect, useRef} from "react";
import {useNaverMap} from "@/hooks/useNaverMap";
import {Place} from "@/types";

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
    const {isLoaded, naver} = useNaverMap();

    useEffect(() => {
        if (!isLoaded || !naver || !mapRef.current) return;

        const center = places.length > 0
            ? new naver.maps.LatLng(places[0].lat, places[0].lng)
            : new naver.maps.LatLng(37.5665, 126.978);

        mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
            center,
            zoom: 15,
        });
    }, [isLoaded, naver, places]);

    useEffect(() => {
        if (!mapInstanceRef.current || !naver) return;

        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        places.forEach((place, index) => {
            const marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(place.lat, place.lng),
                map: mapInstanceRef.current,
                title: place.name,
                icon: {
                    content: `<div style="
            background: ${selectedPlaceId === place.id ? '#3b82f6' : '#fff'};
            color: ${selectedPlaceId === place.id ? '#fff' : '#000'};
            border: 2px solid #3b82f6;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
          ">${index + 1}</div>`,
                    anchor: new naver.maps.Point(16, 16),
                },
            });

            naver.maps.Event.addListener(marker, "click", () => {
                onPlaceClick?.(place);
            });

            markersRef.current.push(marker);
        });

        if (places.length > 0) {
            const bounds = new naver.maps.LatLngBounds(
                new naver.maps.LatLng(places[0].lat, places[0].lng),
                new naver.maps.LatLng(places[0].lat, places[0].lng)
            );

            places.forEach((place) => {
                bounds.extend(new naver.maps.LatLng(place.lat, place.lng));
            });

            mapInstanceRef.current.fitBounds(bounds);
        }
    }, [places, naver, selectedPlaceId, onPlaceClick]);

    if (!isLoaded) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">지도를 로딩중입니다...</p>
            </div>
        );
    }

    return <div ref={mapRef} className="w-full h-full"/>;
}
