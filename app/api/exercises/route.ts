import { NextRequest, NextResponse } from "next/server";

const EXERCISES_API_URL = process.env.EXERCISES_API_URL || "http://localhost:8000/suggest";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });

    const response = await fetch(`${EXERCISES_API_URL}/exercises?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch exercises" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Exercises fetch proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching exercises" },
      { status: 500 }
    );
  }
}