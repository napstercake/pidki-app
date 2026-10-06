import CircleDetailsContent from "@/components/flow/circle-details/CircleDetailsContent";
import { Stack } from "expo-router";

export default function CircleDetailsScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CircleDetailsContent />
    </>
  );
}
