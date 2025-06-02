import Sidebar from "../components/MainApp/Layout/Sidebar";
import Map from "../components/MainApp/Layout/Map";
import styles from "./AppLayout.module.css";
import User from "../components/MainApp/Elements/User";

function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      <User />
    </div>
  );
}

export default AppLayout;

/* 

Todo
1. 






*/
