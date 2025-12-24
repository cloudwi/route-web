"use client";

import { useState } from "react";
import { X, Star, Lock, Users, Globe } from "lucide-react";
import { PURPOSE_TAGS, type PurposeTag, type ReviewVisibility } from "@/types";

interface ReviewWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeName: string;
  placeId: string;
}

export default function ReviewWriteModal({
  isOpen,
  onClose,
  placeName,
  placeId,
}: ReviewWriteModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<PurposeTag[]>([]);
  const [visibility, setVisibility] = useState<ReviewVisibility>("public");
  const [visitedWith, setVisitedWith] = useState<"partner" | "alone" | "friends" | "family" | undefined>();

  if (!isOpen) return null;

  const handleTagToggle = (tag: PurposeTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("별점을 선택해주세요!");
      return;
    }
    if (content.trim().length < 10) {
      alert("리뷰 내용을 10자 이상 작성해주세요!");
      return;
    }
    if (selectedTags.length === 0) {
      alert("방문 목적 태그를 최소 1개 선택해주세요!");
      return;
    }

    // TODO: API call to submit review
    console.log({
      placeId,
      rating,
      content,
      purposeTags: selectedTags,
      visibility,
      visitedWith,
    });

    alert("리뷰가 작성되었습니다!");
    onClose();
  };

  const visibilityOptions = [
    {
      value: "public" as ReviewVisibility,
      icon: Globe,
      label: "전체 공개",
      description: "모든 사람이 볼 수 있습니다",
    },
    {
      value: "followers" as ReviewVisibility,
      icon: Users,
      label: "팔로워 공개",
      description: "팔로워만 볼 수 있습니다",
    },
    {
      value: "private" as ReviewVisibility,
      icon: Lock,
      label: "비공개",
      description: "나만 볼 수 있습니다",
    },
  ];

  const visitedWithOptions = [
    { value: "partner" as const, label: "연인과" },
    { value: "alone" as const, label: "혼자" },
    { value: "friends" as const, label: "친구와" },
    { value: "family" as const, label: "가족과" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-white/20 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">리뷰 작성</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Place Name */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-sm text-gray-400 mb-1">리뷰를 작성할 장소</p>
            <h3 className="text-lg font-bold text-white">{placeName}</h3>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              별점 <span className="text-rose-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const starValue = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        starValue <= (hoveredRating || rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <span className="ml-2 text-2xl font-bold text-white">{rating}.0</span>
              )}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              리뷰 내용 <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="이 장소에 대한 솔직한 리뷰를 작성해주세요 (최소 10자)"
              className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none resize-none"
              maxLength={500}
            />
            <p className="text-sm text-gray-400 mt-2 text-right">
              {content.length} / 500
            </p>
          </div>

          {/* Purpose Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              방문 목적 <span className="text-rose-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PURPOSE_TAGS) as PurposeTag[]).map((tag) => {
                const purposeTag = PURPOSE_TAGS[tag];
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? `${purposeTag.color} ring-2 ring-offset-2 ring-offset-slate-900`
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {purposeTag.emoji} {purposeTag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visited With */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              누구와 방문했나요?
            </label>
            <div className="flex flex-wrap gap-2">
              {visitedWithOptions.map((option) => {
                const isSelected = visitedWith === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setVisitedWith(isSelected ? undefined : option.value)
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-violet-500 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              공개 범위 <span className="text-rose-400">*</span>
            </label>
            <div className="space-y-2">
              {visibilityOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = visibility === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setVisibility(option.value)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${
                      isSelected
                        ? "bg-violet-500/20 border-2 border-violet-500"
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isSelected ? "bg-violet-500" : "bg-white/10"
                      }`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white">{option.label}</p>
                      <p className="text-sm text-gray-400">{option.description}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-violet-500/50 transition-all"
          >
            작성 완료
          </button>
        </div>
      </div>
    </div>
  );
}
