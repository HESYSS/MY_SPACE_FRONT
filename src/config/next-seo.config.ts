import { DefaultSeoProps } from "next-seo";

const backendUrl = process.env.DOMENIAN_URL;

const config: DefaultSeoProps = {
  titleTemplate: "%s | MySpace",
  defaultTitle: "MySpace – Мрії мають свою адресу",
  description:
    "Продаж та оренда квартир, будинків, офісів, складів, комерційної та новобудов у Києві та області.",

  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: `${backendUrl}`,
    site_name: "MySpace",
    images: [
      {
        url: `${backendUrl}/Frame153.svg`,
        width: 1200,
        height: 630,
        alt: "MySpace",
      },
    ],
  },
  twitter: {
    handle: "@MySpace",
    site: "@MySpace",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    { name: "robots", content: "index, follow" },
    { name: "application-name", content: "MySpace" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
  ],
  additionalLinkTags: [
    {
      rel: "icon",
      href: `${backendUrl}/Vector.png`,
    },
    {
      rel: "apple-touch-icon",
      href: `${backendUrl}/Vector.png`,
      sizes: "180x180",
    },
    {
      rel: "mask-icon",
      href: `${backendUrl}/Vector.png`,
      color: "#5bbad5",
    },
  ],
};

export default config;
