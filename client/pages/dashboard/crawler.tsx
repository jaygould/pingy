import React, { FC, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCookies } from "react-cookie";

import withAuthentication from "../../services/with-authentication";
import axios from "axios";
import Button, { ButtonTypeEnum } from "../../components/Button";
import GlobalMessage from "../../components/GlobalMessage";

type Props = {};

type Crawl = {
  id: number;
  userId: number;
  pageHtml: string;
  pageUrl: string;
  status: "initialCrawl" | "changedContent" | "pageDown" | "cancelled";
  monitorType: "pageChange" | "pageDown";
  createdAt: string;
};

interface ICrawlerFields {
  pageUrl: string;
  monitorType: "PAGE_DOWN" | "PAGE_CHANGE" | "";
}

interface ICrawlerResponse {
  message: string;
}

interface ICrawlerGetResponse {
  crawls: Array<{
    crawl: Crawl;
    updates: Array<Crawl>;
  }>;
}

const Crawler: FC<Props> = ({}) => {
  const [message, setMessage] = useState(null);
  const [cookies, setCookie] = useCookies(["jwt"]);
  const [crawls, setCrawls] = useState<
    Array<{
      crawl: Crawl;
      updates: Array<Crawl>;
    }>
  >();

  useEffect(() => {
    (async () => {
      const response = await axios.get<ICrawlerGetResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/watched-pages`,
        {
          headers: { Authorization: `Bearer ${cookies.jwt}` },
        }
      );

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
  } = useForm<ICrawlerFields>({
    defaultValues: { pageUrl: "", monitorType: "" },
  });

  const onSubmit: SubmitHandler<ICrawlerFields> = ({
    pageUrl,
    monitorType,
  }) => {
    axios
      .post<ICrawlerResponse>(
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
      .post<ICrawlerResponse>(
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
                <div className="mb-6">
                  <h4>{crawl.crawl.pageUrl}</h4>
                  {crawl?.updates.length ? (
                    <ul>
                      {crawl.updates.map((crawlUpdate) => {
                        return (
                          <li>
                            {crawlUpdate.status} - {crawlUpdate.createdAt}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p>There are no matching re-crawls for this monitor.</p>
                  )}
                </div>
              );
            })
          : null}
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
