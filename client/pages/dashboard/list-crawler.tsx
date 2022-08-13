import React, { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Layout from "../../components/Layout";
import withAuthentication from "../../services/with-authentication";
import axios from "axios";
import GlobalMessage from "../../components/GlobalMessage";
import Accordion from "../../components/Accordion";

import { IMessage, TGetResponse } from "../../types/index";
import { TGroupedCrawls } from "../../types/crawler.types";

type Props = {};

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

  return (
    <Layout isLoggedIn={true}>
      <>
        <h2>Current Monitoring</h2>

        <div>
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
