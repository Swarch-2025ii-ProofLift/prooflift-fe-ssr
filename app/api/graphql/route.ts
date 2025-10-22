import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_GRAPHQL_URL = process.env.GRAPHQL_API_URL || "http://localhost:8083/graphql";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(BACKEND_GRAPHQL_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("GraphQL proxy error:", error);
    return NextResponse.json(
      {
        errors: [{
          message: "Internal server error while forwarding GraphQL request"
        }]
      },
      { status: 500 }
    );
  }
}
