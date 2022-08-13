import React, { FC, useState } from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import Layout from "../components/Layout";
import Button, { ButtonTypeEnum } from "../components/Button";
import GlobalMessage from "../components/GlobalMessage";

import { IMessage } from "../types/index";
import { Form, FormWrap } from "./logged-out-styles";

import THEME from "../styles/theming";

interface IRegisterFields {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
}

const RegisterPage: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterFields>({
    defaultValues: { emailAddress: "", password: "" },
  });
  const [message, setMessage] = useState<IMessage | null>(null);

  const onSubmit: SubmitHandler<IRegisterFields> = ({
    firstName,
    lastName,
    emailAddress,
    password,
  }) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        firstName,
        lastName,
        email: emailAddress,
        password,
      })
      .then((response) => {
        setMessage({ type: "success", text: response?.data?.message });
      })
      .catch((error) => {
        setMessage({ type: "error", text: error?.response?.data?.message });
      });
  };

  return (
    <Layout>
      <>
        <FormWrap>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <h2>Register</h2>
              <input
                type="text"
                placeholder="First name"
                {...register("firstName", {
                  required: true,
                })}
              />

              <input
                type="text"
                placeholder="Last name"
                {...register("lastName", {
                  required: true,
                })}
              />

              <input
                type="text"
                placeholder="Email address"
                {...register("emailAddress", {
                  required: true,
                })}
              />
              {errors.emailAddress?.type === "required" &&
                "Email address is required"}

              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: true,
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters.",
                  },
                })}
              />
              {errors.password?.message}

              <div className="button-wrap">
                <Button type={ButtonTypeEnum.submit} text={"Register"}></Button>
                <Button
                  text={"Login"}
                  link={"/"}
                  color={THEME.COLORS.secondary}
                ></Button>
              </div>
            </div>
          </Form>

          <div className="landing-image">
            <img src="/register-landing.svg" />
          </div>
        </FormWrap>

        <GlobalMessage
          text={message?.text}
          onClose={() => setMessage(null)}
          isOpen={message !== null}
          type={message?.type}
        />
      </>
    </Layout>
  );
};

export default RegisterPage;
