import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  MessageCircle,
  X,
  Camera,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Booking {
  id: string;
  createdAt: string;
  name: string;
  organization: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  timeSlot: string;
  location: string;
  notes: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

const SERVICES = [
  "Corporate Event Coverage",
  "Summit & Diplomatic Protocol",
  "Executive Portrait & Headshots",
  "Commercial & TVC Campaign",
  "Fashion & Runway Show",
  "Concert & Live Performance",
  "Documentary & NGO Story",
  "Studio & Product Photography",
  "On-Site Instant Printing / ID",
];

const TIME_SLOTS = [
  "Morning (09:00 AM — 01:00 PM)",
  "Afternoon (02:00 PM — 06:00 PM)",
  "Evening (06:00 PM — 10:00 PM)",
  "Full Day Coverage (8+ Hours)",
  "Multi-Day Assignment",
];

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export function BookingModal({ isOpen, onClose, defaultService }: BookingModalProps) {
  const [service, setService] = useState(defaultService || SERVICES[0]);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("Dhaka");
  const [notes, setNotes] = useState("");
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date) {
      alert("Please fill in your name, phone number, and requested shoot date.");
      return;
    }

    const newBooking: Booking = {
      id: "BK-" + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      name,
      organization,
      phone,
      email,
      service,
      date,
      timeSlot,
      location,
      notes,
      status: "Pending",
    };

    // Save to localStorage for Admin Panel tracking
    try {
      const existing = JSON.parse(localStorage.getItem("ahmed_taj_bookings") || "[]");
      localStorage.setItem("ahmed_taj_bookings", JSON.stringify([newBooking, ...existing]));
    } catch {
      // Ignore storage errors
    }

    setSubmittedBooking(newBooking);
  };

  const handleReset = () => {
    setSubmittedBooking(null);
    onClose();
  };

  const getWhatsAppUrl = (booking: Booking) => {
    const text = encodeURIComponent(
      `Hello Ahmed Taj, I would like to schedule a shoot.\n\n` +
      `Booking Ref: ${booking.id}\n` +
      `Name: ${booking.name}\n` +
      `Organization: ${booking.organization || "N/A"}\n` +
      `Service: ${booking.service}\n` +
      `Date: ${booking.date}\n` +
      `Slot: ${booking.timeSlot}\n` +
      `Location: ${booking.location}\n` +
      (booking.notes ? `Details: ${booking.notes}\n` : "")
    );
    return `https://wa.me/8801730440068?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in-0 duration-200">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-white/20 bg-background text-foreground shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
              <Camera className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold leading-tight">Schedule a Shoot / Meeting</h2>
              <p className="text-xs text-muted-foreground font-mono">Ahmed Taj • Photo Preview Studio</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {submittedBooking ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="size-10" />
              </div>
              <h3 className="font-display text-3xl font-semibold text-foreground">
                Shoot Request Received
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Thank you, <strong className="text-foreground">{submittedBooking.name}</strong>. Your shoot booking
                has been logged under reference <strong className="text-primary font-mono">{submittedBooking.id}</strong>.
              </p>

              {/* Summary Card */}
              <div className="mt-6 rounded-lg border border-border bg-muted/30 p-5 text-left text-sm space-y-2.5 max-w-md mx-auto">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium text-foreground">{submittedBooking.service}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Requested Date:</span>
                  <span className="font-medium font-mono text-foreground">{submittedBooking.date}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Time Slot:</span>
                  <span className="font-medium text-foreground">{submittedBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium text-foreground">{submittedBooking.location}</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a
                  href={getWhatsAppUrl(submittedBooking)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-emerald-700 transition-colors shadow-md"
                >
                  <MessageCircle className="size-4" />
                  <span>Instant Confirm on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-input px-6 py-3 text-xs font-medium uppercase tracking-wider hover:bg-muted transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  1. Select Photography Service
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SERVICES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setService(s)}
                      className={cn(
                        "rounded-md border p-2.5 text-left text-xs font-medium transition-all duration-150",
                        service === s
                          ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/40"
                          : "border-border hover:border-foreground/30 text-foreground/80 hover:bg-muted/40"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <CalendarIcon className="size-3.5 text-primary" /> Shoot Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" /> Time Slot *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Details */}
              <div className="border-t border-border pt-4 space-y-4">
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  2. Client & Assignment Details
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <User className="size-3" /> Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Building2 className="size-3" /> Organization / Agency
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UNICEF / Grameenphone / Private"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Phone className="size-3" /> Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+880 17..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Mail className="size-3" /> Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="client@organization.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="size-3" /> Shoot Venue / City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BICC Dhaka / Radisson / Dhanmondi"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Brief Requirements / Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. VIP delegation, 300 delegates, live printing"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[0.72rem] text-muted-foreground">
                  <ShieldCheck className="size-4 text-emerald-500" />
                  <span>Prompt confirmation guaranteed within 2 hours.</span>
                </div>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/2 sm:w-auto px-4 py-2.5 text-xs uppercase tracking-wider font-medium text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 rounded-none bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
                  >
                    <span>Confirm Shoot</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
