import React, { FC, useState } from "react";
import Layout from "../../components/Layout";
import withAuthentication from "../../services/with-authentication";
import Link from "next/link";
import styled from "styled-components";

const DashboardImage = styled.div`
  margin: 3em 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    max-width: 600px;
    width: 80%;
  }
`;

type Props = {
  name: string;
};

const Dashboard: FC<Props> = ({ name }) => {
  return (
    <Layout isLoggedIn={true}>
      <>
        <h1>Welcome, {name}</h1>

        <p>
          You can now start monitoring web pages. Relax while we check for
          updates and send you an alert when we see one.
        </p>

        <DashboardImage>
          <img src="/dashboard-landing.svg" />
        </DashboardImage>
      </>
    </Layout>
  );
};

export const getServerSideProps = withAuthentication(
  (
    context,
    props
  ): {
    props: Props;
  } => {
    // Type sp props MUST have name?
    return {
      props: {
        name: props.name,
      },
    };
  }
);

export default Dashboard;
