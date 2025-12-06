// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function ConvLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
