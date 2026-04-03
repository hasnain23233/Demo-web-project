// src/layout/MainLayout.tsx
import { FC, ReactNode, useState, useCallback } from "react";
import { Box }    from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { PageLoader } from "../../components/PageLoader";

interface LayoutProps { children: ReactNode; }

export const Layout: FC<LayoutProps> = ({ children }) => {
  const [loaderDone, setLoaderDone] = useState(false);

  const handleFinish = useCallback(() => setLoaderDone(true), []);

  return (
    <Box>
      {/* Loader — sits above everything until done */}
      <AnimatePresence>
        {!loaderDone && <PageLoader onFinish={handleFinish} />}
      </AnimatePresence>

      {/* Main content — fades in after loader finishes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaderDone ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      > 
        <Box>{children}</Box> 
      </motion.div>
    </Box>
  );
};