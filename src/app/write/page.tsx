"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Image as ImageIcon, X, Check, Search } from "lucide-react";
import { PURPOSE_TAGS, type PurposeTag } from "@/types";

interface Place {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  category_name: string;
}

export default function WritePage() {
  const router = useRouter();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState<PurposeTag | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 검색 결과 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 장소 검색 API 호출
  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // TODO: 실제 Kakao Places API 호출
      // const response = await fetch(
      //   `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`,
      //   {
      //     headers: {
      //       Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
      //     },
      //   }
      // );
      // const data = await response.json();
      // setSearchResults(data.documents);

      // Mock 데이터
      await new Promise((resolve) => setTimeout(resolve, 300));
      const mockResults: Place[] = [
        {
          id: "1",
          place_name: `${query} 카페`,
          address_name: "서울 강남구 역삼동 123-45",
          road_address_name: "서울 강남구 테헤란로 123",
          phone: "02-1234-5678",
          category_name: "음식점 > 카페",
        },
        {
          id: "2",
          place_name: `${query} 레스토랑`,
          address_name: "서울 강남구 역삼동 678-90",
          road_address_name: "서울 강남구 강남대로 456",
          phone: "02-9876-5432",
          category_name: "음식점 > 한식",
        },
        {
          id: "3",
          place_name: `${query} 맛집`,
          address_name: "서울 서초구 서초동 111-22",
          road_address_name: "서울 서초구 서초대로 789",
          phone: "02-5555-6666",
          category_name: "음식점 > 일식",
        },
      ];
      setSearchResults(mockResults);
      setShowResults(true);
    } catch (error) {
      console.error("장소 검색 실패:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 검색어 입력 핸들러
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchPlaces(query);
  };

  // 장소 선택 핸들러
  const handleSelectPlace = (place: Place) => {
    setSelectedPlace(place);
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlace || !content) {
      alert("장소와 내용을 입력해주세요");
      return;
    }

    setIsSubmitting(true);
    // TODO: API 호출
    setTimeout(() => {
      alert("일기가 작성되었습니다!");
      router.push("/");
    }, 1000);
  };

  const handleRemovePlace = () => {
    setSelectedPlace(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b"
        style={{ borderColor: 'rgba(230, 138, 46, 0.2)' }}
      >
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">취소</span>
          </button>
          <h1 className="text-lg font-bold text-white">일기 작성</h1>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedPlace || !content}
            className="px-4 py-2 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--gradient-primary)' }}
          >
            {isSubmitting ? "작성 중..." : "완료"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 pt-24 pb-24">
        <div className="space-y-6">
          {/* Place Selection */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <label className="flex items-center gap-2 text-white font-semibold mb-3">
              <MapPin className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <span>어디에 다녀오셨나요?</span>
            </label>

            {selectedPlace ? (
              // 선택된 장소 표시
              <div className="p-4 bg-white/10 border border-[var(--primary)]/30 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{selectedPlace.place_name}</h3>
                    <p className="text-sm text-gray-400 mb-1">{selectedPlace.road_address_name || selectedPlace.address_name}</p>
                    <p className="text-xs text-gray-500">{selectedPlace.category_name}</p>
                  </div>
                  <button
                    onClick={handleRemovePlace}
                    className="p-2 hover:bg-white/20 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            ) : (
              // 검색 입력
              <div className="relative" ref={searchRef}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInput}
                    onFocus={() => searchQuery && setShowResults(true)}
                    placeholder="장소 이름을 입력하세요"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] transition-all"
                  />
                  {isSearching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* 검색 결과 드롭다운 */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                    {searchResults.map((place) => (
                      <button
                        key={place.id}
                        onClick={() => handleSelectPlace(place)}
                        className="w-full p-4 hover:bg-white/10 transition-all text-left border-b border-white/10 last:border-b-0"
                      >
                        <h3 className="text-white font-semibold mb-1">{place.place_name}</h3>
                        <p className="text-sm text-gray-400 mb-1">
                          {place.road_address_name || place.address_name}
                        </p>
                        <p className="text-xs text-gray-500">{place.category_name}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* 검색 결과 없음 */}
                {showResults && !isSearching && searchQuery && searchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl p-6 text-center z-50">
                    <p className="text-gray-400">검색 결과가 없습니다</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <label className="flex items-center gap-2 text-white font-semibold mb-3">
              <ImageIcon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <span>사진 추가 (선택)</span>
            </label>

            {imagePreview ? (
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black/20">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="aspect-[16/10] border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[var(--primary)]/50 hover:bg-white/5 transition-all">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                  <p className="text-gray-400 text-sm">클릭하여 사진을 추가하세요</p>
                </div>
              </label>
            )}
          </div>

          {/* Content */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <label className="text-white font-semibold mb-3 block">
              오늘의 이야기
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="특별한 순간을 기록해보세요..."
              className="w-full h-48 bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] transition-all resize-none"
              maxLength={500}
            />
            <div className="flex justify-end mt-2">
              <span className="text-xs text-gray-500">
                {content.length} / 500
              </span>
            </div>
          </div>

          {/* Tag Selection */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <label className="text-white font-semibold mb-4 block">
              태그 선택
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(PURPOSE_TAGS).map(([key, tag]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTag(key as PurposeTag)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedTag === key
                      ? 'border-[var(--primary)] bg-[var(--primary)]/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{tag.emoji}</span>
                      <span className="text-white font-medium text-sm">{tag.label}</span>
                    </div>
                    {selectedTag === key && (
                      <Check className="w-5 h-5 text-[var(--primary)]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-3xl p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🔒</div>
              <div>
                <h3 className="text-white font-semibold mb-1">Private</h3>
                <p className="text-gray-300 text-sm">
                  이 일기는 연결된 커플에게만 공개됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}