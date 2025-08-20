// App.jsx

import _React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  const [message, setMessage] = useState('Welcome to Nucleus');

  useEffect(() => {
    // Simulate async onboarding or data fetch
    const timer = setTimeout(() => {
      setMessage('Modular SaaS OS activated 🚀');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  text: {
    fontSize: 20,
    color: '#facc15',
    fontWeight: '600',
  },
});
