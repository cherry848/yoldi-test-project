import { useState, type ChangeEvent } from "react";
import { Button } from "../Button/Button";
import styles from "./EditProfile.module.css";

interface IEditProfileProps {
  name: string;
  description: string;
  onCancel: () => void;
  onSave: (data: { name: string; description: string }) => void;
}

export const EditProfile = ({
  name,
  description,
  onCancel,
  onSave,
}: IEditProfileProps) => {
  const [form, setForm] = useState({
    name: name,
    address: "",
    description: description,
  });

  const handleChanges = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setForm((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const alignText = (text: string) => {
    return text
      .split("\n")
      .map((e) => e.trim())
      .join(" ");
  };

  console.log(form);

  return (
    <div className={styles["wrapper"]}>
      <span className={styles["editProfile"]}>Редактировать профиль</span>
      <div className={styles["editProfileWrapper"]}>
        <div className={styles["nameForm"]}>
          <label className={styles["name"]} htmlFor="name">
            Имя
          </label>
          <input
            className={styles["nameInput"]}
            value={form.name}
            onChange={(e) => {
              handleChanges(e);
            }}
            name="name"
            id="name"
            type="text"
          />
        </div>
        <div className={styles["addressForm"]}>
          <label className={styles["address"]} htmlFor="address">
            Адрес профиля
          </label>
          <div className={styles["addressExampleWrapper"]}>
            <div className={styles["addressExample"]}>example.com/</div>
            <input
              value={form.address}
              onChange={(e) => {
                handleChanges(e);
              }}
              className={styles["addressInput"]}
              name="address"
              id="address"
              type="text"
            />
          </div>
        </div>
        <div className={styles["descriptionForm"]}>
          <label className={styles["description"]} htmlFor="description">
            Описание
          </label>
          <textarea
            value={alignText(form.description)}
            onChange={(e) => {
              handleChanges(e);
            }}
            maxLength={502}
            className={styles["descriptionInput"]}
            name="description"
            id="description"
          />
        </div>
      </div>
      <div className={styles["buttons"]}>
        <Button onClick={onCancel} className={styles["button"]}>
          Отмена
        </Button>
        <Button
          onClick={() => {
            onSave({ name: form.name, description: form.description });
          }}
          className={styles["button"]}
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
};
