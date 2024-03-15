import React from "react";
import WebView from "react-native-webview";
import container from "../../charts/container.html";

function ChartLoader({ chartJsCode, customClassName }) {
  return (
    <WebView
      className={customClassName}
      source={container}
      scrollEnabled={false}
      injectedJavaScript={chartJsCode}
      javaScriptEnabled={true}
      originWhitelist={["*"]}
      injectedJavaScriptBeforeContentLoaded={chartJsCode}
    />
  );
}

export default ChartLoader;
