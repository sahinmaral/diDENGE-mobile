import { fetch } from "@react-native-community/netinfo";

class NetworkHandler {
  async checkNetworkConnection() {
    const networkState = await fetch();
    const isNetworkConnected =
      networkState.type !== "unknown" && networkState.isConnected;
    return isNetworkConnected;
  }
}

export default NetworkHandler