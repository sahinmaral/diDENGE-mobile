import React, { useEffect, useRef } from "react";
import WebView from "react-native-webview";

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
      source={{
        uri: "file:///android_asset/container.html",
      }}
      scrollEnabled={false}
      injectedJavaScript={chartJsCode}
      javaScriptEnabled={true}
      originWhitelist={["*"]}
    />
  );
}

export default ChartLoader;
