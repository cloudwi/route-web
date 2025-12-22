"use client";

import { useState } from "react";
import ReviewCard from "./ReviewCard";
import type { PurposeTag } from "@/types";

interface Review {
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
  image?: string;
}

interface ReviewFeedProps {
  reviews: Review[];
  onLike?: (id: string) => void;
  onFollow?: (userId: string) => void;
  onPlaceClick?: (place: string) => void;
}

export default function ReviewFeed({
  reviews,
  onLike,
  onFollow,
  onPlaceClick,
}: ReviewFeedProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">아직 리뷰가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.map((review, index) => (
        <div
          key={review.id}
          className={
            index === 0 ? "md:col-span-2 lg:row-span-2" : ""
          }
        >
          <ReviewCard
            {...review}
            isFeatured={index === 0}
            onLike={onLike}
            onFollow={onFollow}
            onPlaceClick={onPlaceClick}
          />
        </div>
      ))}
    </div>
  );
}
