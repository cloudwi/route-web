"use client";

import { useEffect, useState, useCallback } from "react";
import { X, MapPin, Phone, ExternalLink } from "lucide-react";
import NaverMap from "../map/NaverMap";
import { Place, PopularPlace } from "@/types";

interface PlaceMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: Place | PopularPlace | null;
}

export default function PlaceMapModal({ isOpen, onClose, place }: PlaceMapModalProps) {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const handleAnimationEnd = useCallback(() => {
    if (isAnimatingOut) {
      setShouldRender(false);
      setIsAnimatingOut(false);
    }
  }, [isAnimatingOut]);

  const handleClose = useCallback(() => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      onClose();
    }, 200);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimatingOut(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);

  if (!shouldRender || !place) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isAnimatingOut ? "opacity-0" : "opacity-100"
      }`}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden transition-transform duration-200 ${
          isAnimatingOut ? "scale-95" : "scale-100"
        }`}
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-xl font-bold text-gray-900 mb-1 truncate">
              {place.name}
            </h2>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
              <span>{place.address}</span>
            </div>
            {place.telephone && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <a
                  href={`tel:${place.telephone}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {place.telephone}
                </a>
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Map */}
        <div className="relative" style={{ height: "500px" }}>
          <NaverMap
            places={[place]}
            selectedPlaceId={place.id}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-2 justify-end">
            <a
              href={place.naverMapUrl || `https://map.naver.com/p/search/${encodeURIComponent(place.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#03C75A] text-white text-sm font-medium rounded-lg hover:bg-[#02B350] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              네이버 지도로 보기
            </a>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
