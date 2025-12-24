"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Image as ImageIcon, X, Check, Search, Plus } from "lucide-react";
import { PURPOSE_TAGS, type PurposeTag } from "@/types";
import { getToken } from "@/lib/api";

interface Place {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  category_name: string;
}

interface ImageItem {
  id: string;
  url: string; // 이미지 URL (업로드 API 응답 또는 OG 이미지 URL)
  type: 'place' | 'uploaded';
  name?: string;
  file?: File; // 업로드 전 파일 객체 (임시)
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
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingPlaceThumbnail, setIsFetchingPlaceThumbnail] = useState(false);
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
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const token = getToken();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${apiBaseUrl}/api/v1/external/search?query=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!response.ok) {
        throw new Error('장소 검색 API 호출 실패');
      }

      const data = await response.json();

      // API 응답 데이터를 Place 인터페이스에 맞게 매핑
      const places: Place[] = (data.places || []).map((item: any, index: number) => ({
        id: item.naver_map_url || `place-${index}`,
        place_name: item.title || '',
        address_name: item.address || '',
        road_address_name: item.road_address || '',
        phone: item.telephone || '',
        category_name: item.category || '',
      }));

      setSearchResults(places);
      setShowResults(true);
    } catch (error) {
      console.error("장소 검색 실패:", error);
      setSearchResults([]);
      // 에러 발생 시에도 결과 표시 (사용자 경험 개선)
      setShowResults(true);
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

  // 네이버 지도 OG 이미지 가져오기
  const fetchPlaceThumbnail = async (place: Place): Promise<string | null> => {
    setIsFetchingPlaceThumbnail(true);
    try {
      // 네이버 지도 URL이 place.id에 저장되어 있음 (API 응답의 naver_map_url)
      const naverMapUrl = place.id;

      // Next.js API Route를 통해 네이버 지도 OG 이미지 추출
      const response = await fetch('/api/og-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: naverMapUrl
        })
      });

      if (!response.ok) {
        throw new Error('OG 이미지 추출 실패');
      }

      const data = await response.json();
      return data.imageUrl; // 네이버 지도 OG 이미지 URL
    } catch (error) {
      console.error('네이버 지도 OG 이미지 가져오기 실패:', error);
      // 실패 시 기본 이미지 또는 null 반환
      return null;
    } finally {
      setIsFetchingPlaceThumbnail(false);
    }
  };

  // 장소 선택 핸들러
  const handleSelectPlace = async (place: Place) => {
    setSelectedPlace(place);
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);

    // 장소 썸네일 가져오기
    const thumbnail = await fetchPlaceThumbnail(place);
    if (thumbnail) {
      const placeThumbnail: ImageItem = {
        id: `place-${place.id}`,
        url: thumbnail,
        type: 'place',
        name: place.place_name
      };
      // 기존 장소 썸네일 제거하고 새로운 썸네일 추가
      setImages(prev => [...prev.filter(img => img.type !== 'place'), placeThumbnail]);
    }
  };

  // 이미지 업로드 API 호출
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // TODO: 실제 이미지 업로드 API 호출
      // const formData = new FormData();
      // formData.append('image', file);
      //
      // const response = await fetch('/api/upload/image', {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      // return data.url; // 업로드된 이미지 URL 반환

      // Mock: 임시로 FileReader 사용 (개발 중)
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // 각 파일을 업로드하고 URL을 받아서 저장
      for (const file of Array.from(files)) {
        const uploadedUrl = await uploadImage(file);
        if (uploadedUrl) {
          const newImage: ImageItem = {
            id: `uploaded-${Date.now()}-${Math.random()}`,
            url: uploadedUrl, // 업로드 API에서 받은 URL
            type: 'uploaded',
            name: file.name
          };
          setImages(prev => [...prev, newImage]);
        }
      }
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = async () => {
    if (!content) {
      alert("내용을 입력해주세요");
      return;
    }

    setIsSubmitting(true);
    try {
      // 이미지 URL 목록 추출
      const imageUrls = images.map(img => img.url);

      // TODO: 실제 일기 작성 API 호출
      // const response = await fetch('/api/diary/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     content: content,
      //     placeId: selectedPlace?.id,
      //     placeName: selectedPlace?.place_name,
      //     placeAddress: selectedPlace?.address_name,
      //     tag: selectedTag,
      //     images: imageUrls, // 업로드된 이미지 URL 목록 또는 네이버 지도 OG 이미지 URL
      //   })
      // });
      //
      // if (!response.ok) {
      //   throw new Error('일기 작성 실패');
      // }
      //
      // const data = await response.json();
      // console.log('일기 작성 성공:', data);

      // Mock: 임시 알림 (개발 중)
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('일기 작성 데이터:', {
        content,
        place: selectedPlace,
        tag: selectedTag,
        images: imageUrls,
      });

      alert("일기가 작성되었습니다!");
      router.push("/");
    } catch (error) {
      console.error('일기 작성 실패:', error);
      alert("일기 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemovePlace = () => {
    setSelectedPlace(null);
    setSearchQuery("");
    // 장소 썸네일도 제거
    setImages(prev => prev.filter(img => img.type !== 'place'));
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-b"
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
            disabled={isSubmitting || !content}
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
          <div className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-visible ${showResults ? 'z-[9998]' : ''}`}>
            <label className="flex items-center gap-2 text-white font-semibold mb-3">
              <MapPin className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <span>어디에 다녀오셨나요? (선택)</span>
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
              <div className="relative z-[9999]" ref={searchRef}>
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
                  <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-black/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-[9999] max-h-80 overflow-y-auto">
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
                  <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-black/95 border border-white/20 rounded-2xl shadow-2xl p-6 text-center z-[9999]">
                    <p className="text-gray-400">검색 결과가 없습니다</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Image Gallery */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-white font-semibold">
                <ImageIcon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <span>사진 ({images.length})</span>
              </label>
              {isFetchingPlaceThumbnail && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                  <span>장소 이미지 가져오는 중...</span>
                </div>
              )}
            </div>

            {/* Image Grid */}
            {images.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-3 mb-3">
                {images.map((image) => (
                  <div key={image.id} className="relative w-[calc(50%-0.375rem)] aspect-square rounded-xl overflow-hidden bg-black/20 group">
                    <img
                      src={image.url}
                      alt={image.name || 'Image'}
                      className="w-full h-full object-cover"
                    />
                    {/* Image Type Badge */}
                    {image.type === 'place' && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-[var(--primary)]/90 backdrop-blur-sm rounded-lg text-xs text-white font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>장소</span>
                      </div>
                    )}
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveImage(image.id)}
                      className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Upload Button */}
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className={`${images.length > 0 ? 'py-4' : 'aspect-[16/10]'} border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[var(--primary)]/50 hover:bg-white/5 transition-all`}>
                <Plus className="w-8 h-8 text-gray-400" />
                <p className="text-gray-400 text-sm">
                  {images.length > 0 ? '사진 추가하기' : '클릭하여 사진을 추가하세요'}
                </p>
                {selectedPlace && images.filter(img => img.type === 'place').length === 0 && (
                  <p className="text-xs text-gray-500">장소 선택 시 자동으로 이미지가 추가됩니다</p>
                )}
              </div>
            </label>
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