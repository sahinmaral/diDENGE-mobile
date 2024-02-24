import Container from "../../components/Container/Container";
import { Text } from "react-native";

function ResultOfAddictiveLevel({ route }) {
  const { addictiveLevelPoint } = route.params;

  return (
    <Container customClasses={"justify-center items-center"}>
      <Text className="text-white text-[35px] font-semibold">Sonuç</Text>
    </Container>
  );
}

export default ResultOfAddictiveLevel;
