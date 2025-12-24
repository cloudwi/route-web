"use client";

import { useRouter } from "next/navigation";
import { Heart, MessageSquare, Star, MapPin } from "lucide-react";
import { PURPOSE_TAGS, type PurposeTag } from "@/types";

interface ReviewCardProps {
  id: string;
  user: string;
  userId: string;
  friends: number;
  place: string;
  rating: number;
  comment: string;
  tag: PurposeTag;
  likes: number;
  comments: number;
  time: string;
  isFriend: boolean;
  isLiked?: boolean;
  isFeatured?: boolean;
  image?: string;
  onLike?: (id: string) => void;
  onFollow?: (userId: string) => void;
  onPlaceClick?: (placeId: string) => void;
}

export default function ReviewCard({
  id,
  user,
  userId,
  friends,
  place,
  rating,
  comment,
  tag,
  likes,
  comments,
  time,
  isFriend,
  isLiked = false,
  isFeatured = false,
  image,
  onLike,
  onFollow,
  onPlaceClick,
}: ReviewCardProps) {
  const router = useRouter();
  const purposeTag = PURPOSE_TAGS[tag];

  const handlePlaceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // For demo, use a fixed ID. In real app, would use actual place ID
    router.push("/place/1");
  };

  return (
    <div
      className={`backdrop-blur-xl ${
        isFeatured
          ? ""
          : "bg-white/5"
      } border rounded-3xl overflow-hidden transition-all group cursor-pointer shadow-xl`}
      style={isFeatured ? {
        background: 'linear-gradient(135deg, rgba(230, 138, 46, 0.15) 0%, rgba(200, 30, 50, 0.15) 100%)',
        borderColor: 'rgba(230, 138, 46, 0.3)'
      } : {
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }}
      onMouseEnter={(e) => {
        if (!isFeatured) {
          e.currentTarget.style.borderColor = 'rgba(230, 138, 46, 0.4)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isFeatured) {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
      }}
    >
      {/* Image Section */}
      {image && (
        <div className={`relative ${isFeatured ? "h-[36rem]" : "h-96"} w-full overflow-hidden`}>
          <img
            src={image}
            alt={place}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Top Info Overlay */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2 border-white/20"
                style={{ background: 'var(--gradient-primary)' }}
              >
                {user[0]}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm drop-shadow-lg">{user}</h3>
              </div>
            </div>
            {!isFriend && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFollow?.(userId);
                }}
                className="text-xs px-3 py-1.5 backdrop-blur-sm text-white font-medium rounded-full transition-all"
                style={{
                  background: 'var(--gradient-primary)',
                  boxShadow: '0 2px 8px 0 rgba(230, 138, 46, 0.3)'
                }}
              >
                친구 추가
              </button>
            )}
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button
              onClick={handlePlaceClick}
              className="flex items-center gap-2 mb-2 text-white transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'white';
              }}
            >
              <MapPin className="w-5 h-5 drop-shadow-lg" />
              <span className="font-bold text-lg drop-shadow-lg">{place}</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full ${purposeTag.color} bg-opacity-90 backdrop-blur-sm`}
              >
                {purposeTag.emoji} {purposeTag.label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        {/* Comment */}
        <p className={`text-gray-300 mb-4 ${isFeatured ? "text-base" : "text-sm"} line-clamp-2`}>
          {comment}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike?.(id);
              }}
              className="flex items-center gap-2 text-gray-400 transition-colors"
              onMouseEnter={(e) => {
                if (!isLiked) {
                  e.currentTarget.style.color = 'var(--accent)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLiked) {
                  e.currentTarget.style.color = 'rgb(156, 163, 175)';
                }
              }}
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "fill-[var(--accent)]" : ""
                }`}
                style={isLiked ? { color: 'var(--accent)' } : {}}
              />
              <span className="text-sm font-medium">{likes.toLocaleString()}</span>
            </button>
            <button
              className="flex items-center gap-2 text-gray-400 transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgb(156, 163, 175)';
              }}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm font-medium">{comments}</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
      </div>
    </div>
  );
}
