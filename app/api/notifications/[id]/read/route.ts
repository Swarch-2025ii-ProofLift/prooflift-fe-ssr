import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const NOTIFICATIONS_API_URL = process.env.NOTIFICATIONS_API_URL || "http://localhost:8000/notifications";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
      `${NOTIFICATIONS_API_URL}/${id}/read`,
      {
        method: "PUT",
        headers,
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Mark notification as read proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error while marking notification as read" },
      { status: 500 }
    );
  }
}
