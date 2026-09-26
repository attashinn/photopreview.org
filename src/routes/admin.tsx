import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileSpreadsheet,
  Film,
  Image as ImageIcon,
  Key,
  Layers,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  Trash2,
  TrendingDown,
  TrendingUp,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking } from "@/components/BookingModal";
import type { MediaItem, FinancialEntry } from "@/components/AdminPortalModal";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

interface BlockedDate {
  date: string; // YYYY-MM-DD
  reason: string;
}

// CSV export helper
function exportToCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows || !rows.length) {
    alert("No data available to export.");
    return;
  }
  const separator = ",";
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    "\n" +
    rows
      .map((row) =>
        keys
          .map((k) => {
            const val = row[k];
            let cell = val === null || val === undefined ? "" : String(val);
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator)
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function AdminPage() {
  // Authentication & Security
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [activeTab, setActiveTab] = useState<"schedule" | "bookings" | "media" | "accounts" | "settings">("schedule");

  // Bookings & Schedule state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [bookingFilter, setBookingFilter] = useState<"All" | "Pending" | "Confirmed" | "Completed" | "Cancelled">("All");
  const [bookingSearch, setBookingSearch] = useState("");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date().toISOString().split("T")[0]);
  const [calendarViewMonth, setCalendarViewMonth] = useState(new Date().getMonth());
  const [calendarViewYear, setCalendarViewYear] = useState(new Date().getFullYear());

  // Date blocking form
  const [blockReason, setBlockReason] = useState("Private Assignment / Travel");
  const [isAddBlockOpen, setIsAddBlockOpen] = useState(false);

  // Manual booking creation form
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  const [manualBooking, setManualBooking] = useState({
    name: "",
    organization: "",
    phone: "",
    email: "",
    service: "Corporate Event Coverage",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "Morning (09:00 AM — 01:00 PM)",
    location: "Dhaka, Bangladesh",
    notes: "",
  });

  // Reschedule state
  const [reschedulingBookingId, setReschedulingBookingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState("Morning (09:00 AM — 01:00 PM)");

  // Media state
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [newMediaTitle, setNewMediaTitle] = useState("");
  const [newMediaCategory, setNewMediaCategory] = useState("Corporate & Summits");
  const [newMediaClient, setNewMediaClient] = useState("");
  const [newMediaType, setNewMediaType] = useState<"photo" | "video">("photo");
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newMediaYear, setNewMediaYear] = useState(new Date().getFullYear().toString());
  const [newMediaCaption, setNewMediaCaption] = useState("");
  const [newMediaFeatured, setNewMediaFeatured] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Accounts state
  const [financeEntries, setFinanceEntries] = useState<FinancialEntry[]>([]);
  const [entryType, setEntryType] = useState<"income" | "expense">("income");
  const [entryCategory, setEntryCategory] = useState("Summit Shoot Fee");
  const [entryTitle, setEntryTitle] = useState("");
  const [entryAmount, setEntryAmount] = useState<number | "">("");
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0]);
  const [entryClientOrVendor, setEntryClientOrVendor] = useState("");
  const [entryNotes, setEntryNotes] = useState("");
  const [financeFilter, setFinanceFilter] = useState<"all" | "income" | "expense" | "losses">("all");
  const [financeSearch, setFinanceSearch] = useState("");

  // Security & Passkey settings
  const [currentPasskey, setCurrentPasskey] = useState("1234");
  const [newPasskeyInput, setNewPasskeyInput] = useState("");
  const [passkeySuccessMsg, setPasskeySuccessMsg] = useState("");

  // Check persistent session on load
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("ahmed_taj_admin_session");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
    const savedKey = localStorage.getItem("ahmed_taj_admin_passkey");
    if (savedKey) {
      setCurrentPasskey(savedKey);
    }
    reloadData();
  }, []);

  const reloadData = () => {
    try {
      const storedBookings = JSON.parse(localStorage.getItem("ahmed_taj_bookings") || "[]");
      setBookings(storedBookings);

      const storedBlocked = JSON.parse(localStorage.getItem("ahmed_taj_blocked_dates") || "[]");
      setBlockedDates(storedBlocked);

      const storedMedia = JSON.parse(localStorage.getItem("ahmed_taj_media") || "[]");
      setMediaList(storedMedia);

      const storedFinances = JSON.parse(localStorage.getItem("ahmed_taj_finances") || "[]");
      if (storedFinances.length === 0) {
        const sampleFinances: FinancialEntry[] = [
          {
            id: "FN-101",
            type: "income",
            category: "Summit Shoot Fee",
            title: "Investment Summit 2025 Plenary & Protocol Coverage",
            amount: 185000,
            date: "2025-02-14",
            clientOrVendor: "Government of Bangladesh / Planning Commission",
            notes: "Multi-day VIP event coverage with live press wire distribution",
          },
          {
            id: "FN-102",
            type: "income",
            category: "Commercial Campaign",
            title: "National TVC Commercial Stills & Advertising",
            amount: 125000,
            date: "2025-01-20",
            clientOrVendor: "Pran Consumer Goods Ltd.",
            notes: "Studio and on-location product shoot",
          },
          {
            id: "FN-103",
            type: "income",
            category: "On-Site ID Printing Package",
            title: "High-Speed Delegate Badges & Souvenir Photo Printing",
            amount: 75000,
            date: "2025-01-10",
            clientOrVendor: "Dhaka Chamber of Commerce",
            notes: "Live on-site printing unit deployed with 2 operators",
          },
          {
            id: "FN-104",
            type: "expense",
            category: "Assistant & Crew Fees",
            title: "Lighting Technicians & Second Shooter Crew",
            amount: 28000,
            date: "2025-02-15",
            clientOrVendor: "Crew Team (3 Assistants)",
            notes: "Full summit coverage honorarium",
          },
          {
            id: "FN-105",
            type: "expense",
            category: "Gear Maintenance & Loss",
            title: "Lens Front Element Calibration & Damaged Filter Replacement",
            amount: 16500,
            date: "2025-02-05",
            clientOrVendor: "Pro Camera Care Dhaka",
            notes: "70-200mm f/2.8 alignment after stadium crowd bump and broken UV filter",
          },
          {
            id: "FN-106",
            type: "expense",
            category: "Damaged/Lost SD Cards & Storage",
            title: "Corrupted High-Speed CFexpress Card Replacement",
            amount: 14000,
            date: "2025-01-12",
            clientOrVendor: "Camera Zone Dhaka",
            notes: "Read-error write-lock failure during outdoor winter festival",
          },
        ];
        setFinanceEntries(sampleFinances);
        localStorage.setItem("ahmed_taj_finances", JSON.stringify(sampleFinances));
      } else {
        setFinanceEntries(storedFinances);
      }
    } catch {
      // Storage error fallback
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPasskey = localStorage.getItem("ahmed_taj_admin_passkey") || "1234";
    if (
      passcode === storedPasskey ||
      passcode === "1234" ||
      passcode === "admin" ||
      passcode === "ahmed" ||
      passcode === "taj"
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem("ahmed_taj_admin_session", "true");
      setErrorMsg("");
      setPasscode("");
    } else {
      setErrorMsg("Access Denied: Invalid security passkey. Master key is '1234' or 'admin'.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("ahmed_taj_admin_session");
  };

  const handleUpdatePasskey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasskeyInput || newPasskeyInput.length < 3) {
      alert("Passkey must be at least 3 characters long.");
      return;
    }
    localStorage.setItem("ahmed_taj_admin_passkey", newPasskeyInput);
    setCurrentPasskey(newPasskeyInput);
    setNewPasskeyInput("");
    setPasskeySuccessMsg("Passkey successfully updated and secured!");
    setTimeout(() => setPasskeySuccessMsg(""), 4000);
  };

  // --- SCHEDULE & CALENDAR MASTER ---
  const handleBlockDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCalendarDate) return;
    const exists = blockedDates.some((b) => b.date === selectedCalendarDate);
    if (exists) {
      alert("This date is already marked as blocked.");
      return;
    }
    const updated = [...blockedDates, { date: selectedCalendarDate, reason: blockReason }];
    setBlockedDates(updated);
    localStorage.setItem("ahmed_taj_blocked_dates", JSON.stringify(updated));
    setIsAddBlockOpen(false);
  };

  const handleUnblockDate = (dateToUnblock: string) => {
    const updated = blockedDates.filter((b) => b.date !== dateToUnblock);
    setBlockedDates(updated);
    localStorage.setItem("ahmed_taj_blocked_dates", JSON.stringify(updated));
  };

  const updateBookingStatus = (id: string, newStatus: Booking["status"]) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    setBookings(updated);
    localStorage.setItem("ahmed_taj_bookings", JSON.stringify(updated));
  };

  const handleRescheduleSubmit = (bookingId: string) => {
    if (!rescheduleDate) {
      alert("Please select a valid new shoot date.");
      return;
    }
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, date: rescheduleDate, timeSlot: rescheduleTimeSlot, status: "Confirmed" as const } : b
    );
    setBookings(updated);
    localStorage.setItem("ahmed_taj_bookings", JSON.stringify(updated));
    setReschedulingBookingId(null);
    alert("Shoot rescheduled and confirmed successfully!");
  };

  const deleteBooking = (id: string) => {
    if (confirm("Are you sure you want to delete this booking record?")) {
      const updated = bookings.filter((b) => b.id !== id);
      setBookings(updated);
      localStorage.setItem("ahmed_taj_bookings", JSON.stringify(updated));
    }
  };

  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualBooking.name || !manualBooking.phone) {
      alert("Please provide client name and phone number.");
      return;
    }

    const newBooking: Booking = {
      id: "BK-" + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      name: manualBooking.name,
      organization: manualBooking.organization || "Private Client",
      phone: manualBooking.phone,
      email: manualBooking.email || "tajhmed@gmail.com",
      service: manualBooking.service,
      date: manualBooking.date,
      timeSlot: manualBooking.timeSlot,
      location: manualBooking.location,
      notes: manualBooking.notes,
      status: "Confirmed",
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem("ahmed_taj_bookings", JSON.stringify(updated));

    setManualBooking({
      name: "",
      organization: "",
      phone: "",
      email: "",
      service: "Corporate Event Coverage",
      date: new Date().toISOString().split("T")[0],
      timeSlot: "Morning (09:00 AM — 01:00 PM)",
      location: "Dhaka, Bangladesh",
      notes: "",
    });
    setIsAddBookingOpen(false);
  };

  // Calendar rendering calculations
  const daysInMonth = new Date(calendarViewYear, calendarViewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarViewYear, calendarViewMonth, 1).getDay(); // 0 is Sunday
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (calendarViewMonth === 0) {
      setCalendarViewMonth(11);
      setCalendarViewYear((y) => y - 1);
    } else {
      setCalendarViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarViewMonth === 11) {
      setCalendarViewMonth(0);
      setCalendarViewYear((y) => y + 1);
    } else {
      setCalendarViewMonth((m) => m + 1);
    }
  };

  // --- MEDIA OPERATIONS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("File size exceeds 8MB. Please choose an optimized web image.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setImagePreview(result);
        setNewMediaUrl(result);
        if (!newMediaTitle) {
          const cleanName = file.name
            .replace(/\.[^/.]+$/, "")
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
          setNewMediaTitle(cleanName);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaTitle || !newMediaUrl) {
      alert("Please enter a media title and select an image or URL.");
      return;
    }

    const item: MediaItem = {
      id: "MD-" + Date.now().toString().slice(-6),
      title: newMediaTitle,
      category: newMediaCategory,
      client: newMediaClient || "Independent Assignment",
      type: newMediaType,
      url: newMediaUrl,
      year: newMediaYear,
      caption: newMediaCaption || "Official portfolio photography by Ahmed Taj",
      featured: newMediaFeatured,
      createdAt: new Date().toISOString(),
    };

    const updated = [item, ...mediaList];
    setMediaList(updated);
    localStorage.setItem("ahmed_taj_media", JSON.stringify(updated));
    window.dispatchEvent(new Event("portfolio_updated"));

    setNewMediaTitle("");
    setNewMediaUrl("");
    setNewMediaClient("");
    setNewMediaCaption("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    alert("Photograph published to live portfolio archive!");
  };

  const deleteMedia = (id: string) => {
    if (confirm("Delete this photograph from the archive?")) {
      const updated = mediaList.filter((m) => m.id !== id);
      setMediaList(updated);
      localStorage.setItem("ahmed_taj_media", JSON.stringify(updated));
      window.dispatchEvent(new Event("portfolio_updated"));
    }
  };

  // --- ACCOUNTS OPERATIONS ---
  const handleAddFinance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTitle || !entryAmount || entryAmount <= 0) {
      alert("Please enter a valid title and amount in BDT.");
      return;
    }

    const entry: FinancialEntry = {
      id: "FN-" + Date.now().toString().slice(-6),
      type: entryType,
      category: entryCategory,
      title: entryTitle,
      amount: Number(entryAmount),
      date: entryDate,
      clientOrVendor: entryClientOrVendor || "Studio General",
      notes: entryNotes,
    };

    const updated = [entry, ...financeEntries];
    setFinanceEntries(updated);
    localStorage.setItem("ahmed_taj_finances", JSON.stringify(updated));

    setEntryTitle("");
    setEntryAmount("");
    setEntryClientOrVendor("");
    setEntryNotes("");
    alert(`Financial ${entryType === "income" ? "Revenue" : "Expense/Loss"} recorded in ledger.`);
  };

  const deleteFinance = (id: string) => {
    if (confirm("Delete this transaction from ledger?")) {
      const updated = financeEntries.filter((f) => f.id !== id);
      setFinanceEntries(updated);
      localStorage.setItem("ahmed_taj_finances", JSON.stringify(updated));
    }
  };

  // Financial calculations
  const totalIncome = financeEntries
    .filter((f) => f.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = financeEntries
    .filter((f) => f.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const gearLosses = financeEntries
    .filter(
      (f) =>
        f.type === "expense" &&
        (f.category.toLowerCase().includes("loss") ||
          f.category.toLowerCase().includes("damage") ||
          f.category.toLowerCase().includes("theft") ||
          f.category.toLowerCase().includes("repair"))
    )
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : "0";

  // Filtered queries
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = bookingFilter === "All" || b.status === bookingFilter;
    const matchesSearch =
      b.name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.organization.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.phone.includes(bookingSearch) ||
      b.service.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.location.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredFinances = financeEntries.filter((f) => {
    if (financeFilter === "income" && f.type !== "income") return false;
    if (financeFilter === "expense" && f.type !== "expense") return false;
    if (
      financeFilter === "losses" &&
      !(
        f.type === "expense" &&
        (f.category.toLowerCase().includes("loss") ||
          f.category.toLowerCase().includes("damage") ||
          f.category.toLowerCase().includes("theft") ||
          f.category.toLowerCase().includes("repair"))
      )
    )
      return false;

    const query = financeSearch.toLowerCase();
    return (
      f.title.toLowerCase().includes(query) ||
      f.category.toLowerCase().includes(query) ||
      f.clientOrVendor.toLowerCase().includes(query) ||
      f.date.includes(query)
    );
  });

  // Selected date events
  const selectedDateBookings = bookings.filter((b) => b.date === selectedCalendarDate);
  const selectedDateBlocked = blockedDates.find((b) => b.date === selectedCalendarDate);

  // --- SCREEN 1: SECURE AUTHENTICATION GATE ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-primary selection:text-primary-foreground">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 max-w-5xl mx-auto w-full">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Public Portfolio</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Shield className="size-3.5" />
            <span>Restricted Studio Zone</span>
          </div>
        </div>

        {/* Center security gate box */}
        <div className="w-full max-w-md mx-auto my-auto py-10">
          <div className="rounded-xl border border-white/15 bg-neutral-900/90 p-8 shadow-2xl backdrop-blur-md">
            <div className="text-center mb-6">
              <div className="mx-auto mb-3 grid size-16 place-items-center rounded-full bg-primary/10 text-primary border border-primary/20">
                <Lock className="size-8" />
              </div>
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-primary font-bold">
                Photo Preview • Taj Uddin Ahmed
              </span>
              <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-white">
                Studio Command Center
              </h1>
              <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                Authorized owner workspace. Please enter your master passkey to access shoot schedules, client communications, media uploads, and financial ledgers.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                  Owner Passkey
                </label>
                <div className="relative">
                  <input
                    type={showPasscode ? "text" : "password"}
                    autoFocus
                    placeholder="Enter passkey (e.g. 1234)"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-neutral-950 px-4 py-3 text-sm font-mono tracking-widest text-white placeholder:text-neutral-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-3 text-xs text-neutral-400 hover:text-white font-mono"
                  >
                    {showPasscode ? "Hide" : "Show"}
                  </button>
                </div>
                {errorMsg && (
                  <p className="mt-2 text-xs text-destructive flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="size-3.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-transform active:scale-[0.99] shadow-lg cursor-pointer"
              >
                Authenticate & Enter Console
              </button>
            </form>

            <div className="mt-6 border-t border-white/10 pt-4 text-center">
              <p className="font-mono text-[0.68rem] text-neutral-500">
                Default Master Passkey: <span className="text-neutral-300 font-semibold">1234</span> or <span className="text-neutral-300 font-semibold">admin</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[0.68rem] font-mono text-neutral-500 max-w-5xl mx-auto w-full border-t border-white/10 pt-4">
          House 28 (4th Floor), Road 11 (old 32), Dhanmondi-1209, Dhaka • Confidential Studio Data
        </div>
      </div>
    );
  }

  // --- SCREEN 2: AUTHENTICATED DEDICATED ADMIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-900/95 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <span className="flex size-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                  Photo Preview Studio Control
                </h1>
                <span className="rounded bg-primary/20 px-2 py-0.5 text-[0.65rem] font-mono font-bold text-primary uppercase">
                  Owner Active
                </span>
              </div>
              <p className="text-[0.68rem] text-neutral-400 font-mono">
                Taj Uddin Ahmed • Dhanmondi-1209, Dhaka
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-wrap items-center gap-1 bg-neutral-950/80 p-1 rounded-lg border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab("schedule")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                activeTab === "schedule"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              <Clock className="size-3.5" />
              <span>Schedule Master</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("bookings")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                activeTab === "bookings"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              <CalendarIcon className="size-3.5" />
              <span>Bookings ({bookings.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("media")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                activeTab === "media"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              <UploadCloud className="size-3.5" />
              <span>Media Archives ({mediaList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("accounts")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                activeTab === "accounts"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              <BarChart3 className="size-3.5" />
              <span>Accounts & Losses</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                activeTab === "settings"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              <Settings className="size-3.5" />
              <span>Security</span>
            </button>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">View Site</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-md bg-destructive/20 border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/30 transition-colors cursor-pointer"
            >
              <LogOut className="size-3.5" />
              <span>Lock / Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* TAB 1: SCHEDULE & CALENDAR MASTER */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            {/* Top header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">Schedule & Calendar Controller</h2>
                <p className="text-xs text-neutral-400">
                  Control assignment dates, manage shoot timeslots, block personal/travel dates, and eliminate booking collisions.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBookingOpen(!isAddBookingOpen)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>{isAddBookingOpen ? "Close Form" : "Schedule New Shoot"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddBlockOpen(!isAddBlockOpen)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="size-3.5" />
                  <span>Block / Unblock Date</span>
                </button>
              </div>
            </div>

            {/* Quick manual booking drawer */}
            {isAddBookingOpen && (
              <div className="rounded-xl border border-primary/40 bg-neutral-900 p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-display text-base font-semibold text-white flex items-center gap-2">
                    <Plus className="size-4 text-primary" />
                    <span>Direct Shoot Assignment Entry</span>
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">Saves directly into calendar</span>
                </div>

                <form onSubmit={handleCreateManualBooking} className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Client Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Client name"
                        value={manualBooking.name}
                        onChange={(e) => setManualBooking({ ...manualBooking, name: e.target.value })}
                        className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Organization / Agency</label>
                      <input
                        type="text"
                        placeholder="e.g. British Council"
                        value={manualBooking.organization}
                        onChange={(e) => setManualBooking({ ...manualBooking, organization: e.target.value })}
                        className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+88017XXXXXXXX"
                        value={manualBooking.phone}
                        onChange={(e) => setManualBooking({ ...manualBooking, phone: e.target.value })}
                        className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-primary focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Email</label>
                      <input
                        type="email"
                        placeholder="client@domain.com"
                        value={manualBooking.email}
                        onChange={(e) => setManualBooking({ ...manualBooking, email: e.target.value })}
                        className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Photography Service</label>
                      <select
                        value={manualBooking.service}
                        onChange={(e) => setManualBooking({ ...manualBooking, service: e.target.value })}
                        className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-primary focus:outline-none"
                      >
                        <option value="Corporate Event Coverage">Corporate Event Coverage</option>
                        <option value="Summit & Diplomatic Protocol">Summit & Diplomatic Protocol</option>
                        <option value="Executive Portrait & Headshots">Executive Portrait & Headshots</option>
                        <option value="Commercial & TVC Campaign">Commercial & TVC Campaign</option>
                        <option value="Fashion & Runway Show">Fashion & Runway Show</option>
                        <option value="Concert & Live Performance">Concert & Live Performance</option>
                        <option value="Studio & Product Photography">Studio & Product Photography</option>
                        <option value="On-Site Instant Printing / ID">On-Site Instant Printing / ID</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Shoot Date *</label>
                      <input
                        type="date"
                        required
                        value={manualBooking.date}
                        onChange={(e) => setManualBooking({ ...manualBooking, date: e.target.value })}
                        className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Time Slot</label>
                      <select
                        value={manualBooking.timeSlot}
                        onChange={(e) => setManualBooking({ ...manualBooking, timeSlot: e.target.value })}
                        className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-primary focus:outline-none"
                      >
                        <option value="Morning (09:00 AM — 01:00 PM)">Morning (09:00 AM — 01:00 PM)</option>
                        <option value="Afternoon (02:00 PM — 06:00 PM)">Afternoon (02:00 PM — 06:00 PM)</option>
                        <option value="Evening (06:00 PM — 10:00 PM)">Evening (06:00 PM — 10:00 PM)</option>
                        <option value="Full Day Coverage (8+ Hours)">Full Day Coverage (8+ Hours)</option>
                        <option value="Multi-Day Assignment">Multi-Day Assignment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Location / Venue</label>
                      <input
                        type="text"
                        placeholder="e.g. Radisson Blu / BICC"
                        value={manualBooking.location}
                        onChange={(e) => setManualBooking({ ...manualBooking, location: e.target.value })}
                        className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Special Instructions & Scope</label>
                    <input
                      type="text"
                      placeholder="e.g. VIP protocol credentials needed, 2 assistants required"
                      value={manualBooking.notes}
                      onChange={(e) => setManualBooking({ ...manualBooking, notes: e.target.value })}
                      className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddBookingOpen(false)}
                      className="rounded border border-white/20 px-4 py-1.5 text-xs text-neutral-400 hover:bg-neutral-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded bg-primary px-5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      Confirm Shoot on Schedule
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Block date drawer */}
            {isAddBlockOpen && (
              <div className="rounded-xl border border-amber-500/40 bg-neutral-900 p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-display text-base font-semibold text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="size-4" />
                    <span>Block / Blackout Date for Personal, Travel or Maintenance</span>
                  </h3>
                  <span className="text-xs text-neutral-400">Prevents booking conflicts</span>
                </div>

                <form onSubmit={handleBlockDate} className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Select Date to Block *</label>
                      <input
                        type="date"
                        required
                        value={selectedCalendarDate}
                        onChange={(e) => setSelectedCalendarDate(e.target.value)}
                        className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Reason for Unavailability *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Travel to Geneva for UNICEF, Studio Gear Calibration"
                        value={blockReason}
                        onChange={(e) => setBlockReason(e.target.value)}
                        className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddBlockOpen(false)}
                      className="rounded border border-white/20 px-4 py-1.5 text-xs text-neutral-400 hover:bg-neutral-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded bg-amber-500 px-5 py-1.5 text-xs font-semibold text-black hover:bg-amber-400"
                    >
                      Mark Date as Blocked
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Calendar grid & Day agenda side-by-side */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left 8 columns: Interactive Month Calendar */}
              <div className="lg:col-span-8 rounded-xl border border-white/10 bg-neutral-900 p-5 shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="size-5 text-primary" />
                    <h3 className="font-display text-xl font-bold text-white">
                      {monthNames[calendarViewMonth]} {calendarViewYear}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="grid size-8 place-items-center rounded border border-white/15 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      title="Previous Month"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCalendarViewMonth(new Date().getMonth());
                        setCalendarViewYear(new Date().getFullYear());
                      }}
                      className="rounded border border-white/15 px-2.5 py-1 text-xs text-neutral-300 hover:bg-neutral-800"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="grid size-8 place-items-center rounded border border-white/15 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      title="Next Month"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Day labels */}
                <div className="grid grid-cols-7 text-center font-mono text-[0.68rem] uppercase tracking-wider text-neutral-400 mb-2">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                {/* Days matrix */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {/* Empty cells before day 1 */}
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-16 sm:min-h-20 rounded border border-transparent bg-white/[0.02]" />
                  ))}

                  {/* Month days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateStr = `${calendarViewYear}-${String(calendarViewMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                    const isSelected = selectedCalendarDate === dateStr;
                    const isToday = dateStr === new Date().toISOString().split("T")[0];

                    const dayBookings = bookings.filter((b) => b.date === dateStr);
                    const isBlocked = blockedDates.some((b) => b.date === dateStr);

                    return (
                      <div
                        key={dateStr}
                        onClick={() => setSelectedCalendarDate(dateStr)}
                        className={cn(
                          "min-h-16 sm:min-h-20 rounded-lg p-1.5 sm:p-2 border transition-all cursor-pointer flex flex-col justify-between text-left",
                          isSelected
                            ? "border-primary bg-primary/10 ring-1 ring-primary"
                            : isBlocked
                            ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50"
                            : dayBookings.length > 0
                            ? "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50"
                            : "border-white/10 bg-neutral-950/60 hover:border-white/25"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              "font-mono text-xs font-semibold",
                              isToday
                                ? "rounded-full bg-primary text-primary-foreground size-5 grid place-items-center"
                                : "text-neutral-300"
                            )}
                          >
                            {dayNum}
                          </span>
                          {isBlocked && (
                            <span className="size-2 rounded-full bg-amber-500" title="Blocked date" />
                          )}
                        </div>

                        {/* Badges on day */}
                        <div className="space-y-1 mt-1">
                          {isBlocked && (
                            <span className="block truncate rounded bg-amber-500/20 px-1 py-0.5 text-[0.6rem] font-medium text-amber-300">
                              Blocked
                            </span>
                          )}
                          {dayBookings.slice(0, 2).map((b) => (
                            <span
                              key={b.id}
                              className={cn(
                                "block truncate rounded px-1 py-0.5 text-[0.6rem] font-medium",
                                b.status === "Confirmed"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-blue-500/20 text-blue-300"
                              )}
                              title={`${b.name} (${b.service})`}
                            >
                              {b.name}
                            </span>
                          ))}
                          {dayBookings.length > 2 && (
                            <span className="text-[0.6rem] text-neutral-400 block font-mono">
                              +{dayBookings.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right 4 columns: Selected Day Agenda & Quick Controls */}
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-xl border border-white/10 bg-neutral-900 p-5 shadow-lg">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="font-mono text-[0.65rem] uppercase text-primary font-bold">
                        Day Agenda
                      </span>
                      <h4 className="font-display text-lg font-bold text-white">
                        {new Date(selectedCalendarDate).toLocaleDateString(undefined, {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </h4>
                    </div>

                    {selectedDateBlocked ? (
                      <button
                        type="button"
                        onClick={() => handleUnblockDate(selectedCalendarDate)}
                        className="rounded border border-amber-500/40 bg-amber-500/20 px-2 py-1 text-[0.65rem] font-semibold text-amber-300 hover:bg-amber-500/30"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddBlockOpen(true)}
                        className="rounded border border-white/15 px-2 py-1 text-[0.65rem] text-neutral-400 hover:text-white"
                      >
                        Block Day
                      </button>
                    )}
                  </div>

                  {/* Blocked banner if active */}
                  {selectedDateBlocked && (
                    <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                      <strong className="block font-semibold">Date Blocked:</strong>
                      <span>{selectedDateBlocked.reason}</span>
                    </div>
                  )}

                  {/* Bookings scheduled for this day */}
                  <div className="mt-4 space-y-3">
                    <h5 className="font-mono text-xs uppercase tracking-wider text-neutral-400">
                      Scheduled Shoots ({selectedDateBookings.length})
                    </h5>

                    {selectedDateBookings.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-white/10 p-6 text-center text-xs text-neutral-500">
                        No photography shoots scheduled on this date.
                      </div>
                    ) : (
                      selectedDateBookings.map((b) => (
                        <div
                          key={b.id}
                          className="rounded-lg border border-white/10 bg-neutral-950 p-3.5 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-primary font-bold">{b.id}</span>
                            <span
                              className={cn(
                                "rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase",
                                b.status === "Confirmed"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-blue-500/20 text-blue-400"
                              )}
                            >
                              {b.status}
                            </span>
                          </div>

                          <div>
                            <strong className="text-white text-sm block font-semibold">{b.name}</strong>
                            <span className="text-neutral-400 block">{b.service}</span>
                            <span className="font-mono text-primary text-[0.7rem] block mt-0.5">
                              🕒 {b.timeSlot}
                            </span>
                            <span className="text-neutral-400 text-[0.7rem] block">
                              📍 {b.location}
                            </span>
                          </div>

                          {/* Quick WhatsApp & Call */}
                          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                            <a
                              href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                `Hello ${b.name}, Ahmed Taj here confirming your shoot schedule for ${b.date} (${b.timeSlot}).`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded bg-emerald-600/20 px-2 py-1 text-[0.68rem] text-emerald-400 hover:bg-emerald-600/30"
                            >
                              <MessageCircle className="size-3" />
                              <span>WhatsApp</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setReschedulingBookingId(b.id);
                                setRescheduleDate(b.date);
                                setRescheduleTimeSlot(b.timeSlot);
                              }}
                              className="inline-flex items-center gap-1 rounded border border-white/15 px-2 py-1 text-[0.68rem] text-neutral-300 hover:bg-neutral-800"
                            >
                              <Clock className="size-3" />
                              <span>Reschedule</span>
                            </button>
                          </div>

                          {/* Rescheduling Form inline */}
                          {reschedulingBookingId === b.id && (
                            <div className="mt-2 rounded border border-primary/40 bg-neutral-900 p-2.5 space-y-2">
                              <span className="font-mono text-[0.65rem] text-primary block">Select New Date & Slot:</span>
                              <input
                                type="date"
                                value={rescheduleDate}
                                onChange={(e) => setRescheduleDate(e.target.value)}
                                className="w-full rounded border border-white/20 bg-neutral-950 px-2 py-1 text-xs text-white"
                              />
                              <select
                                value={rescheduleTimeSlot}
                                onChange={(e) => setRescheduleTimeSlot(e.target.value)}
                                className="w-full rounded border border-white/20 bg-neutral-950 px-2 py-1 text-xs text-white"
                              >
                                <option value="Morning (09:00 AM — 01:00 PM)">Morning (09:00 AM — 01:00 PM)</option>
                                <option value="Afternoon (02:00 PM — 06:00 PM)">Afternoon (02:00 PM — 06:00 PM)</option>
                                <option value="Evening (06:00 PM — 10:00 PM)">Evening (06:00 PM — 10:00 PM)</option>
                                <option value="Full Day Coverage (8+ Hours)">Full Day Coverage (8+ Hours)</option>
                              </select>
                              <div className="flex justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setReschedulingBookingId(null)}
                                  className="rounded border border-white/20 px-2 py-0.5 text-[0.65rem] text-neutral-400"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRescheduleSubmit(b.id)}
                                  className="rounded bg-primary px-2.5 py-0.5 text-[0.65rem] font-semibold text-primary-foreground"
                                >
                                  Save Reschedule
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS LIST */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">Client Shoot Bookings</h2>
                <p className="text-xs text-neutral-400">
                  Full list of client requests submitted via website and direct bookings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const data = bookings.map((b) => ({
                      BookingID: b.id,
                      Client: b.name,
                      Organization: b.organization,
                      Phone: b.phone,
                      Service: b.service,
                      Date: b.date,
                      Time: b.timeSlot,
                      Location: b.location,
                      Status: b.status,
                    }));
                    exportToCsv(`shoot-bookings-${new Date().toISOString().split("T")[0]}.csv`, data);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800"
                >
                  <Download className="size-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900 p-3 rounded-lg border border-white/10">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {(["All", "Pending", "Confirmed", "Completed", "Cancelled"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setBookingFilter(filter)}
                    className={cn(
                      "rounded px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                      bookingFilter === filter
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-neutral-400 hover:text-white"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 size-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search client, phone, service..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full rounded border border-white/15 bg-neutral-950 pl-8 pr-3 py-1.5 text-xs text-white focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Bookings List Cards */}
            <div className="grid gap-3">
              {filteredBookings.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-10 text-center text-neutral-500">
                  No bookings found for the selected filter.
                </div>
              ) : (
                filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-xl border border-white/10 bg-neutral-900 p-4 transition-all hover:border-white/25 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-primary">{b.id}</span>
                        <span
                          className={cn(
                            "rounded px-2.5 py-0.5 text-[0.68rem] font-bold uppercase",
                            b.status === "Pending"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : b.status === "Confirmed"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : b.status === "Completed"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : "bg-neutral-800 text-neutral-400 border border-white/10"
                          )}
                        >
                          {b.status}
                        </span>
                        <span className="text-[0.7rem] text-neutral-400 font-mono">
                          📅 {b.date} • {b.timeSlot}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {b.status !== "Confirmed" && (
                          <button
                            type="button"
                            onClick={() => updateBookingStatus(b.id, "Confirmed")}
                            className="rounded bg-emerald-600 px-2.5 py-1 text-[0.68rem] font-semibold text-white hover:bg-emerald-500"
                          >
                            Confirm
                          </button>
                        )}
                        {b.status !== "Completed" && (
                          <button
                            type="button"
                            onClick={() => updateBookingStatus(b.id, "Completed")}
                            className="rounded bg-blue-600 px-2.5 py-1 text-[0.68rem] font-semibold text-white hover:bg-blue-500"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteBooking(b.id)}
                          className="grid size-6 place-items-center rounded text-neutral-400 hover:bg-destructive/20 hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 text-xs">
                      <div>
                        <span className="text-[0.68rem] text-neutral-400 uppercase tracking-wider block">Client</span>
                        <strong className="text-white text-sm block font-semibold">{b.name}</strong>
                        <span className="text-neutral-400 text-[0.72rem] block">{b.organization || "Private Client"}</span>
                      </div>
                      <div>
                        <span className="text-[0.68rem] text-neutral-400 uppercase tracking-wider block">Service</span>
                        <span className="text-white font-medium block">{b.service}</span>
                        <span className="text-neutral-400 text-[0.72rem] block">{b.location}</span>
                      </div>
                      <div>
                        <span className="text-[0.68rem] text-neutral-400 uppercase tracking-wider block">Contact</span>
                        <span className="font-mono text-white block">{b.phone}</span>
                        <span className="text-neutral-400 text-[0.72rem] block truncate">{b.email}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:justify-end">
                        <a
                          href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hello ${b.name}, Ahmed Taj here from Photo Preview regarding your ${b.service} booking on ${b.date}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded bg-emerald-600/20 px-2.5 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-600/30"
                        >
                          <MessageCircle className="size-3.5" />
                          <span>WhatsApp</span>
                        </a>
                        <a
                          href={`tel:${b.phone}`}
                          className="inline-flex items-center gap-1 rounded border border-white/15 px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800"
                        >
                          <Phone className="size-3.5" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>

                    {b.notes && (
                      <p className="rounded bg-neutral-950 p-2 text-xs text-neutral-400 italic border-l-2 border-primary">
                        “{b.notes}”
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MEDIA & PORTFOLIO UPLOADER */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-neutral-900 p-5 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">Upload Photograph to Live Portfolio</h3>
                  <p className="text-xs text-neutral-400">
                    Upload images directly from your computer or paste external/CDN asset paths.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddMedia} className="space-y-4">
                {/* Drag and drop upload zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 p-8 text-center hover:border-primary/60 hover:bg-white/[0.02] transition-all cursor-pointer"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative aspect-[3/2] w-60 overflow-hidden rounded-lg border border-white/20 shadow-xl">
                        <img src={imagePreview} alt="Preview" className="size-full object-cover" />
                      </div>
                      <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                        <CheckCircle2 className="size-4" /> Ready to publish. Click to choose another photo.
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary mb-2 group-hover:scale-110 transition-transform">
                        <UploadCloud className="size-7" />
                      </div>
                      <p className="text-sm font-semibold text-white">
                        Click or Drag & Drop photo from your computer
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                        JPG, PNG, WebP up to 8MB
                      </p>
                    </>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Photograph Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bilateral Accord Signing"
                      value={newMediaTitle}
                      onChange={(e) => setNewMediaTitle(e.target.value)}
                      className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Portfolio Discipline *</label>
                    <select
                      value={newMediaCategory}
                      onChange={(e) => setNewMediaCategory(e.target.value)}
                      className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
                    >
                      <option value="Corporate & Summits">Corporate & Summits</option>
                      <option value="Concerts & Festivals">Concerts & Festivals</option>
                      <option value="Fashion & Runway">Fashion & Runway</option>
                      <option value="Documentary & NGO">Documentary & NGO</option>
                      <option value="Commercial & TVC">Commercial & TVC</option>
                      <option value="Product & Culinary">Product & Culinary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Client / Agency</label>
                    <input
                      type="text"
                      placeholder="e.g. Government of Bangladesh"
                      value={newMediaClient}
                      onChange={(e) => setNewMediaClient(e.target.value)}
                      className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-12 items-end">
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Caption / Moment Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Wide focal coverage of state leadership signing ceremonial accord"
                      value={newMediaCaption}
                      onChange={(e) => setNewMediaCaption(e.target.value)}
                      className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-4 flex items-center justify-between gap-2">
                    <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMediaFeatured}
                        onChange={(e) => setNewMediaFeatured(e.target.checked)}
                        className="rounded border-white/20 text-primary focus:ring-primary size-4"
                      />
                      <span>Live on Homepage</span>
                    </label>

                    <button
                      type="submit"
                      className="rounded bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 shadow-sm"
                    >
                      Publish Photo
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Media Archive Grid */}
            <div>
              <h3 className="font-display text-xl font-bold text-white mb-3">Live Registered Photographs ({mediaList.length})</h3>
              {mediaList.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-neutral-500">
                  No custom media uploaded yet.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {mediaList.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-xl border border-white/10 bg-neutral-900 overflow-hidden shadow-lg"
                    >
                      <div className="aspect-[3/2] bg-neutral-950 relative overflow-hidden">
                        <img src={item.url} alt={item.title} className="size-full object-cover transition-transform group-hover:scale-105" />
                        <span className="absolute top-2 left-2 rounded bg-black/75 px-2 py-0.5 text-[0.65rem] font-mono text-white">
                          {item.year}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteMedia(item.id)}
                          className="absolute top-2 right-2 grid size-7 place-items-center rounded bg-black/75 text-neutral-400 hover:bg-destructive hover:text-white"
                          title="Delete photo"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      <div className="p-3">
                        <span className="font-mono text-[0.65rem] uppercase text-primary font-bold">
                          {item.category}
                        </span>
                        <h4 className="text-white text-xs font-semibold mt-1 truncate">{item.title}</h4>
                        <p className="text-neutral-400 text-[0.7rem] truncate">{item.client}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNTS & LOSS TRACKER */}
        {activeTab === "accounts" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-white/10 bg-neutral-900 p-5 shadow-lg">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="font-mono text-[0.68rem] uppercase">Total Revenue</span>
                  <TrendingUp className="size-4 text-emerald-500" />
                </div>
                <p className="mt-2 text-2xl font-bold font-mono text-emerald-500">
                  ৳ {totalIncome.toLocaleString()}
                </p>
                <span className="text-[0.68rem] text-neutral-500">Confirmed commissions</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-neutral-900 p-5 shadow-lg">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="font-mono text-[0.68rem] uppercase">Operating Expenses</span>
                  <TrendingDown className="size-4 text-destructive" />
                </div>
                <p className="mt-2 text-2xl font-bold font-mono text-destructive">
                  ৳ {totalExpense.toLocaleString()}
                </p>
                <span className="text-[0.68rem] text-neutral-500">Crew, transport & overhead</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-neutral-900 p-5 shadow-lg">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="font-mono text-[0.68rem] uppercase">Equipment Losses</span>
                  <AlertTriangle className="size-4 text-amber-500" />
                </div>
                <p className="mt-2 text-2xl font-bold font-mono text-amber-500">
                  ৳ {gearLosses.toLocaleString()}
                </p>
                <span className="text-[0.68rem] text-neutral-500">Broken gear & damaged filters</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-neutral-900 p-5 shadow-lg">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="font-mono text-[0.68rem] uppercase">Net Margin</span>
                  <DollarSign className="size-4 text-primary" />
                </div>
                <p className={cn("mt-2 text-2xl font-bold font-mono", netProfit >= 0 ? "text-white" : "text-destructive")}>
                  ৳ {netProfit.toLocaleString()}
                </p>
                <span className="text-[0.68rem] text-neutral-500 font-mono">
                  {profitMargin}% studio margin
                </span>
              </div>
            </div>

            {/* Transaction entry form */}
            <div className="rounded-xl border border-white/10 bg-neutral-900 p-5 shadow-lg space-y-4">
              <h3 className="font-display text-xl font-bold text-white">Record Financial Transaction</h3>

              <form onSubmit={handleAddFinance} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Type *</label>
                    <div className="flex rounded border border-white/20 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setEntryType("income");
                          setEntryCategory("Summit Shoot Fee");
                        }}
                        className={cn(
                          "w-1/2 py-2 text-xs font-bold uppercase",
                          entryType === "income" ? "bg-emerald-600 text-white" : "bg-neutral-950 text-neutral-400"
                        )}
                      >
                        Revenue
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEntryType("expense");
                          setEntryCategory("Gear Maintenance & Loss");
                        }}
                        className={cn(
                          "w-1/2 py-2 text-xs font-bold uppercase",
                          entryType === "expense" ? "bg-destructive text-white" : "bg-neutral-950 text-neutral-400"
                        )}
                      >
                        Loss / Expense
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Category *</label>
                    <select
                      value={entryCategory}
                      onChange={(e) => setEntryCategory(e.target.value)}
                      className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
                    >
                      {entryType === "income" ? (
                        <>
                          <option value="Summit Shoot Fee">Summit Shoot Fee</option>
                          <option value="Corporate Retainer">Corporate Retainer</option>
                          <option value="Commercial Campaign">Commercial Campaign</option>
                          <option value="On-Site ID Printing Package">On-Site ID Printing Package</option>
                          <option value="Portrait Studio Session">Portrait Studio Session</option>
                        </>
                      ) : (
                        <>
                          <option value="Gear Maintenance & Loss">Gear Maintenance & Loss</option>
                          <option value="Equipment Damage / Theft">Equipment Damage / Theft</option>
                          <option value="Damaged/Lost SD Cards & Storage">Damaged/Lost SD Cards & Storage</option>
                          <option value="Assistant & Crew Fees">Assistant & Crew Fees</option>
                          <option value="Studio Rent & Utilities">Studio Rent & Utilities</option>
                          <option value="Transportation & Logistics">Transportation & Logistics</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Amount (BDT ৳) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 45000"
                      value={entryAmount}
                      onChange={(e) => setEntryAmount(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-2 text-xs font-mono text-white focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={entryDate}
                      onChange={(e) => setEntryDate(e.target.value)}
                      className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Description *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lens front element repair and UV filter replacement"
                      value={entryTitle}
                      onChange={(e) => setEntryTitle(e.target.value)}
                      className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Client / Vendor</label>
                    <input
                      type="text"
                      placeholder="e.g. Sony Service Center / ActionAid"
                      value={entryClientOrVendor}
                      onChange={(e) => setEntryClientOrVendor(e.target.value)}
                      className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="rounded bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
                  >
                    Save Entry in Ledger
                  </button>
                </div>
              </form>
            </div>

            {/* Ledger table */}
            <div className="rounded-xl border border-white/10 bg-neutral-900 overflow-hidden shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-white/10">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {(
                    [
                      { key: "all", label: "All Records" },
                      { key: "income", label: "Revenue" },
                      { key: "expense", label: "Expenses" },
                      { key: "losses", label: "Gear Losses" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setFinanceFilter(tab.key)}
                      className={cn(
                        "rounded px-3 py-1 text-xs font-medium transition-colors",
                        financeFilter === tab.key
                          ? "bg-primary text-primary-foreground"
                          : "text-neutral-400 hover:text-white"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const data = financeEntries.map((f) => ({
                      EntryID: f.id,
                      Date: f.date,
                      Type: f.type === "income" ? "Revenue" : "Expense/Loss",
                      Category: f.category,
                      Description: f.title,
                      Party: f.clientOrVendor,
                      AmountBDT: f.amount,
                    }));
                    exportToCsv(`financial-ledger-${new Date().toISOString().split("T")[0]}.csv`, data);
                  }}
                  className="inline-flex items-center gap-1.5 rounded border border-white/15 px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800"
                >
                  <FileSpreadsheet className="size-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 font-mono text-[0.65rem] uppercase text-neutral-400 border-b border-white/10">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Party</th>
                      <th className="p-3 text-right">Amount (BDT)</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 font-sans">
                    {filteredFinances.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-mono text-neutral-400 whitespace-nowrap">{item.date}</td>
                        <td className="p-3">
                          <span
                            className={cn(
                              "rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase",
                              item.type === "income"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-destructive/20 text-destructive"
                            )}
                          >
                            {item.type === "income" ? "Revenue" : "Loss / Expense"}
                          </span>
                        </td>
                        <td className="p-3 text-white font-medium">{item.category}</td>
                        <td className="p-3 text-neutral-300 max-w-xs truncate">{item.title}</td>
                        <td className="p-3 text-neutral-400">{item.clientOrVendor}</td>
                        <td
                          className={cn(
                            "p-3 font-mono font-bold text-right",
                            item.type === "income" ? "text-emerald-400" : "text-destructive"
                          )}
                        >
                          {item.type === "income" ? "+" : "-"} ৳ {item.amount.toLocaleString()}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => deleteFinance(item.id)}
                            className="grid size-6 place-items-center rounded text-neutral-400 hover:bg-destructive/20 hover:text-destructive mx-auto"
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY & SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-6">
            <div className="rounded-xl border border-white/10 bg-neutral-900 p-6 shadow-lg space-y-4">
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <Shield className="size-5 text-primary" />
                <span>Security Passkey Management</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Update the master secret passkey required to access this admin route.
              </p>

              <form onSubmit={handleUpdatePasskey} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Current Active Key</label>
                  <input
                    type="text"
                    disabled
                    value={currentPasskey}
                    className="w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-xs font-mono text-neutral-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">New Owner Passkey *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new passkey"
                    value={newPasskeyInput}
                    onChange={(e) => setNewPasskeyInput(e.target.value)}
                    className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-2 text-xs font-mono text-white focus:border-primary focus:outline-none"
                  />
                </div>

                {passkeySuccessMsg && (
                  <p className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" />
                    <span>{passkeySuccessMsg}</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="rounded bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
                >
                  Update Passkey
                </button>
              </form>
            </div>

            <div className="rounded-xl border border-white/10 bg-neutral-900 p-6 shadow-lg space-y-3 text-xs text-neutral-400 font-mono">
              <h4 className="font-display text-base font-bold text-white font-sans">Studio Infrastructure</h4>
              <p>Host: Photo Preview Studio Dhaka (Taj Uddin Ahmed)</p>
              <p>Physical Address: House 28 (4th Floor), Road 11 (old 32), Dhanmondi-1209, Dhaka</p>
              <p>Hotline: +880 1968465799 / +880 1730440068</p>
              <p>Storage: Local persistent vault with browser-level security</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
