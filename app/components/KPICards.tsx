"use client";

import { useEffect, useState } from "react";

type Booking = {
  status?: string;
  amount?: number;
};

export default function KPICards() {
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
        console.error("Failed to fetch bookings:", error);
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

  const totalBookings = bookings.length;

  const totalRevenue = bookings.reduce(
    (total, booking) => total + (booking.amount || 0),
    0
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const cards = [
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: "📋",
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: "💰",
    },
    {
      title: "Completed",
      value: completedBookings,
      icon: "✅",
    },
    {
      title: "Pending",
      value: pendingBookings,
      icon: "⏳",
    },
  ];

  if (loading) {
    return (
      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-gray-500">
              {card.title}
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              ...
            </p>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              {card.title}
            </p>

            <span className="text-2xl">
              {card.icon}
            </span>
          </div>

          <p className="mt-3 text-3xl font-bold text-gray-900">
            {card.value}
          </p>
        </div>
      ))}
    </section>
  );
}