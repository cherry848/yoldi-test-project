import { useState, type ChangeEvent } from "react";
import { Button } from "../Button/Button";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import { Input } from "../Input/Input";
import styles from "./Login.module.css";
import cn from "classnames";
import { useNavigate } from "react-router";
import authInstance from "../helpers/authInstance";

export const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
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

  const handleSubmit = async () => {
    const newErrors = {
      email: !form.email,
      password: !form.password,
    };

    setErrors(newErrors);

    const allValid = Object.values(newErrors).every((val) => val === false);

    if (allValid) {
      const response = await authInstance.post(`/auth/login`, form);
      if (response.status === 201) {
        navigate("/page/profile");
      }
    }
  };

  const formValid = Boolean(form.email && form.password);

  return (
    <div className={styles["wrapper"]}>
      <Header />
      <div className={styles["content"]}>
        <div className={styles["auth-form"]}>
          <span>Вход в Yoldi Agency</span>
          <div className={styles["input-container"]}>
            <Input
              className={cn({ [styles["inputError"]]: errors.email })}
              value={form.email}
              onChange={onChange}
              type="email"
            />
            <Input
              className={cn({
                [styles["inputError"]]: errors.password,
              })}
              value={form.password}
              onChange={onChange}
              type="password"
            />
          </div>
          <Button
            onClick={handleSubmit}
            className={cn(styles["button"], {
              [styles["buttonActive"]]: formValid,
            })}
          >
            Войти
          </Button>
        </div>
      </div>
      <Footer
        onClick={() => {
          navigate("/page/register");
        }}
        className={styles["footer"]}
      >
        Еще нет аккаунта? Зарегистрироваться
      </Footer>
    </div>
  );
};
