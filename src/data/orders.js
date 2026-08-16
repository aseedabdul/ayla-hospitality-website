import { products } from "./products";

const find = (id) => products.find((p) => p.id === id);

const line = (id, qty) => {
  const p = find(id);
  return {
    productId: p.id,
    name: p.name,
    brand: p.brand,
    image: p.image,
    size: p.size,
    price: p.price,
    currency: p.currency,
    qty,
  };
};

// Order status pipeline used across guest tracking + admin management.
export const ORDER_STATUSES = ["Received", "Preparing", "Out for Delivery", "Delivered"];

// Mock order history. New orders placed through checkout are prepended at runtime
// via OrdersContext — this seed data represents "previous orders" for the guest.
export const orders = [
  {
    id: "AYLA-10231",
    hotel: "The Meridian Hotel",
    room: "412",
    items: [line("p-001", 1), line("p-004", 2), line("p-006", 1)],
    subtotal: 37.5,
    discount: 0,
    total: 37.5,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    status: "Delivered",
    requestedTime: "ASAP",
    placedAt: "2026-08-10T14:22:00",
    brandPreference: "",
    instructions: "Please leave at the door, traveling light.",
  },
  {
    id: "AYLA-10256",
    hotel: "The Meridian Hotel",
    room: "412",
    items: [line("p-013", 1), line("p-014", 1)],
    subtotal: 34.0,
    discount: 3.4,
    total: 30.6,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    status: "Out for Delivery",
    requestedTime: "Tonight, 9:30 PM",
    placedAt: "2026-08-14T21:02:00",
    brandPreference: "No preference",
    instructions: "",
  },
  {
    id: "AYLA-10278",
    hotel: "The Meridian Hotel",
    room: "412",
    items: [line("p-010", 1), line("p-011", 1)],
    subtotal: 60.0,
    discount: 0,
    total: 60.0,
    paymentMethod: "Cash",
    paymentStatus: "Pending",
    status: "Preparing",
    requestedTime: "Tomorrow, 8:00 AM",
    placedAt: "2026-08-16T09:40:00",
    brandPreference: "Lumière Skin",
    instructions: "Gift wrap if possible, thank you.",
  },
];
