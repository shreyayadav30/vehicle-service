import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Vehicle from "@/models/vehicle";

export async function GET() {
  try {
    await connectDB();

    const vehicles = await Vehicle.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch vehicles",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const vehicle = await Vehicle.create(body);

    return NextResponse.json(
      {
        success: true,
        data: vehicle,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create vehicle",
      },
      { status: 500 }
    );
  }
}