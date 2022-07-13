## Bubble Chat
Live chat powered by [Twilio](https://www.twilio.com). <br />
Created to participate in a hackathon hosted by [midudev](https://www.github.com/midudev).

<!-- ## 🚀 Preview
App preview before deadline and project review: <br />
<div style="display:flex; flex-direction:column; text-align:center; align-items:center; gap:1em;">
  <div style="display:flex; gap:1em; justify-content:center;">
    <img src="preview/preview-1.png" alt="Preview of Climatic on an iPhone 12 PRO MAX" width="35%"/>
    <img src="preview/preview-2.png" alt="Preview of Climatic on an iPad PRO 11" width="55%"/>
  </div>
  <img src="preview/preview-3.png" alt="Preview of Climatic on a Mackbook Air" width="90%"/>
</div>
> Screenshots provided by [webmobilefirst](https://www.webmobilefirst.com/en/). -->

## 👨‍💻 Hackathon Info
- The hackathon goal was build a live and secure text chat (*mobile-first* or *mobile-only*) using [Twilio](https://www.twilio.com) messaging API.
- Announced at **[2022/07/01](https://www.twitch.tv/videos/1519558242)**.
- Deadline: **2022/07/20**.

## 🚀 Preview
- [Demo](https://bubble-peach.vercel.app)

## 🛠️ Technologies
- [TypeScript](https://github.com/microsoft/TypeScript)
- [NextJS](https://github.com/vercel/next.js/)
- [ChakraUI](https://github.com/chakra-ui/chakra-ui)
- [Zustand](https://github.com/pmndrs/zustand)
- [tRPC](https://github.com/trpc/trpc)
- [Prisma](https://github.com/prisma/prisma)
- [Supabase](https://github.com/supabase/supabase)
- [next-auth](https://github.com/nextauthjs/next-auth)
- [next-seo](https://github.com/garmeeh/next-seo)
- [zod](https://github.com/colinhacks/zod)
- [Twilio Conversations API](https://www.twilio.com/messaging/conversations-api)

## 🧰 Requirements
- [NodeJS](https://nodejs.org)
- [A Twilio account](https://www.twilio.com)
- [Twilio Token Service](https://github.com/marsidev/twilio-token-service)

## ✨ Getting Started

### 1. Create a [Twilio Token Service](https://github.com/marsidev/twilio-token-service).
This is a service to generate a [Twilio Access Token](https://www.twilio.com/docs/iam/access-tokens), using [Twilio Functions](https://www.twilio.com/docs/runtime/functions). The token provides grant for [Chat](https://www.twilio.com/docs/api/chat) and [Video](https://www.twilio.com/docs/api/video). Created using [Twilio official guide](https://www.twilio.com/blog/generate-access-token-twilio-chat-video-voice-using-twilio-functions).

### 2. Create a [Supabase](https://app.supabase.com/) project.

### 3. [Create](https://docs.github.com/es/developers/apps/building-oauth-apps/creating-an-oauth-app) a GitHub App.

### 4. Clone this project using one of these ways:
- [Forking](https://github.com/marsidev/bubble/fork) the repository
- Cloning the repository locally
  ```bash
  git clone https://github.com/marsidev/bubble
  cd bubble
  ```
 
### 5. Set environment variables
Create an `.env` file in the root of your project and add the following values:
```bash
TWILIO_TOKEN_SERVICE_URL=
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GITHUB_ID=
GITHUB_SECRET=
```
> Fill the `TWILIO_TOKEN_SERVICE_URL` with the token service URL generated in step 1.

> Fill the `DATABASE_URL` with the URL of your Supabase Database, under `Settings > Database > Connection string > Nodejs`.

> Fill the `NEXTAUTH_SECRET` with a secret string.

> Fill the `GITHUB_ID` and `GITHUB_SECRET` with the GitHub App credentials generated in step 3.

### 6. Install dependencies
```bash
pnpm install
```

### 7. Run the project
```bash
npx prisma migrate dev
npx prisma generate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ℹ️ Credits
<a target="_blank" href="https://icons8.com/icon/EEnPFPeiIW8t/whatsapp">Logo icon</a> by <a target="_blank" href="https://icons8.com">Icons8</a>

## 🤝 Contributing
Contributions, issues and feature requests are welcome!
Feel free to check [issues page](https://github.com/marsidev/bubble/issues).
