import { NextRequest, NextResponse } from "next/server";
import { getUserData } from "@/lib/user";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getUserData(id);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    return NextResponse.json({ nombre: "Usuario" }, { status: 500 });
  }
}
