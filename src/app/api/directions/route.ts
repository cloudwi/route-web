import { NextRequest, NextResponse } from "next/server";

const NAVER_CLIENT_ID = process.env.NAVER_MAP_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

interface DirectionsRequest {
  start: { lat: number; lng: number };
  goal: { lat: number; lng: number };
  waypoints?: { lat: number; lng: number }[];
  option?: "trafast" | "tracomfort" | "traoptimal" | "traavoidtoll" | "traavoidcaronly";
}

export async function POST(request: NextRequest) {
  try {
    const body: DirectionsRequest = await request.json();
    const { start, goal, waypoints, option = "traoptimal" } = body;

    console.log("NAVER_CLIENT_ID:", NAVER_CLIENT_ID ? "설정됨" : "없음");
    console.log("NAVER_CLIENT_SECRET:", NAVER_CLIENT_SECRET ? "설정됨" : "없음");

    if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
      return NextResponse.json(
        { error: "네이버 API 키가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // 좌표 형식: lng,lat (경도,위도)
    const startStr = `${start.lng},${start.lat}`;
    const goalStr = `${goal.lng},${goal.lat}`;

    let url = `https://maps.apigw.ntruss.com/map-direction/v1/driving?start=${startStr}&goal=${goalStr}&option=${option}`;

    // 경유지가 있으면 추가 (최대 5개)
    if (waypoints && waypoints.length > 0) {
      const waypointsStr = waypoints
        .slice(0, 5)
        .map((wp) => `${wp.lng},${wp.lat}`)
        .join("|");
      url += `&waypoints=${waypointsStr}`;
    }

    const response = await fetch(url, {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": NAVER_CLIENT_SECRET,
      },
    });

    const data = await response.json();

    console.log("Naver Directions API response:", JSON.stringify(data, null, 2));

    if (data.code !== 0) {
      console.error("Naver Directions API error:", data);
      return NextResponse.json(
        { error: data.message || "경로를 찾을 수 없습니다.", code: data.code },
        { status: 400 }
      );
    }

    const route = data.route?.[option]?.[0] || data.route?.traoptimal?.[0];

    if (!route) {
      return NextResponse.json(
        { error: "경로를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 경로 좌표 추출 (폴리라인용)
    const path = route.path.map((coord: [number, number]) => ({
      lat: coord[1],
      lng: coord[0],
    }));

    // 구간별 정보 (duration이 없으면 거리 비율로 추정)
    const totalDistance = route.summary.distance;
    const totalDuration = route.summary.duration;
    const sections = route.section?.map((sec: { distance: number; duration?: number }) => ({
      distance: sec.distance, // 미터
      duration: sec.duration || Math.round((sec.distance / totalDistance) * totalDuration), // 밀리초
    })) || [];

    return NextResponse.json({
      path,
      summary: {
        distance: route.summary.distance, // 총 거리 (미터)
        duration: route.summary.duration, // 총 시간 (밀리초)
        tollFare: route.summary.tollFare, // 톨게이트 비용
        fuelPrice: route.summary.fuelPrice, // 연료비
      },
      sections,
    });
  } catch (error) {
    console.error("Directions API error:", error);
    return NextResponse.json(
      { error: "경로 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
