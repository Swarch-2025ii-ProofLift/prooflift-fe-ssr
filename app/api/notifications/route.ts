import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const NOTIFICATIONS_API_URL = process.env.NOTIFICATIONS_API_URL || "http://localhost:8000/notifications";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "20";
    const offset = searchParams.get("offset") || "0";

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    const response = await fetch(
      `${NOTIFICATIONS_API_URL}?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Notifications proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching notifications" },
      { status: 500 }
    );
  }
}
