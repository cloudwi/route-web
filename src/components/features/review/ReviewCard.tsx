"use client";

import { useRouter } from "next/navigation";
import { Heart, MessageSquare, Star, MapPin } from "lucide-react";
import { PURPOSE_TAGS, type PurposeTag } from "@/types";

interface ReviewCardProps {
  id: string;
  user: string;
  userId: string;
  followers: number;
  place: string;
  rating: number;
  comment: string;
  tag: PurposeTag;
  likes: number;
  comments: number;
  time: string;
  isFollowing: boolean;
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
  followers,
  place,
  rating,
  comment,
  tag,
  likes,
  comments,
  time,
  isFollowing,
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
          ? "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20"
          : "bg-white/5"
      } border border-white/10 rounded-3xl overflow-hidden hover:border-white/30 transition-all group cursor-pointer shadow-xl`}
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
              <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full flex items-center justify-center text-white font-bold border-2 border-white/20">
                {user[0]}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm drop-shadow-lg">{user}</h3>
              </div>
            </div>
            {!isFollowing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFollow?.(userId);
                }}
                className="text-xs px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-900 font-medium rounded-full hover:bg-white transition-colors"
              >
                팔로우
              </button>
            )}
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button
              onClick={handlePlaceClick}
              className="flex items-center gap-2 mb-2 text-white hover:text-violet-300 transition-colors"
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
              className="flex items-center gap-2 text-gray-400 hover:text-rose-400 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "fill-rose-400 text-rose-400" : ""
                }`}
              />
              <span className="text-sm font-medium">{likes.toLocaleString()}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-violet-400 transition-colors">
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
