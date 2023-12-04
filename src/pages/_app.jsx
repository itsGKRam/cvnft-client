import useThemeStore from "@/config/store/useThemeStore";
import "@/styles/globals.css";
import { MantineProvider } from "@mantine/core";
import { Sepolia } from "@thirdweb-dev/chains";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import "node_modules/video-react/dist/video-react.css";
import React from "react";


export default function App({ Component, pageProps }) {

  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const [themeMode, setThemeMode] = React.useState(theme);
  const getLayout = Component.getLayout || ((page) => page);

  const toggleColorScheme = (value) => {
    setThemeMode(value || (themeMode === "light" ? "dark" : "light"));
  };

  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  // console.log(Sepolia)



  return (
    <ThirdwebProvider activeChain={Sepolia} clientId="ad65a094248b8e9354ea0da0fb3e73dd" >
      <MantineProvider
        // withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
          defaultRadius: "sm",
          primaryColor: "blue",
          dir: "ltr",
          loader: "dots",
        }}
        defaultProps={{
          Container: {
            size: "lg",
          },
        }}
      >
        {getLayout(<Component {...pageProps} key={router.route} />)}
      </MantineProvider>
    </ThirdwebProvider>
  );
}
