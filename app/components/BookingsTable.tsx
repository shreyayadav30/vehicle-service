"use client";

import { useEffect, useState } from "react";

type Booking = {
  bookingId: string;
  customerName: string;
  vehicleNumber?: string;
  service?: string;
  serviceType?: string;
  mechanic?: string;
  status?: string;
  amount?: number;
  bookingDate?: string;
};

export default function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
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
  const filteredBookings = bookings.filter((booking) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      booking.customerName?.toLowerCase().includes(searchText) ||
      booking.bookingId?.toLowerCase().includes(searchText) ||
      booking.vehicleNumber?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <section className="mt-8">
      <div className="rounded-xl bg-white p-6 shadow-sm">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Bookings
            </h2>

            <p className="mt-1 text-gray-500">
              Manage all vehicle service bookings.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 outline-none"
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <div className="py-10 text-center text-gray-500">
              Loading bookings...
            </div>
          ) : (
            <table className="w-full min-w-[1000px] text-left">

              <thead>
                <tr className="border-b bg-gray-50 text-sm text-gray-500">
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Mechanic</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date / Time</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.bookingId}
                    className="border-b text-sm hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-medium">
                      {booking.bookingId}
                    </td>

                    <td className="px-4 py-4">
                      {booking.customerName}
                    </td>

                    <td className="px-4 py-4">
                      {booking.vehicleNumber || "-"}
                    </td>

                    <td className="px-4 py-4">
                      {booking.service ||
                        booking.serviceType ||
                        "-"}
                    </td>

                    <td className="px-4 py-4">
                      {booking.mechanic || "-"}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          booking.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : booking.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {booking.status || "Pending"}
                      </span>
                    </td>

                    <td className="px-4 py-4 font-medium">
                      ₹{(booking.amount || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-4 text-gray-500">
                      {booking.bookingDate
                        ? new Date(
                            booking.bookingDate
                          ).toLocaleString("en-IN")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}

          {!loading && filteredBookings.length === 0 && (
            <div className="py-10 text-center text-gray-500">
              No bookings found.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}