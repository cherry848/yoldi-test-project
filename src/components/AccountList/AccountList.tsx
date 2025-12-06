import { useEffect, useState } from "react";
import { Header } from "../Header/Header";
import styles from "./AccountList.module.css";
import authInstance from "../helpers/authInstance";

interface IAcccountsList {
  name: string;
  email: string;
  slug: string;
  description: string | null;
  image: {
    id: string;
    url: string;
    width: string;
    height: string;
  } | null;
  cover: {
    id: string;
    url: string;
    width: string;
    height: string;
  } | null;
}

export const AccountList = () => {
  const [accounts, setAccounts] = useState<IAcccountsList[]>([
    {
      name: "",
      email: "",
      slug: "",
      description: null,
      image: null,
      cover: null,
    },
  ]);

  useEffect(() => {
    authInstance.get<IAcccountsList[]>("/user").then((res) => {
      setAccounts(res.data);
    });
  }, []);

  return (
    <div className={styles["wrapper"]}>
      <Header></Header>
      <div className={styles["accountsWrapper"]}>
        <div className={styles["accountsList"]}>
          <span className={styles["accountsListTitle"]}>Список аккаунтов</span>
          {accounts.map((account) => {
            return (
              <div className={styles["account"]}>
                <div className={styles["avatar"]}>
                  {account.image ? (
                    <img src={account.image.url} />
                  ) : (
                    account.name.slice(0, 1)
                  )}
                </div>
                <button className={styles["name"]}>{account.name}</button>
                <span className={styles["email"]}>{account.email}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
