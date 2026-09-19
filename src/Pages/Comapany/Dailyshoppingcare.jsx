import { useMemo, useRef, useState } from "react";
import {
  ShoppingBag,
  Truck,
  RotateCcw,
  CreditCard,
  User,
  Store,
  Phone,
  Mail,
  Clock,
  Search,
  ChevronDown,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Contact info — ekhane apnar asol info boshao                       */
/* ------------------------------------------------------------------ */
const CONTACT = {
  phone: "+880 1898-932489",
  phoneLink: "+8801898932489",
  email: "luckyshoppingmallbd@gmail.com",
  hours: "Every day, 10:00 AM – 8:00 PM",
};

/* ------------------------------------------------------------------ */
/*  Help topics + FAQ — text gulo apnar policy onujayi bodle nio       */
/* ------------------------------------------------------------------ */
const CATEGORIES = [
  {
    id: "orders",
    title: "Orders",
    desc: "Place, track or cancel",
    icon: ShoppingBag,
    faqs: [
      {
        q: "How do I place an order?",
        a: "Add the products you like to your cart, go to checkout, confirm your delivery address and choose a payment method. You will see an order confirmation right after.",
      },
      {
        q: "How can I track my order?",
        a: "Log in to your account and open My Orders. Every order shows its current status, from Pending and Approved to Out for Delivery and Delivered.",
      },
      {
        q: "Can I cancel my order?",
        a: "You can cancel an order while it is still Pending. Once it has been approved and handed over for delivery, please contact our support team.",
      },
    ],
  },
  {
    id: "delivery",
    title: "Delivery",
    desc: "Time, charges and address",
    icon: Truck,
    faqs: [
      {
        q: "How long does delivery take?",
        a: "Delivery time depends on your location and the seller. The estimated time is shown on the product page and at checkout.",
      },
      {
        q: "How much is the delivery charge?",
        a: "The delivery charge is calculated at checkout based on your area. Some products and promotions come with free shipping.",
      },
      {
        q: "Can I change my delivery address?",
        a: "You can change the address before the order is approved. After that, please call or email us as early as possible.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    desc: "Wrong or damaged items",
    icon: RotateCcw,
    faqs: [
      {
        q: "How do I return a product?",
        a: "Open the delivered order in My Orders and choose Return. Tell us the reason, add a note if needed, and our team will guide you through the next steps.",
      },
      {
        q: "When will I get my refund?",
        a: "After the returned product is received and checked, the refund is processed to your wallet or original payment method.",
      },
      {
        q: "What if I received a damaged or wrong item?",
        a: "Please contact us right away with your order number and a photo of the product. We will arrange a replacement or refund.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    desc: "Methods and wallet",
    icon: CreditCard,
    faqs: [
      {
        q: "Which payment methods are available?",
        a: "You can pay with Cash on Delivery, bKash or your DailyShopping wallet balance, depending on the product and seller.",
      },
      {
        q: "Is online payment safe?",
        a: "Yes. Online payments are processed through the payment provider's secure checkout, and we never store your PIN or password.",
      },
    ],
  },
  {
    id: "account",
    title: "Account",
    desc: "Login and profile",
    icon: User,
    faqs: [
      {
        q: "I forgot my password. What should I do?",
        a: "On the login page choose Forgot Your Password and follow the steps to set a new one.",
      },
      {
        q: "How do I update my phone number or address?",
        a: "Go to your profile after logging in. You can edit your name, phone number and saved addresses there.",
      },
    ],
  },
  {
    id: "selling",
    title: "Selling",
    desc: "Open your own shop",
    icon: Store,
    faqs: [
      {
        q: "How can I become a seller?",
        a: "Click Start Selling at the top of the page, create your seller account and add your shop details. You can upload products right after your account is ready.",
      },
      {
        q: "How do sellers get paid?",
        a: "After an order is delivered, the seller's earning is added to the seller wallet, and you can send a withdraw request from your seller panel.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */
function FaqItem({ q, a, open, onToggle }) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 md:px-6 md:py-5 hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-900 text-sm md:text-base">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform duration-300 ${
            open ? "rotate-180 text-green-600" : ""
          }`}
        />
      </button>

      {/* height animation with grid rows */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 md:px-6 md:pb-6 text-sm leading-relaxed text-slate-600">{a}</p>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon: Icon, label, value, href }) {
  const body = (
    <>
      <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center shrink-0">
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="font-semibold text-slate-900 break-words">{value}</p>
      </div>
    </>
  );

  const cls =
    "flex items-center gap-4 bg-white rounded-2xl border border-slate-200 p-5 transition";

  return href ? (
    <a href={href} className={`${cls} hover:border-green-500 hover:shadow-md`}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function DailyShoppingCare() {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState(null);
  const faqRef = useRef(null);

  const active = CATEGORIES.find((c) => c.id === activeId);
  const searching = query.trim().length > 0;

  // Search korle shob category theke, na korle selected category er FAQ
  const visibleFaqs = useMemo(() => {
    if (!searching) return active.faqs.map((f, i) => ({ ...f, key: `${active.id}-${i}` }));

    const q = query.trim().toLowerCase();
    return CATEGORIES.flatMap((c) =>
      c.faqs.map((f, i) => ({ ...f, key: `${c.id}-${i}` }))
    ).filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [active, query, searching]);

  const selectCategory = (id) => {
    setActiveId(id);
    setQuery("");
    setOpenKey(null);
    faqRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {/* ---------------- Hero ---------------- */}
      <section className="bg-gradient-to-b from-green-50 via-white to-slate-50 border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-green-700 bg-green-100 px-4 py-1.5 rounded-full">
            DailyShopping Care
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            How can we help you?
          </h1>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            Find quick answers about your orders, delivery, payments and more, or talk to our team.
          </p>

          <div className="relative max-w-xl mx-auto mt-8">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpenKey(null);
              }}
              placeholder="Search for help, e.g. refund, delivery, bKash..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm shadow-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 space-y-12 md:space-y-16">
        {/* ---------------- Help topics ---------------- */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-5">Browse help topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {CATEGORIES.map(({ id, title, desc, icon: Icon }) => {
              const isActive = !searching && id === activeId;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectCategory(id)}
                  className={`group text-left bg-white rounded-2xl border p-4 md:p-5 transition-all hover:shadow-md ${
                    isActive
                      ? "border-green-600 ring-4 ring-green-600/10"
                      : "border-slate-200 hover:border-green-500"
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      isActive
                        ? "bg-green-600 text-white"
                        : "bg-green-50 text-green-700 group-hover:bg-green-100"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <p className="font-bold text-slate-900">{title}</p>
                  <p className="text-xs md:text-sm text-slate-500 mt-0.5">{desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section ref={faqRef} className="scroll-mt-24">
          <div className="flex items-end justify-between gap-3 mb-5">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              {searching ? `Results for “${query.trim()}”` : active.title}
            </h2>
            {!searching && (
              <span className="text-xs font-semibold text-slate-400">
                {active.faqs.length} questions
              </span>
            )}
          </div>

          {visibleFaqs.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center">
              <p className="font-semibold text-slate-700">No answers found</p>
              <p className="text-sm text-slate-500 mt-1">
                Try a different word, or contact our team below.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
              {visibleFaqs.map((f) => (
                <FaqItem
                  key={f.key}
                  q={f.q}
                  a={f.a}
                  open={openKey === f.key}
                  onToggle={() => setOpenKey(openKey === f.key ? null : f.key)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ---------------- Contact ---------------- */}
        <section>
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">Still need help?</h2>
            <p className="text-slate-500 mt-1">Our support team is happy to help you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            <ContactCard
              icon={Phone}
              label="Call us"
              value={CONTACT.phone}
              href={`tel:${CONTACT.phoneLink}`}
            />
            <ContactCard
              icon={Mail}
              label="Email us"
              value={CONTACT.email}
              href={`mailto:${CONTACT.email}`}
            />
            <ContactCard icon={Clock} label="Support hours" value={CONTACT.hours} />
          </div>
        </section>
      </div>
    </div>
  );
}
