import "tailwindcss/tailwind.css";
import "toasted-notes/src/styles.css";
import { RecoilRoot } from "recoil";
import axios from "axios";
axios.defaults.baseURL = "https://apikasir.kaostory.id/";
axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
