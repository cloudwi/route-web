/**
 * 시간을 포맷팅하는 함수
 * @param minutes 분 단위 시간
 * @returns 포맷팅된 시간 문자열 (예: "1시간 30분", "45분")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
}

/**
 * 거리를 포맷팅하는 함수
 * @param meters 미터 단위 거리
 * @returns 포맷팅된 거리 문자열 (예: "1.5km", "500m")
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * 숫자를 천 단위 구분자와 함께 포맷팅
 * @param num 숫자
 * @returns 포맷팅된 숫자 문자열 (예: "1,234")
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * 날짜를 로컬 문자열로 포맷팅
 * @param date 날짜 문자열 또는 Date 객체
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString();
}
