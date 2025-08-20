// App.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zixuttcztlqtgukgeffb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Replace with full anon key
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [email, setEmail] = useState('');
  const [session, setSession] = useState(null);
  const [title, setTitle] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) fetchDecayItems();
    };
    checkSession();
  }, []);

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Check your email for the magic link!');
  };

  const fetchDecayItems = async () => {
    const { data, error } = await supabase
      .from('decay_items')
      .select('*')
      .order('decay_score', { ascending: false });

    if (!error) setItems(data);
  };

  const addDecayItem = async () => {
    if (!title) return;
    const { error } = await supabase
      .from('decay_items')
      .insert([{ title, last_used: new Date().toISOString(), decay_score: 0 }]);

    if (!error) {
      setTitle('');
      fetchDecayItems();
    }
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>🧠 Welcome to DecayRadar</Text>
        <Text style={styles.sub}>Track what’s fading from your workflow.</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Button title="Send Magic Link" onPress={signIn} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📉 DecayRadar</Text>
      <TextInput
        style={styles.input}
        placeholder="Add item title..."
        value={title}
        onChangeText={setTitle}
      />
      <Button title="Add Item" onPress={addDecayItem} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemScore}>Decay Score: {item.decay_score}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  sub: { fontSize: 16, marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  item: { padding: 10, borderBottomWidth: 1 },
  itemTitle: { fontSize: 18 },
  itemScore: { fontSize: 14, color: 'gray' }
});
