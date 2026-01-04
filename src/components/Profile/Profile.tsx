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
import { EditProfile } from "../EditProfile/EditProfile";
import { useNavigate, useParams } from "react-router";
import { getToken } from "../helpers/tokenAuth";

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

  const { slug } = useParams();

  const navigate = useNavigate();

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [viewMode, setViewMode] = useState(true);

  const [enable, setEnable] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (slug) {
        if (!getToken()) {
          authInstance
            .get(`/user/${slug}`)
            .then((res) => setUserData(res.data));
          return;
        }
        const slugUser = await authInstance.get<IUserData>(`/user/${slug}`);
        const profileUser = await authInstance.get<IUserData>(`/profile`);
        console.log(slugUser.data.slug);
        console.log(profileUser.data.slug);
        if (slugUser.data.slug === profileUser.data.slug) {
          setUserData(profileUser.data);
          setViewMode(false);
          return;
        }
        if (getToken()) {
          if (slugUser.data.slug === profileUser.data.slug) {
            setUserData(profileUser.data);
            setViewMode(false);
            return;
          }
          setEnable(false);
          setUserData(slugUser.data);
          return;
        }
        setUserData(slugUser.data);
        setEnable(false);
        return;
      }
      const { data } = await authInstance.get<IUserData>("/profile");
      setViewMode(false);
      setUserData(data);
    };
    fetchData();
  }, [slug]);

  console.log(userData);

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

  const cancelEdit = () => {
    setIsEditOpen(false);
  };

  const saveEditChanges = (data: { name: string; description: string }) => {
    setUserData((prev) => {
      return {
        ...prev,
        name:
          data.name === userData.name || data.name == ""
            ? prev.name
            : data.name,
        description: data.description || prev.description,
      };
    });
    setIsEditOpen(false);
  };

  const uploadImage = async (
    e: ChangeEvent<HTMLInputElement>,
    image: string
  ) => {
    const file = checkFiles(e);
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
      if (coverRef.current) coverRef.current.value = "";
    }
    if (image === "/image") {
      setUserData((prev) => ({ ...prev, image: null }));
      if (imageRef.current) imageRef.current.value = "";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/page/login");
  };

  return (
    <>
      {isEditOpen && (
        <div
          className={styles["filter"]}
          onClick={() => {
            setIsEditOpen(false);
          }}
        ></div>
      )}
      {isEditOpen && (
        <EditProfile
          onCancel={cancelEdit}
          onSave={saveEditChanges}
          name={userData.name}
          description={
            userData.description ??
            `Рыбатекст используется дизайнерами, проектировщиками и
             фронтендерами, когда нужно быстро заполнить макеты или прототипы
             содержимым. Это тестовый контент, который не должен нести никакого
             смысла, лишь показать наличие самого текста или продемонстрировать
             типографику в деле`
          }
        />
      )}
      <div className={styles["wrapper"]}>
        <Header enable={enable} user={userData} />
        <div
          style={{
            backgroundImage: userData.cover
              ? `url(${userData.cover.url})`
              : "none",
          }}
          className={cn(styles["profileHeader"], {
            [styles["profileHeaderImage"]]: userData.cover,
          })}
          onClick={() => {
            if (!viewMode) {
              if (userData.cover) {
                deleteImage("/cover");
              } else {
                openFileDialog(coverRef);
              }
            }
          }}
        >
          <input
            type="file"
            ref={coverRef}
            onChange={(e) => {
              uploadImage(e, "/cover");
            }}
            className={styles["input"]}
          />
          {!viewMode && (
            <div className={styles["profileHeaderLoader"]}>
              <img className={styles["img"]} src="/trash-solid.svg" alt="" />
              <span>{userData.cover ? "Удалить" : "Загрузить"}</span>
              <img
                className={styles["img"]}
                src="/image-for-loader.svg"
                alt=""
              />
            </div>
          )}
        </div>
        <div className={styles["profileContent"]}>
          <div className={styles["profileContainer"]}>
            <div
              className={cn(styles["avatar"], {
                [styles["loggedIn"]]: !viewMode,
              })}
              onClick={() => {
                if (!viewMode) {
                  if (userData.image) {
                    deleteImage("/image");
                  } else {
                    openFileDialog(imageRef);
                  }
                }
              }}
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
                  {!viewMode && (
                    <img
                      className={styles["cameraImg"]}
                      src="/camera-solid.svg"
                      alt=""
                    />
                  )}
                  {userData.name.slice(0, 1)}
                </>
              )}
            </div>
            <div className={styles["profileInfo"]}>
              <div className={styles["profileTitle"]}>
                <span className={styles["name"]}>{userData.name}</span>
                {!viewMode && (
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className={styles["editButton"]}
                  >
                    <img
                      className={styles["img"]}
                      src="/pen-solid.svg"
                      alt=""
                    />
                    <span>Редактировать</span>
                  </button>
                )}
                <span className={styles["mail"]}>{userData.email}</span>
              </div>
              {/* <span className={styles["mail"]}>{userData.email}</span> */}
            </div>
            <p className={styles["text"]}>
              {userData.description
                ? userData.description
                : `Рыбатекст используется дизайнерами, проектировщиками и
            фронтендерами, когда нужно быстро заполнить макеты или прототипы
            содержимым. Это тестовый контент, который не должен нести никакого
            смысла, лишь показать наличие самого текста или продемонстрировать
            типографику в деле.`}
            </p>
            {!viewMode && (
              <button className={styles["exitButton"]}>
                <img
                  className={styles["img"]}
                  src="/sign-out-alt-solid.svg"
                  alt=""
                />
                <span onClick={logout}>Выйти</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
