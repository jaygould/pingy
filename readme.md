# Pingy

#### A webpage monitoring web application built with modern tech client and server side tech.

> This project is currently built for the purpose of learning the various tech involved, and is not a production ready solution, yet.

![Pingy screenshot](https://res.cloudinary.com/jaygould/image/upload/v1660402254/pingy/git-image.png)

## Features

- Fully functional authentication system using JSON Web Tokens and cookies
- Client side route authorization using higher order functions around Next.js `getServerSideProps`
- Server side route authorization using Fastify route protection
- User can enter web page URL which is saved to database and, depending on selection options, crawled periodically:
  - For changes in the page _text_ (not HTML level, as this tends to change on most page requests due to front end security measures)
  - To determine if the webpage is down (i.e. returns any status code other than 200)
- Sends alert to use via email based on their selected criteria
- Gives users a dashboard view of their current monitoring

## Tech

Both front and back end written in TypeScript, making use of strong typing for client side, re-usable generic components, and server side typed classes.

- TypeScript
- Next.js & React
- Styled Components
- JWT authentication
- Fastify server
- Prisma database
- Cheerio for page crawling
- Postmark API for sending email alerts
