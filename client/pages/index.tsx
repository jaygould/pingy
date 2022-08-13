import React, { FC, useState } from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import Layout from "../components/Layout";
import Button, { ButtonTypeEnum } from "../components/Button";
import GlobalMessage from "../components/GlobalMessage";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

import { IMessage, TPostResponse, TGetResponse } from "../types/index";

import { Form, FormWrap } from "./logged-out-styles";
import THEME from "../styles/theming";

interface ILoginFields {
  emailAddress: string;
  password: string;
}

const HomePage: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFields>({
    defaultValues: { emailAddress: "", password: "" },
  });
  const [message, setMessage] = useState<IMessage | null>(null);
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["jwt"]);

  const onSubmit: SubmitHandler<ILoginFields> = ({
    emailAddress,
    password,
  }) => {
    axios
      .post<TPostResponse<{ jwt: string }>>(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          email: emailAddress,
          password,
        }
      )
      .then((response) => {
        setMessage({ type: "success", text: response?.data?.message });
        setCookie("jwt", response.data.jwt, { path: "/" });
        router.push("/dashboard");
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
              <h2>Login</h2>
              <input
                placeholder="Email address"
                type="text"
                {...register("emailAddress", {
                  required: true,
                })}
              />

              <input
                placeholder="Password"
                type="password"
                {...register("password", {
                  required: true,
                })}
              />

              <div className="button-wrap">
                <Button type={ButtonTypeEnum.submit} text={"Login"}></Button>
                <Button
                  text={"Register"}
                  link={"/register"}
                  color={THEME.COLORS.secondary}
                ></Button>
              </div>
            </div>
          </Form>

          <div className="landing-image">
            <img src="/landing-image.svg" />
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

export default HomePage;
