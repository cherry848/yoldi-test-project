import { Button } from "../Button/Button";
import styles from "./Header.module.css";
import type { IUserData } from "../Profile/Profile";

interface HeaderProp22 {
  user?: IUserData;
}

export const Header = ({ user }: HeaderProp22) => {
  return (
    <header className={styles["header"]}>
      <img src="/logo-wrapper.svg" alt="Yoldi logo" />
      <span className={styles["headerTitle"]}>
        Разрабатываем и запускаем сложные веб проекты
      </span>
      {user ? (
        <div className={styles["userInfo"]}>
          <span className={styles["name"]}>{user.name}</span>
          <div className={styles["avatar"]}>{user.name.slice(0, 1)}</div>
        </div>
      ) : (
        <Button className={styles["button"]}>Войти</Button>
      )}
    </header>
  );
};
