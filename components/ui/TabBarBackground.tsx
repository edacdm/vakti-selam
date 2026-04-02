import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabBarBackground() {
  return <BlurView tint="default" intensity={50} style={{ flex: 1 }} />;
}

export function useBottomTabOverflow() {
  const insets = useSafeAreaInsets();
  return insets.bottom;
}

