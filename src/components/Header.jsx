import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import logo from "../assets/logo_square.png";

function Header() {
  const [isMobile, setIsMobile] = useState(false);

  const links = [
    { href: "/", label: "DATORER" },
    { href: "/", label: "VITVAROR" },
    { href: "/", label: "TV & LJUD" },
    { href: "/", label: "MOBILER" },
    { href: "/", label: "GAMING" },
    { href: "/", label: "HEM & HUSHÅLL" },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 768px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, []);

  return (
    <header className="flex items-center justify-between p-6 shadow-[0_4px_12px_var(--color-shadow)]">
      <img src={logo} alt="logotyp" className="w-15" />

      {isMobile ? (
        <button
          className="text-4xl text-black"
          aria-label="Öppna navigationsmeny"
        >
          <FaBars />
        </button>
      ) : (
        <>
          <span className="w-1/3">
            <input
              name="search"
              id="search"
              type="text"
              aria-label="Sökruta"
              placeholder="Sök efter en produkt.."
              className="w-full px-4 py-2 rounded border border-black"
            />
          </span>

          <nav className="flex justify-center items-center flex-wrap gap-6 text-lg">
            {links.map((link) => {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-bold"
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </>
      )}
    </header>
  );
}

export default Header;
