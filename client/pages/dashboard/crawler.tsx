import React, { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCookies } from "react-cookie";

import withAuthentication from "../../services/with-authentication";
import axios from "axios";
import Button, { ButtonTypeEnum } from "../../components/Button";
import GlobalMessage from "../../components/GlobalMessage";

type Props = {};

interface ICrawlerFields {
  pageUrl: string;
}

interface ICrawlerResponse {
  message: string;
}

const Crawler: FC<Props> = ({}) => {
  const [message, setMessage] = useState(null);
  const [cookies, setCookie] = useCookies(["jwt"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICrawlerFields>({
    defaultValues: { pageUrl: "" },
  });

  const onSubmit: SubmitHandler<ICrawlerFields> = ({ pageUrl }) => {
    axios
      .post<ICrawlerResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/watch-page`,
        {
          pageUrl,
        },
        {
          headers: { Authorization: `Bearer ${cookies.jwt}` },
        }
      )
      .then((response) => {
        setMessage({ type: "success", text: response?.data?.message });
      })
      .catch((error) => {
        setMessage({ type: "error", text: error?.response?.data?.message });
      });
  };

  return (
    <>
      <h2>Crawler</h2>
      <div className="mb-10">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <input
            placeholder="Website URL"
            type="text"
            {...register("pageUrl", {
              required: true,
            })}
          />

          <Button
            type={ButtonTypeEnum.submit}
            text={"Login"}
            color={"bg-blue-600"}
          ></Button>
        </form>
      </div>

      <GlobalMessage
        message={message?.text}
        onClose={() => setMessage(null)}
        isOpen={message && message.type && message.text}
      />
    </>
  );
};

export const getServerSideProps = withAuthentication(
  async (context, props, jwt) => {
    return {
      props: {},
    };
  }
);

export default Crawler;
