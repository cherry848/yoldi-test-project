import { useEffect, useState } from "react";
import { Header } from "../Header/Header";
import styles from "./AccountList.module.css";
import authInstance from "../helpers/authInstance";
import { useNavigate } from "react-router";
import type { IUserData } from "../Profile/Profile";

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

interface IUserProfile {
  name: string | null;
  email: string | null;
  slug: string | null;
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

  const [profile, setProfile] = useState<IUserProfile>({
    name: null,
    email: null,
    slug: null,
    description: null,
    image: null,
    cover: null,
  });

  // const [enable, setEnable] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    authInstance.get("/user").then((res) => {
      setAccounts(res.data);
    });

    const getOwnerProfile = async () => {
      const profile = await authInstance.get("/profile");
      if (profile.status === 200) {
        setProfile(profile.data);
      }
    };
    getOwnerProfile();
  }, []);

  const loadProfile = (slug: string) => {
    navigate(`/page/profile/${slug}`);
  };

  return (
    <div className={styles["wrapper"]}>
      <Header
        enable={profile.slug ? true : false}
        user={profile as IUserData}
      ></Header>
      <div className={styles["accountsWrapper"]}>
        <div className={styles["accountsList"]}>
          <span className={styles["accountsListTitle"]}>Список аккаунтов</span>
          {accounts.map((account) => {
            return (
              <div
                onClick={() => {
                  loadProfile(account.slug);
                }}
                key={account.slug}
                className={styles["account"]}
              >
                <div className={styles["avatar"]}>
                  {account.image ? (
                    <img
                      className={styles["avatarImg"]}
                      src={account.image.url}
                    />
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
