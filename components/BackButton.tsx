import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function BackButton() {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.button} onPress={() => router.back()}>
      <Text style={styles.text}>← Geri</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#326292",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    zIndex: 10,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});