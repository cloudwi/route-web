import type { naver } from "@types/navermaps";

declare global {
  interface Window {
    naver: typeof naver;
  }
}

export {};
