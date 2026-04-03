import { FC } from "react";
import { Box } from "@mui/material";
import {
  Hero,
  LogoStrip,
  FirstImageSection,
  FirstGeneralSection,
  SecondImageSection,
  SecondGeneralSection,
  ChatBoxSection,
} from "./subComponents";
import { Layout } from "../../layout";

export const Home: FC = () => {
  return (
    <Layout>
      <Box sx={{ backgroundColor: "background.default" }}>
        <Hero />
        <LogoStrip />
        <ChatBoxSection />
        <FirstImageSection />
        <FirstGeneralSection />
        <SecondImageSection />
        <SecondGeneralSection />
      </Box>
    </Layout>
  );
};