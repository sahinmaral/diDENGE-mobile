import React, { useEffect, useRef } from "react";
import WebView from "react-native-webview";
import container from "../../charts/container.html";

function ChartLoader({ chartJsCode, customClassName }) {
  const webViewRef = useRef(null);

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  }, [chartJsCode]);

  return (
    <WebView
      ref={webViewRef}
      className={customClassName}
      source={container}
      scrollEnabled={false}
      injectedJavaScript={chartJsCode}
      javaScriptEnabled={true}
      originWhitelist={["*"]}
    />
  );
}

export default ChartLoader;
