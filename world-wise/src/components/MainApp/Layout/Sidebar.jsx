import styles from "./Sidebar.module.css";
import AppNav from "./AppNav";
import Logo from "../../UI/Logo";
import { Outlet } from "react-router-dom";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <footer className={styles.footer}>
        <p>&copy; Copyright {new Date().getFullYear()} by WorldWise inc.</p>
      </footer>
    </div>
  );
}

export default Sidebar;
