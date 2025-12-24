import { useState, useCallback } from "react";
import { PopularPlace } from "@/types/models";
import { api } from "@/lib/api";

export function usePopularPlaces() {
  const [places, setPlaces] = useState<PopularPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlaces = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.get<{ places: PopularPlace[] }>("/api/v1/popular_places");
      setPlaces(data.places || []);
    } catch (error) {
      console.error("Failed to fetch popular places:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const likePlace = useCallback(async (placeId: number) => {
    try {
      const data = await api.post<{ likesCount?: number }>(`/api/v1/places/${placeId}/likes`);
      if (data.likesCount !== undefined) {
        setPlaces((prev) =>
          prev.map((place) =>
            place.id === placeId.toString()
              ? { ...place, likesCount: data.likesCount }
              : place
          )
        );
      } else {
        // 좋아요 수가 없으면 다시 조회
        await fetchPlaces();
      }
      return true;
    } catch (error) {
      console.error("Failed to like place:", error);
      return false;
    }
  }, [fetchPlaces]);

  return {
    places,
    isLoading,
    fetchPlaces,
    likePlace,
  };
}
