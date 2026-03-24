import { BlurView } from "expo-blur";

export default function TabBarBackground() {
  return <BlurView tint="default" intensity={50} style={{ flex: 1 }} />;
}
