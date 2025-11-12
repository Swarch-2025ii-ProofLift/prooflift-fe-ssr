import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const NOTIFICATIONS_API_URL = process.env.NOTIFICATIONS_API_URL || "http://localhost:8000/notifications";

export async function PUT() {
  try {
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
      `${NOTIFICATIONS_API_URL}/read-all`,
      {
        method: "PUT",
        headers,
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Mark all notifications as read proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error while marking all notifications as read" },
      { status: 500 }
    );
  }
}
