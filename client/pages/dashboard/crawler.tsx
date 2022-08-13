import React, { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCookies } from "react-cookie";
import Layout from "../../components/Layout";
import withAuthentication from "../../services/with-authentication";
import axios from "axios";
import Button, { ButtonTypeEnum } from "../../components/Button";
import GlobalMessage from "../../components/GlobalMessage";
import Checkbox from "../../components/Checkbox";

import { IMessage, TPostResponse, TGetResponse } from "../../types/index";
import { TCrawlerFields } from "../../types/crawler.types";

import THEME from "../../styles/theming";
import styled from "styled-components";

type Props = {};

const Crawler: FC<Props> = ({}) => {
  const [message, setMessage] = useState<IMessage | null>(null);
  const [cookies, setCookie] = useCookies(["jwt"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<TCrawlerFields>({
    defaultValues: { pageUrl: "", monitorType: "" },
  });

  const onSubmit: SubmitHandler<TCrawlerFields> = ({
    pageUrl,
    monitorType,
  }) => {
    axios
      .post<TPostResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/watch-page`,
        {
          pageUrl,
          monitorType,
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

  // Function for testing purposes - not used in production
  const onSubmitRepeatCrawl = () => {
    const { pageUrl } = getValues();
    axios
      .post<TPostResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/recrawl-page`,
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

  const Checkboxes = styled.div`
    > div {
      margin: 2em 0em;
      > span {
        font-size: ${THEME.FONT_SIZE.xs};
      }
    }
  `;

  return (
    <Layout isLoggedIn={true}>
      <>
        <h2>Crawler</h2>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              placeholder="Website URL"
              type="text"
              {...register("pageUrl", {
                required: true,
              })}
            />

            <Checkboxes>
              <div>
                <Checkbox
                  text={"Page Down"}
                  _key={"pageDown"}
                  group={"monitorType"}
                  register={register}
                />
                <span>
                  Get alerted when a page shows and error and goes down
                </span>
              </div>

              <div>
                <Checkbox
                  text={"Page Change"}
                  _key={"pageChange"}
                  group={"monitorType"}
                  register={register}
                />
                <span>Get alerted when a page text or images change</span>
              </div>
            </Checkboxes>

            <Button
              type={ButtonTypeEnum.submit}
              text={"Start watching"}
              color={THEME.COLORS.green}
            ></Button>
          </form>
        </div>

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

export const getServerSideProps = withAuthentication(
  async (context, props, jwt) => {
    return {
      props: {},
    };
  }
);

export default Crawler;
