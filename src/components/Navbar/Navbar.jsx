import { NavLink } from "react-router-dom";
import "./Navbar.css";

// Centralized so adding/reordering nav items later is a one-line change.
const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/media", label: "Media" },
];

export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="navbar-shell">
        <NavLink to="/" className="navbar-brand" end>
          Jared Esquivel
        </NavLink>

        <ul className="navbar-links">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  "navbar-link" + (isActive ? " is-active" : "")
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
