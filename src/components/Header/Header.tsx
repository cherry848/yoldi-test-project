import { Button } from "../Button/Button";
import styles from "./Header.module.css";
import type { IUserData } from "../Profile/Profile";
import { useNavigate } from "react-router";
import { getToken, removeToken } from "../helpers/tokenAuth";

interface HeaderProps {
  user?: IUserData | null;
  enable: boolean;
}

export const Header = ({ user, enable }: HeaderProps) => {
  console.log(user);
  const navigate = useNavigate();

  return (
    <header className={styles["header"]}>
      <img src="/logo-wrapper.svg" alt="Yoldi logo" />
      <span className={styles["headerTitle"]}>
        Разрабатываем и запускаем сложные веб проекты
      </span>
      {enable ? (
        <div className={styles["userInfo"]}>
          <span className={styles["name"]}>{user?.name}</span>
          <div className={styles["avatar"]}>
            {user?.image ? (
              <img className={styles["avatarImg"]} src={user?.image.url} />
            ) : (
              user?.name.slice(0, 1)
            )}
          </div>
        </div>
      ) : (
        <Button
          onClick={() => {
            if (getToken()) {
              removeToken();
            }
            navigate("/page/login");
          }}
          className={styles["button"]}
        >
          Войти
        </Button>
      )}
    </header>
  );
};
