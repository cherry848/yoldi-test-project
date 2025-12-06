import { useState, type ChangeEvent } from "react";
import { Button } from "../Button/Button";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import { Input } from "../Input/Input";
import styles from "./Register.module.css";
import cn from "classnames";
import { useNavigate } from "react-router";
import authInstance from "../helpers/authInstance";

export const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });

    setErrors((prev) => {
      return { ...prev, [e.target.name]: false };
    });
  };

  const handleSubmit = () => {
    const newErrors = {
      name: !form.name,
      email: !form.email,
      password: !form.password,
    };

    setErrors(newErrors);

    const allValid = Object.values(newErrors).every((val) => val === false);

    if (allValid) {
      authInstance.post(`/auth/sign-up`, form);
    }
  };

  const formValid = Boolean(form.name && form.email && form.password);

  return (
    <div className={styles["wrapper"]}>
      <Header></Header>
      <div className={styles["content"]}>
        <div className={styles["auth-form"]}>
          <span>
            Регистрация <br /> в Yoldi Agency
          </span>
          <div className={styles["input-container"]}>
            <Input
              className={cn({ [styles["inputError"]]: errors.name })}
              onChange={onChange}
              value={form.name}
              type="name"
            ></Input>
            <Input
              className={cn({ [styles["inputError"]]: errors.email })}
              onChange={onChange}
              value={form.email}
              type="email"
            ></Input>
            <Input
              className={cn({ [styles["inputError"]]: errors.password })}
              onChange={onChange}
              value={form.password}
              type="password"
            ></Input>
          </div>
          <Button
            className={cn(styles["button"], {
              [styles["buttonActive"]]: formValid,
            })}
            onClick={handleSubmit}
          >
            Создать аккаунт
          </Button>
        </div>
      </div>
      <Footer
        onClick={() => {
          navigate("/page/login");
        }}
        className={styles["footer"]}
      >
        Уже есть аккаунт? Войти
      </Footer>
    </div>
  );
};
