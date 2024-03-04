import WebView from "react-native-webview";
import dailyProgressResultGraph from "../../../charts/dailyProgressResult/index.html";

function Details() {
  return <WebView source={dailyProgressResultGraph} />;
}

export default Details;
