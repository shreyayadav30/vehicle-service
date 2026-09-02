import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/service";

export async function GET() {
  try {
    await connectDB();

    const services = await Service.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Service GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch services",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const service = await Service.create(body);

    return NextResponse.json(
      {
        success: true,
        data: service,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Service POST Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create service",
      },
      { status: 500 }
    );
  }
}