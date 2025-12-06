import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from "react";
import authInstance from "../helpers/authInstance";
import styles from "./Profile.module.css";
import { Header } from "../Header/Header";
import cn from "classnames";

export interface IUserData {
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

export const Profile = () => {
  const [userData, setUserData] = useState<IUserData>({
    name: "",
    email: "",
    slug: "",
    description: "",
    image: null,
    cover: null,
  });

  useEffect(() => {
    authInstance.get("/profile").then((res) => setUserData(res.data));
  }, []);

  const coverRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const openFileDialog = (ref: RefObject<HTMLInputElement | null>) => {
    ref.current?.click();
  };

  const checkFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    return file;
  };

  const uploadImage = async (
    e: ChangeEvent<HTMLInputElement>,
    image: string
  ) => {
    const file = checkFiles(e);
    console.log(1);
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await authInstance.post("image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (image === "/image") {
        if (response.status === 201) {
          setUserData((prev) => {
            return {
              ...prev,
              image: {
                id: response.data.id,
                url: response.data.url,
                width: response.data.width,
                height: response.data.height,
              },
            };
          });
        }
      }
      if (image === "/cover") {
        if (response.status === 201) {
          console.log("LKSDFJFGKLSD;JFSA;LKJFDSLKJFJLFKDAFD");
          setUserData((prev) => {
            return {
              ...prev,
              cover: {
                id: response.data.id,
                url: response.data.url,
                width: response.data.width,
                height: response.data.height,
              },
            };
          });
        }
      }
    }
  };

  const deleteImage = (image: string) => {
    if (image === "/cover") {
      setUserData((prev) => ({ ...prev, cover: null }));
    }
    if (image === "/image") {
      setUserData((prev) => ({ ...prev, image: null }));
    }
  };

  console.log(userData);

  return (
    <div className={styles["wrapper"]}>
      <Header user={userData} />
      <div
        style={{
          backgroundImage: userData.cover
            ? `url(${userData.cover.url})`
            : "none",
        }}
        className={cn(styles["profileHeader"], {
          [styles["profileHeaderImage"]]: userData.cover,
        })}
        // onClick={
        //   userData.cover
        //     ? () => deleteImage("/image")
        //     : () => openFileDialog(coverRef)
        // }
        onClick={() => {
          console.log(userData);
          if (userData.cover) {
            deleteImage("/cover");
          } else {
            openFileDialog(coverRef);
          }
        }}
      >
        <input
          type="file"
          ref={coverRef}
          onChange={(e) => {
            console.log(2);
            uploadImage(e, "/cover");
          }}
          className={styles["input"]}
        />
        <div className={styles["profileHeaderLoader"]}>
          <img className={styles["img"]} src="/trash-solid.svg" alt="" />
          <span>{userData.cover ? "Удалить" : "Загрузить"}</span>
          <img className={styles["img"]} src="/image-for-loader.svg" alt="" />
        </div>
      </div>
      <div className={styles["profileContent"]}>
        <div className={styles["profileContainer"]}>
          <div
            className={styles["avatar"]}
            onClick={
              userData.image
                ? () => deleteImage("/image")
                : () => openFileDialog(imageRef)
            }
          >
            <input
              type="file"
              ref={imageRef}
              onChange={
                userData.image
                  ? () => deleteImage("/image")
                  : (e) => uploadImage(e, "/image")
              }
              className={styles["input"]}
            />
            {userData.image ? (
              <img className={styles["avatarImg"]} src={userData.image.url} />
            ) : (
              <>
                <img
                  className={styles["cameraImg"]}
                  src="/camera-solid.svg"
                  alt=""
                />
                {userData.name.slice(0, 1)}
              </>
            )}
          </div>
          <div className={styles["profileTitle"]}>
            <span className={styles["name"]}>{userData.name}</span>
            <button className={styles["editButton"]}>
              <img className={styles["img"]} src="/pen-solid.svg" alt="" />
              <span>Редактировать</span>
            </button>
          </div>
          <span className={styles["mail"]}>{userData.email}</span>
          <p className={styles["text"]}>
            {userData.description
              ? userData.description
              : `Рыбатекст используется дизайнерами, проектировщиками и
            фронтендерами, когда нужно быстро заполнить макеты или прототипы
            содержимым. Это тестовый контент, который не должен нести никакого
            смысла, лишь показать наличие самого текста или продемонстрировать
            типографику в деле.`}
          </p>
          <button className={styles["exitButton"]}>
            <img
              className={styles["img"]}
              src="/sign-out-alt-solid.svg"
              alt=""
            />
            <span>Выйти</span>
          </button>
        </div>
      </div>
    </div>
  );
};
