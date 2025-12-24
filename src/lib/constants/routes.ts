export const ROUTES = {
  HOME: "/",
  SEARCH: "/search",
  COURSE_CREATE: "/course/create",
  COURSE_DETAIL: (id: string) => `/course/${id}`,
  AUTH_CALLBACK: "/auth/callback",
} as const;
