// API 응답 타입들
import { Place, PopularPlace, Course } from "./models";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PlacesSearchResponse {
  places: Place[];
}

export interface PopularPlacesResponse {
  places: PopularPlace[];
}

export interface CoursesResponse {
  courses: Course[];
}

export interface CourseResponse {
  course: Course;
}

export interface LikeResponse {
  likesCount: number;
}
