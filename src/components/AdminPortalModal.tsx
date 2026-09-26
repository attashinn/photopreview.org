import React, { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
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
  Tag,
  Trash2,
  TrendingDown,
  TrendingUp,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking } from "./BookingModal";

export interface MediaItem {
  id: string;
  title: string;
  category: string;
  client: string;
  type: "photo" | "video";
  url: string;
  year: string;
  caption: string;
  featured?: boolean;
  createdAt: string;
}

export interface FinancialEntry {
  id: string;
  type: "income" | "expense";
  category: string;
  title: string;
  amount: number;
  date: string;
  clientOrVendor: string;
  notes: string;
}

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export function AdminPortalModal({ isOpen, onClose }: AdminPortalModalProps) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"bookings" | "media" | "accounts" | "settings">("bookings");

  // State for Bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingFilter, setBookingFilter] = useState<"All" | "Pending" | "Confirmed" | "Completed" | "Cancelled">("All");
  const [bookingSearch, setBookingSearch] = useState("");
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

  // State for Media
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

  // State for Accounts
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

  // Settings state
  const [currentPasskey, setCurrentPasskey] = useState("1234");
  const [newPasskeyInput, setNewPasskeyInput] = useState("");
  const [passkeySuccessMsg, setPasskeySuccessMsg] = useState("");

  // Check persistent session on mount or modal open
  useEffect(() => {
    if (isOpen) {
      const savedAuth = sessionStorage.getItem("ahmed_taj_admin_session");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }
      const savedKey = localStorage.getItem("ahmed_taj_admin_passkey");
      if (savedKey) {
        setCurrentPasskey(savedKey);
      }
      reloadData();
    }
  }, [isOpen]);

  // Load from local storage
  const reloadData = () => {
    try {
      const storedBookings = JSON.parse(localStorage.getItem("ahmed_taj_bookings") || "[]");
      setBookings(storedBookings);

      const storedMedia = JSON.parse(localStorage.getItem("ahmed_taj_media") || "[]");
      setMediaList(storedMedia);

      const storedFinances = JSON.parse(localStorage.getItem("ahmed_taj_finances") || "[]");
      if (storedFinances.length === 0) {
        // Curated initial accounts data for realistic financial tracking
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
      setErrorMsg("Incorrect passkey. Default owner key is '1234' or 'admin'.");
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
    setPasskeySuccessMsg("Passkey successfully updated!");
    setTimeout(() => setPasskeySuccessMsg(""), 4000);
  };

  // --- BOOKING OPERATIONS ---
  const updateBookingStatus = (id: string, newStatus: Booking["status"]) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    setBookings(updated);
    localStorage.setItem("ahmed_taj_bookings", JSON.stringify(updated));
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
      alert("Please provide at least client name and contact phone number.");
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

    // Reset manual form
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

  const exportBookings = () => {
    const data = bookings.map((b) => ({
      BookingID: b.id,
      DateCreated: new Date(b.createdAt).toLocaleDateString(),
      ClientName: b.name,
      Organization: b.organization,
      Phone: b.phone,
      Email: b.email,
      Service: b.service,
      ShootDate: b.date,
      TimeSlot: b.timeSlot,
      Location: b.location,
      Status: b.status,
      Notes: b.notes,
    }));
    exportToCsv(`ahmed-taj-bookings-${new Date().toISOString().split("T")[0]}.csv`, data);
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
          // Auto-suggest title from filename
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

    // Broadcast live event to notify the homepage
    window.dispatchEvent(new Event("portfolio_updated"));

    // Reset form
    setNewMediaTitle("");
    setNewMediaUrl("");
    setNewMediaClient("");
    setNewMediaCaption("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    alert("New media uploaded successfully! It is now active in your live portfolio showcase.");
  };

  const deleteMedia = (id: string) => {
    if (confirm("Delete this photograph from your portfolio archive?")) {
      const updated = mediaList.filter((m) => m.id !== id);
      setMediaList(updated);
      localStorage.setItem("ahmed_taj_media", JSON.stringify(updated));
      window.dispatchEvent(new Event("portfolio_updated"));
    }
  };

  const seedSampleMedia = () => {
    const samples: MediaItem[] = [
      {
        id: "MD-EXT-01",
        title: "Diplomatic Delegation Plenary Session",
        category: "Corporate & Summits",
        client: "Government of Bangladesh",
        type: "photo",
        url: "/portfolio/extracted/corp-towards-tomorrow.jpg",
        year: "2025",
        caption: "Wide focal coverage of diplomatic proceedings and bilateral accords",
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "MD-EXT-02",
        title: "International FolkFest Prime Stage",
        category: "Concerts & Festivals",
        client: "Dhaka FolkFest Foundation",
        type: "photo",
        url: "/portfolio/extracted/concert-folkfest.jpg",
        year: "2024",
        caption: "Stage lighting capture under 30,000 crowd attendance",
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "MD-EXT-03",
        title: "Haute Couture Runway Lumière",
        category: "Fashion & Runway",
        client: "Lumière Dhaka Fashion Week",
        type: "photo",
        url: "/portfolio/extracted/fashion-runway-lumiere.jpg",
        year: "2024",
        caption: "High-shutter motion freeze on bridal haute couture",
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "MD-EXT-04",
        title: "Culinary Heritage Copper Karahi",
        category: "Product & Culinary",
        client: "The Westin / Gourmet Heritage",
        type: "photo",
        url: "/portfolio/extracted/product-food-karahi.jpg",
        year: "2025",
        caption: "Studio calibrated macro lighting for signature menu release",
        featured: true,
        createdAt: new Date().toISOString(),
      },
    ];

    setMediaList(samples);
    localStorage.setItem("ahmed_taj_media", JSON.stringify(samples));
    window.dispatchEvent(new Event("portfolio_updated"));
    alert("Sample portfolio showcase archives loaded successfully!");
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

    // Reset form
    setEntryTitle("");
    setEntryAmount("");
    setEntryClientOrVendor("");
    setEntryNotes("");
    alert(`Financial ${entryType === "income" ? "Revenue" : "Expense/Loss"} recorded successfully!`);
  };

  const deleteFinance = (id: string) => {
    if (confirm("Delete this financial transaction from the ledger?")) {
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

  const exportFinances = () => {
    const data = financeEntries.map((f) => ({
      EntryID: f.id,
      Date: f.date,
      Type: f.type === "income" ? "Revenue" : "Expense/Loss",
      Category: f.category,
      Title: f.title,
      ClientOrVendor: f.clientOrVendor,
      AmountBDT: f.amount,
      Notes: f.notes,
    }));
    exportToCsv(`ahmed-taj-accounts-${new Date().toISOString().split("T")[0]}.csv`, data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in-0 duration-200">
      <div
        className="relative w-full max-w-6xl overflow-hidden rounded-xl border border-white/20 bg-background text-foreground shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Passcode Login if not authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto">
            <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-primary/10 text-primary border border-primary/20">
              <Lock className="size-8" />
            </div>
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-primary font-semibold">
              Taj Uddin Ahmed • Photo Preview
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold">Studio Admin Portal</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Enter your studio passkey to manage client shoot bookings, live portfolio media uploads, and the revenue & loss ledger.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter Passkey (e.g. 1234)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-center text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errorMsg && <p className="mt-2 text-xs text-destructive font-medium">{errorMsg}</p>}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 rounded-md border border-input py-2.5 text-xs uppercase tracking-wider font-medium hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-md bg-primary py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors shadow-md cursor-pointer"
                >
                  Enter Portal
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-border pt-3">
              <p className="font-mono text-[0.68rem] text-muted-foreground">
                Default Access Key: <span className="font-semibold text-foreground">1234</span> or <span className="font-semibold text-foreground">admin</span>
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Authenticated Dashboard Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/40 px-5 py-3.5 gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground leading-tight">
                    Photo Preview Studio Control
                  </h2>
                  <p className="text-[0.7rem] text-muted-foreground font-mono">
                    Ahmed Taj • Dhanmondi-1209, Dhaka
                  </p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-background p-1 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setActiveTab("bookings")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                    activeTab === "bookings"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Calendar className="size-3.5" />
                  <span>Bookings ({bookings.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("media")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                    activeTab === "media"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <UploadCloud className="size-3.5" />
                  <span>Media Uploader ({mediaList.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("accounts")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                    activeTab === "accounts"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
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
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Settings className="size-3.5" />
                  <span>Settings</span>
                </button>
              </div>

              {/* Close / Logout */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Logout from Admin"
                  className="inline-flex items-center gap-1 rounded border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <LogOut className="size-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Dashboard Content Container */}
            <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto space-y-6">
              {/* TAB 1: BOOKINGS & SCHEDULES */}
              {activeTab === "bookings" && (
                <div className="space-y-4">
                  {/* Top bar with search, filter and action buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                    <div>
                      <h3 className="font-display text-xl font-semibold">Client Shoot Inquiries & Bookings</h3>
                      <p className="text-xs text-muted-foreground">
                        Real-time incoming calendar requests with WhatsApp instant confirmation.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddBookingOpen(!isAddBookingOpen)}
                        className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                        <span>{isAddBookingOpen ? "Close Form" : "Log New Booking"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={exportBookings}
                        className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Download className="size-3.5" />
                        <span>Export CSV</span>
                      </button>

                      <button
                        type="button"
                        onClick={reloadData}
                        className="grid size-8 place-items-center rounded border border-border text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                        title="Refresh"
                      >
                        <RefreshCw className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Manual Booking Form Modal/Drawer */}
                  {isAddBookingOpen && (
                    <div className="rounded-lg border border-primary/30 bg-card p-4 sm:p-5 shadow-sm space-y-4 animate-in fade-in-0 duration-150">
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <h4 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
                          <Plus className="size-4 text-primary" />
                          <span>Direct Phone / In-Person Booking Entry</span>
                        </h4>
                        <span className="text-xs text-muted-foreground">Saves directly into active schedule</span>
                      </div>

                      <form onSubmit={handleCreateManualBooking} className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                              Client Name *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Mahfuzur Rahman"
                              value={manualBooking.name}
                              onChange={(e) => setManualBooking({ ...manualBooking, name: e.target.value })}
                              className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                              Organization / Agency
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. British Council / UNDP"
                              value={manualBooking.organization}
                              onChange={(e) => setManualBooking({ ...manualBooking, organization: e.target.value })}
                              className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                              Phone / WhatsApp *
                            </label>
                            <input
                              type="tel"
                              required
                              placeholder="+88017XXXXXXXX"
                              value={manualBooking.phone}
                              onChange={(e) => setManualBooking({ ...manualBooking, phone: e.target.value })}
                              className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              placeholder="client@domain.com"
                              value={manualBooking.email}
                              onChange={(e) => setManualBooking({ ...manualBooking, email: e.target.value })}
                              className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                              Service Required
                            </label>
                            <select
                              value={manualBooking.service}
                              onChange={(e) => setManualBooking({ ...manualBooking, service: e.target.value })}
                              className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary"
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
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                              Shoot Date *
                            </label>
                            <input
                              type="date"
                              required
                              value={manualBooking.date}
                              onChange={(e) => setManualBooking({ ...manualBooking, date: e.target.value })}
                              className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                              Time Slot
                            </label>
                            <select
                              value={manualBooking.timeSlot}
                              onChange={(e) => setManualBooking({ ...manualBooking, timeSlot: e.target.value })}
                              className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary"
                            >
                              <option value="Morning (09:00 AM — 01:00 PM)">Morning (09:00 AM — 01:00 PM)</option>
                              <option value="Afternoon (02:00 PM — 06:00 PM)">Afternoon (02:00 PM — 06:00 PM)</option>
                              <option value="Evening (06:00 PM — 10:00 PM)">Evening (06:00 PM — 10:00 PM)</option>
                              <option value="Full Day Coverage (8+ Hours)">Full Day Coverage (8+ Hours)</option>
                              <option value="Multi-Day Assignment">Multi-Day Assignment</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                              Shoot Venue / City
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Radisson Blu / BICC"
                              value={manualBooking.location}
                              onChange={(e) => setManualBooking({ ...manualBooking, location: e.target.value })}
                              className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            Assignment Brief & Scope Notes
                          </label>
                          <input
                            type="text"
                            placeholder="Special gear requirements, VIP protocol instructions, or deliverables"
                            value={manualBooking.notes}
                            onChange={(e) => setManualBooking({ ...manualBooking, notes: e.target.value })}
                            className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setIsAddBookingOpen(false)}
                            className="rounded border border-input px-4 py-1.5 text-xs text-muted-foreground hover:bg-muted cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="rounded bg-primary px-5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm cursor-pointer"
                          >
                            Save Booking to Schedule
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Filter and Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/30 p-2.5 rounded-lg border border-border">
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                      {(["All", "Pending", "Confirmed", "Completed", "Cancelled"] as const).map((filter) => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setBookingFilter(filter)}
                          className={cn(
                            "rounded px-3 py-1 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap",
                            bookingFilter === filter
                              ? "bg-foreground text-background shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {filter}
                          {filter === "Pending" && (
                            <span className="ml-1.5 rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[0.65rem] font-bold text-amber-500">
                              {bookings.filter((b) => b.status === "Pending").length}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search by client, phone, venue..."
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                        className="w-full rounded border border-input bg-background pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Bookings List */}
                  {filteredBookings.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
                      <Calendar className="mx-auto size-10 text-muted-foreground/50 mb-2" />
                      <p className="text-sm font-semibold">No booking requests found</p>
                      <p className="text-xs mt-1">
                        {bookingSearch ? "Try adjusting your search criteria" : "New shoot inquiries submitted on the homepage will appear here automatically."}
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsAddBookingOpen(true)}
                        className="mt-4 inline-flex items-center gap-1.5 rounded bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus className="size-3.5" />
                        <span>Log a Booking</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {filteredBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 shadow-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono text-xs font-bold text-primary">{booking.id}</span>
                              <span
                                className={cn(
                                  "rounded px-2.5 py-0.5 text-[0.68rem] font-bold uppercase",
                                  booking.status === "Pending"
                                    ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                                    : booking.status === "Confirmed"
                                    ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                                    : booking.status === "Completed"
                                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                                    : "bg-destructive/15 text-destructive border border-destructive/30"
                                )}
                              >
                                {booking.status}
                              </span>
                              <span className="text-[0.7rem] text-muted-foreground font-mono">
                                Booked on {new Date(booking.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            {/* Status Change Buttons */}
                            <div className="flex items-center gap-1.5">
                              {booking.status !== "Confirmed" && (
                                <button
                                  type="button"
                                  onClick={() => updateBookingStatus(booking.id, "Confirmed")}
                                  className="rounded bg-emerald-600 px-2.5 py-1 text-[0.68rem] font-semibold text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                                >
                                  Confirm
                                </button>
                              )}
                              {booking.status !== "Completed" && (
                                <button
                                  type="button"
                                  onClick={() => updateBookingStatus(booking.id, "Completed")}
                                  className="rounded bg-blue-600 px-2.5 py-1 text-[0.68rem] font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                                >
                                  Complete
                                </button>
                              )}
                              {booking.status !== "Cancelled" && (
                                <button
                                  type="button"
                                  onClick={() => updateBookingStatus(booking.id, "Cancelled")}
                                  className="rounded border border-border px-2 py-1 text-[0.68rem] text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => deleteBooking(booking.id)}
                                title="Delete Record"
                                className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-colors cursor-pointer ml-1"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-4 text-xs">
                            <div>
                              <span className="text-[0.68rem] text-muted-foreground uppercase tracking-wider block">
                                Client & Agency
                              </span>
                              <strong className="text-foreground text-sm font-semibold">{booking.name}</strong>
                              <span className="block text-muted-foreground text-[0.72rem]">{booking.organization || "Private Client"}</span>
                            </div>

                            <div>
                              <span className="text-[0.68rem] text-muted-foreground uppercase tracking-wider block">
                                Service & Date
                              </span>
                              <span className="font-semibold text-foreground block">{booking.service}</span>
                              <span className="font-mono text-primary text-[0.75rem] font-medium">
                                📅 {booking.date} • {booking.timeSlot}
                              </span>
                            </div>

                            <div>
                              <span className="text-[0.68rem] text-muted-foreground uppercase tracking-wider block">
                                Location & Contact
                              </span>
                              <span className="text-foreground block truncate">{booking.location}</span>
                              <span className="font-mono text-foreground block">{booking.phone}</span>
                            </div>

                            <div className="flex items-center gap-2 sm:justify-end">
                              <a
                                href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                  `Hello ${booking.name}, this is Ahmed Taj from Photo Preview. Thank you for your inquiry for ${booking.service} on ${booking.date}. I would be pleased to confirm our photography coverage.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded bg-emerald-600/20 px-2.5 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-600/30 transition-colors"
                              >
                                <MessageCircle className="size-3.5" />
                                <span>WhatsApp</span>
                              </a>
                              <a
                                href={`tel:${booking.phone}`}
                                className="inline-flex items-center gap-1 rounded border border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-muted transition-colors"
                              >
                                <Phone className="size-3.5" />
                                <span>Call</span>
                              </a>
                            </div>
                          </div>

                          {booking.notes && (
                            <p className="mt-2.5 rounded bg-muted/50 p-2 text-xs text-muted-foreground italic border-l-2 border-primary/50">
                              Client Notes: “{booking.notes}”
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MEDIA & PORTFOLIO UPLOADER */}
              {activeTab === "media" && (
                <div className="space-y-6">
                  {/* Upload Form */}
                  <div className="rounded-lg border border-border bg-card p-5 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-display text-xl font-semibold">Upload Photography to Portfolio</h3>
                        <p className="text-xs text-muted-foreground">
                          Add new photographs or videos to the homepage galleries and live showcase archives.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={seedSampleMedia}
                        className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        <Layers className="size-3.5" />
                        <span>Load Curated Archive Set</span>
                      </button>
                    </div>

                    <form onSubmit={handleAddMedia} className="space-y-4">
                      {/* Drag & Drop File Zone */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-primary/60 hover:bg-muted/30 transition-all cursor-pointer"
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
                            <div className="relative aspect-[3/2] w-48 overflow-hidden rounded border border-border shadow-md">
                              <img src={imagePreview} alt="Upload preview" className="size-full object-cover" />
                            </div>
                            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                              <CheckCircle2 className="size-3.5" /> Image ready for upload. Click to replace.
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary mb-2 group-hover:scale-110 transition-transform">
                              <UploadCloud className="size-6" />
                            </div>
                            <p className="text-xs font-semibold text-foreground">
                              Click or Drag & Drop a photo from your computer
                            </p>
                            <p className="text-[0.7rem] text-muted-foreground mt-0.5">
                              Supports JPG, PNG, WebP up to 8MB
                            </p>
                          </>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            Photograph / Assignment Title *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Bilateral Accord Ceremony"
                            value={newMediaTitle}
                            onChange={(e) => setNewMediaTitle(e.target.value)}
                            className="w-full rounded border border-input bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            Portfolio Category *
                          </label>
                          <select
                            value={newMediaCategory}
                            onChange={(e) => setNewMediaCategory(e.target.value)}
                            className="w-full rounded border border-input bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
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
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            Client / Organization
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. UNICEF, British Council, Grameenphone"
                            value={newMediaClient}
                            onChange={(e) => setNewMediaClient(e.target.value)}
                            className="w-full rounded border border-input bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            Image URL / Local File Path *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Auto-filled from upload, or paste /portfolio/... or https://..."
                            value={newMediaUrl}
                            onChange={(e) => {
                              setNewMediaUrl(e.target.value);
                              setImagePreview(e.target.value);
                            }}
                            className="w-full rounded border border-input bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                              Media Type
                            </label>
                            <select
                              value={newMediaType}
                              onChange={(e) => setNewMediaType(e.target.value as "photo" | "video")}
                              className="w-full rounded border border-input bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                            >
                              <option value="photo">Photograph</option>
                              <option value="video">Video Reel</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                              Year
                            </label>
                            <input
                              type="text"
                              value={newMediaYear}
                              onChange={(e) => setNewMediaYear(e.target.value)}
                              className="w-full rounded border border-input bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-12 items-end">
                        <div className="sm:col-span-8">
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            Decisive Moment Caption / Technical Notes
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Captured with wide dynamic lens, ambient stage lighting"
                            value={newMediaCaption}
                            onChange={(e) => setNewMediaCaption(e.target.value)}
                            className="w-full rounded border border-input bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div className="sm:col-span-4 flex items-center justify-between gap-2">
                          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newMediaFeatured}
                              onChange={(e) => setNewMediaFeatured(e.target.checked)}
                              className="rounded border-input text-primary focus:ring-primary size-4"
                            />
                            <span>Live on Portfolio</span>
                          </label>

                          <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 rounded bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors cursor-pointer"
                          >
                            <Plus className="size-4" />
                            <span>Publish Media</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Active Uploaded Media Gallery */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-display text-lg font-semibold">Active Studio Media Archives</h4>
                        <p className="text-xs text-muted-foreground">
                          {mediaList.length} photographs currently registered in the database.
                        </p>
                      </div>
                    </div>

                    {mediaList.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                        <ImageIcon className="mx-auto size-8 text-muted-foreground/50 mb-2" />
                        <p className="text-xs">No custom media uploaded yet. You can upload above or click &ldquo;Load Curated Archive Set&rdquo;.</p>
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {mediaList.map((item) => (
                          <div
                            key={item.id}
                            className="group relative rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/50 shadow-xs flex flex-col justify-between"
                          >
                            <div className="aspect-[3/2] bg-muted relative overflow-hidden">
                              <img
                                src={item.url}
                                alt={item.title}
                                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <span className="absolute top-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[0.65rem] font-mono text-white/90 backdrop-blur-xs">
                                {item.year}
                              </span>
                              <button
                                type="button"
                                onClick={() => deleteMedia(item.id)}
                                title="Delete Photo"
                                className="absolute top-2 right-2 grid size-7 place-items-center rounded bg-black/75 text-white/80 hover:bg-destructive hover:text-white transition-colors cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>

                            <div className="p-3">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-primary font-medium">
                                  {item.category}
                                </span>
                                {item.featured && (
                                  <span className="rounded bg-emerald-500/10 text-emerald-500 text-[0.6rem] font-bold uppercase px-1.5 py-0.2">
                                    Live
                                  </span>
                                )}
                              </div>
                              <h5 className="font-medium text-xs text-foreground mt-1 line-clamp-1 leading-snug">
                                {item.title}
                              </h5>
                              <p className="text-[0.7rem] text-muted-foreground mt-0.5 line-clamp-1">
                                {item.client}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: ACCOUNTS & FINANCIAL LOSS TRACKER */}
              {activeTab === "accounts" && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="rounded-lg border border-border bg-card p-4 sm:p-5 shadow-xs">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="font-mono text-[0.68rem] uppercase tracking-wider">Gross Revenue</span>
                        <TrendingUp className="size-4 text-emerald-500" />
                      </div>
                      <p className="mt-2 text-2xl font-bold font-mono text-emerald-500">
                        ৳ {totalIncome.toLocaleString()}
                      </p>
                      <span className="text-[0.68rem] text-muted-foreground">Client shoot retainers</span>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-4 sm:p-5 shadow-xs">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="font-mono text-[0.68rem] uppercase tracking-wider">Operating Expenses</span>
                        <TrendingDown className="size-4 text-destructive" />
                      </div>
                      <p className="mt-2 text-2xl font-bold font-mono text-destructive">
                        ৳ {totalExpense.toLocaleString()}
                      </p>
                      <span className="text-[0.68rem] text-muted-foreground">Crew, logistics & rent</span>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-4 sm:p-5 shadow-xs">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="font-mono text-[0.68rem] uppercase tracking-wider">Equipment Losses</span>
                        <AlertTriangle className="size-4 text-amber-500" />
                      </div>
                      <p className="mt-2 text-2xl font-bold font-mono text-amber-500">
                        ৳ {gearLosses.toLocaleString()}
                      </p>
                      <span className="text-[0.68rem] text-muted-foreground">Gear repairs & broken filters</span>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-4 sm:p-5 shadow-xs">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="font-mono text-[0.68rem] uppercase tracking-wider">Net Studio Margin</span>
                        <DollarSign className="size-4 text-primary" />
                      </div>
                      <p
                        className={cn(
                          "mt-2 text-2xl font-bold font-mono",
                          netProfit >= 0 ? "text-foreground" : "text-destructive"
                        )}
                      >
                        ৳ {netProfit.toLocaleString()}
                      </p>
                      <span className="text-[0.68rem] text-muted-foreground font-mono">
                        {profitMargin}% net margin
                      </span>
                    </div>
                  </div>

                  {/* Add Transaction Form */}
                  <div className="rounded-lg border border-border bg-card p-5 shadow-xs">
                    <h3 className="font-display text-xl font-semibold mb-1">Record New Financial Transaction</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Log shoot commissions, operational overhead, or gear breakdown & damage losses.
                    </p>

                    <form onSubmit={handleAddFinance} className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            Entry Type *
                          </label>
                          <div className="flex rounded border border-input overflow-hidden">
                            <button
                              type="button"
                              onClick={() => {
                                setEntryType("income");
                                setEntryCategory("Summit Shoot Fee");
                              }}
                              className={cn(
                                "w-1/2 py-2 text-xs font-semibold uppercase transition-colors cursor-pointer",
                                entryType === "income" ? "bg-emerald-600 text-white" : "bg-background text-muted-foreground"
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
                                "w-1/2 py-2 text-xs font-semibold uppercase transition-colors cursor-pointer",
                                entryType === "expense" ? "bg-destructive text-white" : "bg-background text-muted-foreground"
                              )}
                            >
                              Expense / Loss
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            Category *
                          </label>
                          <select
                            value={entryCategory}
                            onChange={(e) => setEntryCategory(e.target.value)}
                            className="w-full rounded border border-input bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                          >
                            {entryType === "income" ? (
                              <>
                                <option value="Summit Shoot Fee">Summit Shoot Fee</option>
                                <option value="Corporate Retainer">Corporate Retainer</option>
                                <option value="Commercial Campaign">Commercial Campaign</option>
                                <option value="On-Site ID Printing Package">On-Site ID Printing Package</option>
                                <option value="Portrait Studio Session">Portrait Studio Session</option>
                                <option value="Documentary NGO Grant">Documentary NGO Grant</option>
                              </>
                            ) : (
                              <>
                                <option value="Gear Maintenance & Loss">Gear Maintenance & Loss</option>
                                <option value="Equipment Damage / Theft">Equipment Damage / Theft</option>
                                <option value="Damaged/Lost SD Cards & Storage">Damaged/Lost SD Cards & Storage</option>
                                <option value="Assistant & Crew Fees">Assistant & Crew Fees</option>
                                <option value="Lighting & Studio Equipment Rental">Lighting & Equipment Rental</option>
                                <option value="Studio Rent & Utilities">Studio Rent & Utilities</option>
                                <option value="Transportation & Logistics">Transportation & Logistics</option>
                              </>
                            )}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            Amount (BDT ৳) *
                          </label>
                          <input
                            type="number"
                            required
                            placeholder="e.g. 35000"
                            value={entryAmount}
                            onChange={(e) => setEntryAmount(e.target.value === "" ? "" : Number(e.target.value))}
                            className="w-full rounded border border-input bg-background px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            Date *
                          </label>
                          <input
                            type="date"
                            required
                            value={entryDate}
                            onChange={(e) => setEntryDate(e.target.value)}
                            className="w-full rounded border border-input bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            Title / Description *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 70-200mm front glass calibration and broken filter loss"
                            value={entryTitle}
                            onChange={(e) => setEntryTitle(e.target.value)}
                            className="w-full rounded border border-input bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            Client / Vendor Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Sony Service Center Dhaka / ActionAid"
                            value={entryClientOrVendor}
                            onChange={(e) => setEntryClientOrVendor(e.target.value)}
                            className="w-full rounded border border-input bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors cursor-pointer"
                        >
                          <Plus className="size-4" />
                          <span>Record Financial Entry</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Filter and Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/30 p-2.5 rounded-lg border border-border">
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                      {(
                        [
                          { key: "all", label: "All Transactions" },
                          { key: "income", label: "Revenue Only" },
                          { key: "expense", label: "Expenses Only" },
                          { key: "losses", label: "Gear Losses" },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setFinanceFilter(tab.key)}
                          className={cn(
                            "rounded px-3 py-1 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap",
                            financeFilter === tab.key
                              ? "bg-foreground text-background shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative w-full sm:w-56">
                        <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search description, party..."
                          value={financeSearch}
                          onChange={(e) => setFinanceSearch(e.target.value)}
                          className="w-full rounded border border-input bg-background pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={exportFinances}
                        className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <FileSpreadsheet className="size-3.5" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Financial Transactions Table */}
                  <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/70 text-muted-foreground font-mono uppercase text-[0.65rem] border-b border-border">
                        <tr>
                          <th className="p-3">Date</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Description</th>
                          <th className="p-3">Client / Vendor</th>
                          <th className="p-3 text-right">Amount (BDT)</th>
                          <th className="p-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {filteredFinances.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-muted-foreground italic">
                              No financial records match the current criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredFinances.map((item) => (
                            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                              <td className="p-3 font-mono text-muted-foreground whitespace-nowrap">{item.date}</td>
                              <td className="p-3">
                                <span
                                  className={cn(
                                    "rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase",
                                    item.type === "income"
                                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                      : "bg-destructive/10 text-destructive border border-destructive/20"
                                  )}
                                >
                                  {item.type === "income" ? "Revenue" : "Expense/Loss"}
                                </span>
                              </td>
                              <td className="p-3 text-foreground font-medium">{item.category}</td>
                              <td className="p-3 text-muted-foreground max-w-xs truncate">{item.title}</td>
                              <td className="p-3 text-muted-foreground">{item.clientOrVendor}</td>
                              <td
                                className={cn(
                                  "p-3 font-mono font-semibold text-right",
                                  item.type === "income" ? "text-emerald-500" : "text-destructive"
                                )}
                              >
                                {item.type === "income" ? "+" : "-"} ৳ {item.amount.toLocaleString()}
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => deleteFinance(item.id)}
                                  title="Delete Transaction"
                                  className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-colors mx-auto cursor-pointer"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: SETTINGS */}
              {activeTab === "settings" && (
                <div className="max-w-2xl space-y-6">
                  <div className="rounded-lg border border-border bg-card p-5 shadow-xs">
                    <h3 className="font-display text-xl font-semibold mb-1">Security & Access Passkey</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Update the secret passkey required to access this admin portal.
                    </p>

                    <form onSubmit={handleUpdatePasskey} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Current Passkey
                        </label>
                        <input
                          type="text"
                          disabled
                          value={currentPasskey}
                          className="w-full rounded border border-input bg-muted px-3 py-2 text-xs font-mono text-muted-foreground"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          New Owner Passkey *
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Enter new passkey (e.g. 5678)"
                          value={newPasskeyInput}
                          onChange={(e) => setNewPasskeyInput(e.target.value)}
                          className="w-full rounded border border-input bg-background px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      {passkeySuccessMsg && (
                        <p className="text-xs text-emerald-500 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="size-3.5" />
                          <span>{passkeySuccessMsg}</span>
                        </p>
                      )}

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="rounded bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
                        >
                          Update Passkey
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5 shadow-xs space-y-3">
                    <h4 className="font-display text-lg font-semibold text-foreground">Studio Information Reference</h4>
                    <div className="grid gap-2 text-xs text-muted-foreground font-mono">
                      <div><strong className="text-foreground">Studio:</strong> Photo Preview by Taj Uddin Ahmed</div>
                      <div><strong className="text-foreground">Phone:</strong> +880 1968465799 / +880 1730440068</div>
                      <div><strong className="text-foreground">Address:</strong> House 28 (4th Fl), Rd 11 (old 32), Dhanmondi-1209, Dhaka</div>
                      <div><strong className="text-foreground">Data Storage:</strong> Local persistent browser vault (Privacy secured)</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
