import React, { FC, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCookies } from "react-cookie";

import withAuthentication from "../../services/with-authentication";
import axios from "axios";
import Button, { ButtonTypeEnum } from "../../components/Button";
import GlobalMessage from "../../components/GlobalMessage";

import { IMessage, TPostResponse, TGetResponse } from "../../types/index";

type Props = {};

interface ICrawl {
  id: number;
  userId: number;
  pageHtml: string;
  pageUrl: string;
  status: "initialCrawl" | "changedContent" | "pageDown" | "cancelled";
  monitorType: "pageChange" | "pageDown" | "";
  createdAt: string;
}

type TCrawlerFields = Pick<ICrawl, "pageUrl" | "monitorType">;

type TGroupedCrawls = Array<{
  crawl: ICrawl;
  updates: Array<ICrawl>;
}>;

const Crawler: FC<Props> = ({}) => {
  const [message, setMessage] = useState<IMessage | null>(null);
  const [cookies, setCookie] = useCookies(["jwt"]);
  const [crawls, setCrawls] = useState<TGroupedCrawls>();

  useEffect(() => {
    (async () => {
      const response = await axios.get<
        TGetResponse<{ crawls: TGroupedCrawls }>
      >(`${process.env.NEXT_PUBLIC_API_URL}/watched-pages`, {
        headers: { Authorization: `Bearer ${cookies.jwt}` },
      });

      if (response?.data?.crawls.length) {
        setCrawls(response.data.crawls);
      }
    })();
  }, []);

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

          <div>
            <div>
              <input
                key="pageDown"
                name={`monitorType-pageDown`}
                type="checkbox"
                value="pageDown"
                {...register("monitorType", {})}
              />

              <label>Page Down</label>
            </div>
            <div>
              <input
                key="pageChange"
                name={`monitorType-pageChange`}
                type="checkbox"
                value="pageChange"
                {...register("monitorType", {})}
              />
              <label>Page Change</label>
            </div>
          </div>

          <Button
            type={ButtonTypeEnum.submit}
            text={"Start watching"}
            color={"bg-blue-600"}
          ></Button>
        </form>
      </div>

      <div className="mb-10">
        <Button
          type={ButtonTypeEnum.onClick}
          text={"Recrawl"}
          color={"bg-blue-600"}
          onClick={() => {
            onSubmitRepeatCrawl();
          }}
        ></Button>
      </div>

      <div className="mb-10">
        <h2>Current Monitoring</h2>

        {crawls && crawls.length
          ? crawls.map((crawl) => {
              return (
                <Accordion
                  title={crawl.crawl.pageUrl}
                  renderTitle={(title) => {
                    return title;
                  }}
                  items={crawl.updates}
                  renderItem={(item) => {
                    return `${item.status} - ${item.createdAt}`;
                  }}
                />
              );
            })
          : null}
      </div>

      <GlobalMessage
        text={message?.text}
        onClose={() => setMessage(null)}
        isOpen={message !== null}
        type={message?.type}
      />
    </>
  );
};

interface IProps<T, U> {
  title: U;
  renderTitle: (title: U) => React.ReactNode;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const Accordion = <T, U>({
  title,
  renderTitle,
  items,
  renderItem,
}: IProps<T, U>) => {
  return (
    <div className="mb-6">
      <h4>{renderTitle(title)}</h4>
      {items.length ? (
        <ul>
          {items.map((item) => {
            return <li>{renderItem(item)}</li>;
          })}
        </ul>
      ) : (
        <p>There are no matching re-crawls for this monitor.</p>
      )}
    </div>
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
