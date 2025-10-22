import { NextRequest, NextResponse } from "next/server";

const EXERCISES_API_URL = process.env.EXERCISES_API_URL || "http://localhost:8082";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await fetch(`${EXERCISES_API_URL}/exercises/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Exercise fetch proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching exercise" },
      { status: 500 }
    );
  }
}
