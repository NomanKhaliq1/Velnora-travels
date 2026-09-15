"use client";

import "flatpickr/dist/flatpickr.min.css";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";

type Panel = "destination" | "travelers" | null;

const iconCircle =
  "text-velnora-gold-luxury text-lg w-10 h-10 rounded-full bg-velnora-gold-luxury/8 flex items-center justify-center shrink-0";
const fieldLabel = "text-[9.5px] font-bold tracking-[1.5px] text-velnora-charcoal/40 mb-1";
const counterButton =
  "w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-velnora-charcoal text-xs hover:bg-velnora-gold-luxury hover:border-velnora-gold-luxury hover:text-white transition";

export function BookingWidget({ destinations }: { destinations: string[] }) {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>(null);
  const [destination, setDestination] = useState("");
  const [filter, setFilter] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [travelersApplied, setTravelersApplied] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    import("flatpickr").then(({ default: flatpickr }) => {
      if (cancelled || !checkInRef.current || !checkOutRef.current) return;
      const outPicker = flatpickr(checkOutRef.current, {
        dateFormat: "d M Y",
        minDate: "today",
        onChange: (_dates, text) => setCheckOut(text),
      });
      const inPicker = flatpickr(checkInRef.current, {
        dateFormat: "d M Y",
        minDate: "today",
        onChange: (dates, text) => {
          setCheckIn(text);
          if (dates[0]) outPicker.set("minDate", dates[0]);
        },
      });
      cleanup = () => {
        inPicker.destroy();
        outPicker.destroy();
      };
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".booking-field-group")) setPanel(null);
    };
    document.addEventListener("click", closeOnOutsideClick);
    return () => document.removeEventListener("click", closeOnOutsideClick);
  }, []);

  const visibleDestinations = destinations.filter((d) => d.toLowerCase().includes(filter.trim().toLowerCase()));
  const travelersText = `${adults} Adult${adults > 1 ? "s" : ""}, ${children} Child${children !== 1 ? "ren" : ""}`;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!destination) return setMessage({ text: "Please select a destination.", ok: false });
    if (!checkIn) return setMessage({ text: "Please select a check-in date.", ok: false });
    if (!checkOut) return setMessage({ text: "Please select a check-out date.", ok: false });

    setMessage({ text: `Request ready for ${destination}. Opening inquiry form...`, ok: true });
    const params = new URLSearchParams({
      destination,
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
    });
    router.push(`/contact?${params}#trip-inquiry`);
  }

  return (
    <form
      onSubmit={submit}
      className="booking-form relative bg-white rounded-[24px] lg:rounded-full p-3.5 lg:pl-10 grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row items-stretch lg:items-center justify-between shadow-2xl border border-black/5 gap-4"
    >
      <div className="booking-field-group relative flex-1 flex items-center gap-4 py-2 px-3">
        <div className={iconCircle}>
          <i className="fa-solid fa-location-dot" />
        </div>
        <div className="flex flex-col w-full">
          <span className={fieldLabel}>DESTINATION</span>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={panel === "destination"}
            onClick={() => setPanel(panel === "destination" ? null : "destination")}
            className="flex items-center justify-between w-full text-left"
          >
            <span className={`text-[14.5px] font-semibold select-none ${destination ? "text-velnora-charcoal" : "text-velnora-charcoal/40"}`}>
              {destination || "Where to?"}
            </span>
            <i
              className={`fa-solid fa-chevron-down text-[10px] text-velnora-charcoal/40 transition-transform duration-300 ml-2 ${panel === "destination" ? "rotate-180" : ""}`}
            />
          </button>
          {panel === "destination" && (
            <div className="widget-dropdown-panel absolute bottom-[calc(100%+20px)] left-0 w-80 bg-white rounded-2xl shadow-2xl border border-black/8 p-4 z-50">
              <div className="mb-3">
                <input
                  type="text"
                  autoFocus
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  placeholder="Search destination..."
                  aria-label="Search destinations"
                  className="w-full px-3.5 py-2 rounded-lg border border-black/10 text-xs font-sans text-velnora-charcoal outline-none focus:border-velnora-gold-luxury"
                />
              </div>
              <ul role="listbox" className="max-h-[180px] overflow-y-auto font-sans text-[13.5px] font-medium text-velnora-charcoal">
                {visibleDestinations.map((name) => (
                  <li key={name} role="option" aria-selected={name === destination}>
                    <button
                      type="button"
                      onClick={() => {
                        setDestination(name);
                        setPanel(null);
                        setMessage(null);
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-velnora-gold-luxury/10 hover:text-velnora-gold-luxury transition duration-200"
                    >
                      {name}
                    </button>
                  </li>
                ))}
                {visibleDestinations.length === 0 && <li className="px-3.5 py-2.5 text-velnora-charcoal/50">No matches</li>}
              </ul>
            </div>
          )}
        </div>
      </div>

      <span className="w-[1px] h-[50px] bg-velnora-charcoal/8 mx-3 hidden lg:block" />

      {(
        [
          ["CHECK IN", checkInRef, "checkIn"],
          ["CHECK OUT", checkOutRef, "checkOut"],
        ] as const
      ).map(([label, ref, id], i) => (
        <div key={id} className="contents">
          {i === 1 && <span className="w-[1px] h-[50px] bg-velnora-charcoal/8 mx-3 hidden lg:block" />}
          <div className="booking-field-group relative flex-1 flex items-center gap-4 py-2 px-3">
            <div className={iconCircle}>
              <i className="fa-regular fa-calendar-days" />
            </div>
            <label htmlFor={id} className="flex flex-col w-full">
              <span className={fieldLabel}>{label}</span>
              <span className="flex items-center justify-between w-full">
                <input
                  ref={ref}
                  id={id}
                  type="text"
                  readOnly
                  placeholder="Select date"
                  className="border-none bg-transparent text-[14.5px] font-semibold text-velnora-charcoal placeholder-velnora-charcoal/40 outline-none cursor-pointer w-full"
                />
                <i className="fa-solid fa-chevron-down text-[10px] text-velnora-charcoal/40 ml-2" />
              </span>
            </label>
          </div>
        </div>
      ))}

      <span className="w-[1px] h-[50px] bg-velnora-charcoal/8 mx-3 hidden lg:block" />

      <div className="booking-field-group relative flex-1 flex items-center gap-4 py-2 px-3">
        <div className={iconCircle}>
          <i className="fa-regular fa-user" />
        </div>
        <div className="flex flex-col w-full">
          <span className={fieldLabel}>TRAVELERS</span>
          <button
            type="button"
            aria-expanded={panel === "travelers"}
            onClick={() => setPanel(panel === "travelers" ? null : "travelers")}
            className="flex items-center justify-between w-full text-left"
          >
            <span className={`text-[14.5px] font-semibold select-none ${travelersApplied ? "text-velnora-charcoal" : "text-velnora-charcoal/40"}`}>
              {travelersText}
            </span>
            <i
              className={`fa-solid fa-chevron-down text-[10px] text-velnora-charcoal/40 transition-transform duration-300 ml-2 ${panel === "travelers" ? "rotate-180" : ""}`}
            />
          </button>
          {panel === "travelers" && (
            <div className="widget-dropdown-panel absolute bottom-[calc(100%+20px)] right-0 w-72 bg-white rounded-2xl shadow-2xl border border-black/8 p-5 z-50">
              {(
                [
                  ["Adults", "Age 13+", adults, setAdults, 1],
                  ["Children", "Age 2-12", children, setChildren, 0],
                ] as const
              ).map(([name, hint, value, setValue, min]) => (
                <div key={name} className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-velnora-charcoal">{name}</span>
                    <span className="text-[11px] text-velnora-charcoal/50">{hint}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" aria-label={`Fewer ${name.toLowerCase()}`} className={counterButton} onClick={() => setValue(Math.max(min, value - 1))}>
                      <i className="fa-solid fa-minus" />
                    </button>
                    <span className="text-base font-bold text-velnora-charcoal w-5 text-center">{value}</span>
                    <button type="button" aria-label={`More ${name.toLowerCase()}`} className={counterButton} onClick={() => setValue(Math.min(20, value + 1))}>
                      <i className="fa-solid fa-plus" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="border-t border-black/5 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setTravelersApplied(true);
                    setPanel(null);
                  }}
                  className="w-full bg-velnora-navy-deep text-white py-2.5 rounded-lg text-[12.5px] font-semibold hover:bg-velnora-gold-luxury transition duration-200"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="md:col-span-2 bg-velnora-navy-deep text-white rounded-full px-10 py-4 font-bold text-xs tracking-wider flex items-center justify-center gap-3 h-[58px] transition duration-300 hover:bg-velnora-gold-luxury hover:shadow-[0_6px_20px_rgba(199,154,67,0.3)]"
      >
        <span>SEARCH NOW</span> <i className="fa-solid fa-chevron-right" />
      </button>

      {message && (
        <p
          role="status"
          className={`absolute left-1/2 -translate-x-1/2 -bottom-10 w-full text-center text-sm font-semibold ${message.ok ? "text-green-300" : "text-red-300"}`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
