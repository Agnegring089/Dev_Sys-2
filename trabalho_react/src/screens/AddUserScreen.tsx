import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';

interface User {
  name: string;
  email: string;
  login: string;
  password: string;
  city: string;
}

const AddUserScreen: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [city, setCity] = useState<string>('');

  const handleAddUser = () => {
    const newUser: User = { name, email, login, password, city };

    // Verifica se todos os campos estão preenchidos
    if (!name || !email || !login || !password || !city) {
      Alert.alert('Validation', 'Please fill out all fields.');
      return;
    }

    // Lógica para fazer requisição POST à API local (substituir a porta conforme necessário)
    fetch('http://192.168.100.107:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('User added:', data);
        Alert.alert('Success', 'User added successfully!');
        // Limpa os campos após a adição
        setName('');
        setEmail('');
        setLogin('');
        setPassword('');
        setCity('');
      })
      .catch((error) => {
        console.error('Error adding user:', error);
        Alert.alert('Error', 'There was an error adding the user.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Login"
        value={login}
        onChangeText={setLogin}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter City"
        value={city}
        onChangeText={setCity}
      />

      <Button title="Add User" onPress={handleAddUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
});

export default AddUserScreen;
