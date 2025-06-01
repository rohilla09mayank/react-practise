import Sidebar from "../components/MainApp/Layout/Sidebar";
import Map from "../components/MainApp/Layout/Map";
import styles from "./AppLayout.module.css";

function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
    </div>
  );
}

export default AppLayout;

/* 

Todo
1. 






*/
