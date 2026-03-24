import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

export function IconSymbol({
  name,
  size = 24,
  color,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  return (
    <Ionicons
      name={Platform.OS === "ios" ? (name as any) : (name.replace(".fill", "") as any)}
      size={size}
      color={color}
    />
  );
}
