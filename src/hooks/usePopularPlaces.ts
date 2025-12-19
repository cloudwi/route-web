import { useState, useCallback } from "react";
import { PopularPlace } from "@/types/models";
import { api } from "@/lib/api";

export function usePopularPlaces() {
  const [places, setPlaces] = useState<PopularPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlaces = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.fetch("/api/v1/popular_places");
      if (response.ok) {
        const data = await response.json();
        setPlaces(data.places || []);
      }
    } catch (error) {
      console.error("Failed to fetch popular places:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const likePlace = useCallback(async (placeId: number) => {
    try {
      const response = await api.fetch(`/api/v1/places/${placeId}/likes`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
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
      }
      return false;
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
