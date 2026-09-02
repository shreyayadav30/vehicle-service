import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/booking";

export async function GET() {
  try {
    await connectDB();

    const [
      totalBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      inProgressBookings,
      revenueResult,
      statusResult,
      serviceResult,
      monthlyResult,
    ] = await Promise.all([
      Booking.countDocuments(),

      Booking.countDocuments({
        status: "Completed",
      }),

      Booking.countDocuments({
        status: "Pending",
      }),

      Booking.countDocuments({
        status: "Cancelled",
      }),

      Booking.countDocuments({
        status: "In Progress",
      }),

      Booking.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
          },
        },
      ]),

      Booking.aggregate([
        {
          $group: {
            _id: "$status",
            value: { $sum: 1 },
          },
        },
      ]),

      Booking.aggregate([
        {
          $group: {
            _id: "$serviceType",
            bookings: { $sum: 1 },
          },
        },
        {
          $sort: {
            bookings: -1,
          },
        },
      ]),

      Booking.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$bookingDate" },
              month: { $month: "$bookingDate" },
            },
            bookings: { $sum: 1 },
            revenue: { $sum: "$amount" },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]),
    ]);

    return NextResponse.json({
      success: true,

      summary: {
        totalBookings,
        completedBookings,
        pendingBookings,
        cancelledBookings,
        inProgressBookings,
        totalRevenue: revenueResult[0]?.totalRevenue || 0,
      },

      statusData: statusResult.map((item) => ({
        name: item._id,
        value: item.value,
      })),

      serviceData: serviceResult.map((item) => ({
        service: item._id,
        bookings: item.bookings,
      })),

      monthlyData: monthlyResult.map((item) => ({
        year: item._id.year,
        month: item._id.month,
        bookings: item.bookings,
        revenue: item.revenue,
      })),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch analytics",
      },
      { status: 500 }
    );
 }
}