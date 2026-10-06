import { Link, Stack } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Ups!' }} />
      <ThemedView
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}
      >
        <ThemedText type="title">Esta pantalla no existe.</ThemedText>
        <Link href="/" style={{ marginTop: 15, paddingVertical: 15 }}>
          <ThemedText type="link">Ir a la pantalla de inicio!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}
