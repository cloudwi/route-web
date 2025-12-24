import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // 네이버 지도 URL fetch
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();

    // cheerio로 HTML 파싱
    const $ = cheerio.load(html);

    // OG 이미지 태그 추출
    let ogImage = $('meta[property="og:image"]').attr('content');

    // og:image가 없으면 다른 이미지 태그 시도
    if (!ogImage) {
      ogImage = $('meta[name="twitter:image"]').attr('content');
    }

    if (!ogImage) {
      ogImage = $('link[rel="image_src"]').attr('href');
    }

    if (!ogImage) {
      return NextResponse.json(
        { error: 'No image found in OG tags' },
        { status: 404 }
      );
    }

    // 상대 URL을 절대 URL로 변환
    if (ogImage.startsWith('//')) {
      ogImage = 'https:' + ogImage;
    } else if (ogImage.startsWith('/')) {
      const urlObj = new URL(url);
      ogImage = `${urlObj.protocol}//${urlObj.host}${ogImage}`;
    }

    return NextResponse.json({ imageUrl: ogImage });
  } catch (error) {
    console.error('OG image extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract OG image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
