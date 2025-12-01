"use client";

import { useState, useEffect, useRef } from "react";
import { Place } from "@/types";

interface PlaceSearchProps {
  onPlaceSelect: (place: Place) => void;
  onSearchResults?: (places: Place[]) => void;
  initialSearch?: string;
}

interface BackendPlaceResponse {
  title: string;
  address: string;
  road_address: string;
  category: string;
  telephone: string;
  latitude: number;
  longitude: number;
  naver_map_url: string;
}

export default function PlaceSearch({ onPlaceSelect, onSearchResults, initialSearch = "" }: PlaceSearchProps) {
  const [query, setQuery] = useState(initialSearch);
  const [results, setResults] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const hasInitialSearched = useRef(false);

  // 초기 검색어가 있으면 자동 검색
  useEffect(() => {
    if (initialSearch && !hasInitialSearched.current) {
      hasInitialSearched.current = true;
      performSearch(initialSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearch]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    // 백엔드 서버 검색 API 호출
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    try {
      const response = await fetch(`${baseUrl}/api/v1/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      // 백엔드 응답을 Place 형식으로 변환
      const places: Place[] = (data.places || []).map((item: BackendPlaceResponse) => ({
        id: `${item.title}-${item.latitude}-${item.longitude}`.replace(/\s/g, '-'),
        name: item.title,
        address: item.road_address || item.address,
        lat: item.latitude,
        lng: item.longitude,
        category: item.category,
        telephone: item.telephone,
        naverMapUrl: item.naver_map_url,
      }));

      setResults(places);

      // 검색 결과를 부모 컴포넌트에 전달 (지도에 표시)
      onSearchResults?.(places);
    } catch (error) {
      console.error("Search error:", error);
      alert("검색 중 오류가 발생했습니다. 백엔드 서버가 실행 중인지 확인해주세요.");
      setResults([]);
      onSearchResults?.([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    performSearch(query);
  };

  const handleSelectPlace = (place: Place) => {
    onPlaceSelect(place);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="장소를 검색하세요"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
        >
          {isSearching ? "검색중..." : "검색"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {results.map((place, index) => (
            <button
              key={place.id || `place-${index}`}
              onClick={() => handleSelectPlace(place)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
            >
              <h4 className="font-medium text-gray-900">{place.name}</h4>
              <p className="text-sm text-gray-500">{place.address}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
