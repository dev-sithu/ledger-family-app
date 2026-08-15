import { FC, useEffect, useState } from "react";
import { useLocation, NavLink, NavLinkRenderProps } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from '@mui/icons-material/Dashboard';
import WalletIcon from '@mui/icons-material/Wallet';
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import "./Navbar.scss";

const Navbar: FC = () => {
  const [isBottom, setIsBottom] = useState(false);
  const location = useLocation(); // Get the current route

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const scrollPosition = viewportHeight + window.scrollY;
      const pageHeight = document.documentElement.offsetHeight;

      // Add a small threshold to ensure rounding issues won't impact the check
      const threshold = 50;

      setIsBottom(scrollPosition + threshold >= pageHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuActive = (navData: NavLinkRenderProps) => navData.isActive ? "active" : "";

  return (
    <>
      <nav>
        <NavLink to="/dashboard" className={menuActive}>
          <HomeIcon />
          <div>Home</div>
        </NavLink>
        <NavLink to="/ledger" className={menuActive}>
          <WalletIcon />
          <div>Ledger</div>
        </NavLink>
        <NavLink to="/expense" className={menuActive}>
          <DashboardIcon />
          <div>Expense</div>
        </NavLink>
        <NavLink to="/account" className={menuActive}>
          <AccountCircleIcon />
          <div>Account</div>
        </NavLink>
      </nav>
      {location.pathname !== "/expense/add" && !location.pathname.startsWith("/passive-income") && ( // Hide Fab button on /expense/add and passive-income pages
        <Fab
          className="fab-button"
          color="primary"
          aria-label="add"
          style={{
            position: "fixed",
            bottom: "75px",
            right: "15px",
            opacity: isBottom ? 0 : 1,
            transition: "opacity 0.3s ease-in-out"
          }}
          component={NavLink}
          to="/expense/add"
        >
          <AddIcon />
        </Fab>
      )}
    </>
  );
}

export default Navbar;
