import cn from "classnames";
import styles from "./Input.module.css";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: "email" | "password" | "name";
}

export const Input = ({ type, onChange, value, className }: InputProps) => {
  const isEmail = type === "email";
  const isPassword = type === "password";

  return (
    <div className={cn(styles["container"], className)}>
      <img
        className={styles["image"]}
        src={
          isEmail
            ? "/email-logo.svg"
            : isPassword
            ? "/lock-password-logo.svg"
            : "/user.svg"
        }
        alt="Картинка"
      />
      <input
        type="text"
        placeholder={isEmail ? "E-mail" : isPassword ? "Пароль" : "Имя"}
        className={styles["input"]}
        onChange={onChange}
        value={value}
        name={type}
      />
      {isPassword && (
        <img
          src="/eye-logo.svg"
          className={cn(styles["image"], styles["eye"])}
        />
      )}
    </div>
  );
};
