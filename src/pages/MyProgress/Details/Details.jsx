import WebView from "react-native-webview";
import applicationBasedResultGraph from "../../../charts/applicationBasedResult/index.html";

function Details() {
  return <WebView source={applicationBasedResultGraph} />;
}

export default Details;
