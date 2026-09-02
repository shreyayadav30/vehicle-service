"use client";

import { useEffect, useState } from "react";
import KPICards from "./components/KPICards";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Booking = {
  bookingId: string;
  customerName: string;
  vehicleNumber?: string;
  service?: string;
  serviceType?: string;
  priority?: string;
  status?: string;
  mechanic?: string;
  amount?: number;
  bookingDate?: string;
};

const COLORS = ["#16a34a", "#f59e0b", "#ef4444", "#3b82f6"];

export default function AnalyticsCharts() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("/api/bookings");
        const result = await response.json();

        if (result.success) {
          setBookings(result.data);
        }
      } catch (error) {
        console.error("Failed to load bookings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();

const interval = setInterval(() => {
  fetchBookings();
}, 10000);

return () => clearInterval(interval);
}, []);

  const bookingData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));

    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    const bookingsInMonth = bookings.filter((booking) => {
      if (!booking.bookingDate) return false;

      const bookingDate = new Date(booking.bookingDate);

      return (
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear()
      );
    }).length;

    return {
      month,
      bookings: bookingsInMonth,
    };
  });

  const revenueData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));

    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    const revenue = bookings
      .filter((booking) => {
        if (!booking.bookingDate) return false;

        const bookingDate = new Date(booking.bookingDate);

        return (
          bookingDate.getMonth() === date.getMonth() &&
          bookingDate.getFullYear() === date.getFullYear()
        );
      })
      .reduce((total, booking) => total + (booking.amount || 0), 0);

    return {
      month,
      revenue,
    };
  });

  const statuses = ["Completed", "Pending", "Cancelled", "In Progress"];

  const statusData = statuses.map((status) => ({
    name: status,
    value: bookings.filter(
      (booking) => booking.status === status
    ).length,
  }));

  const serviceCounts: Record<string, number> = {};

  bookings.forEach((booking) => {
    const service =
      booking.service ||
      booking.serviceType ||
      "Other";

    serviceCounts[service] =
      (serviceCounts[service] || 0) + 1;
  });

  const serviceData = Object.entries(serviceCounts)
    .map(([service, bookings]) => ({
      service,
      bookings,
    }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);

  if (loading) {
    return (
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Analytics
        </h2>

        <p className="mt-1 text-gray-500">
          Loading real-time booking analytics...
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <KPICards />
      <h2 className="text-2xl font-bold text-gray-900">
        Analytics
      </h2>

      <p className="mt-1 text-gray-500">
        Monitor bookings, revenue and service performance.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">
            Bookings Over Time
          </h3>

          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#2563eb"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">
            Revenue Over Time
          </h3>

          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="revenue"
                  fill="#16a34a"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">
            Booking Status
          </h3>

          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">
            Service Breakdown
          </h3>

          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={serviceData}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  type="number"
                  allowDecimals={false}
                />

                <YAxis
                  type="category"
                  dataKey="service"
                  width={100}
                />

                <Tooltip />

                <Bar
                  dataKey="bookings"
                  fill="#7c3aed"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </section>
  );
}