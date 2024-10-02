import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { RouteProp } from "@react-navigation/native";
import axios from "axios";

// Defina os parâmetros esperados pela navegação
type RootStackParamList = {
  Home: undefined;
  UserDetails: { userId: number };
  EditUser: { userId: number };
};

// Defina os tipos para as props da tela de edição
type EditUserScreenRouteProp = RouteProp<RootStackParamList, "EditUser">;

type EditUserScreenProps = {
  route: EditUserScreenRouteProp;
};

// Defina o tipo do usuário
type User = {
  id: number;
  name: string;
  email: string;
  login: string;
  password: string;
  city: string;
};

const UserEditScreen: React.FC<EditUserScreenProps> = ({ route }) => {
  const { userId } = route.params; // Pega o userId dos parâmetros da rota
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // Estado para indicar que está salvando

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.100.107:3000/users/${userId}`); // Altere para o seu IP
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    try {
      await axios.put(`http://192.168.100.107:3000/users/${userId}`, {
        name: user.name,
        email: user.email,
        login: user.login,
        password: user.password,
        city: user.city,
      });
      Alert.alert("Sucesso", "Usuário atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      Alert.alert("Erro", "Houve um erro ao atualizar o usuário.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ea" />;
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text>Erro ao carregar os dados do usuário.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={user.name}
        onChangeText={(text) => setUser({ ...user, name: text })}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={user.email}
        onChangeText={(text) => setUser({ ...user, email: text })}
      />

      <Text style={styles.label}>Login</Text>
      <TextInput
        style={styles.input}
        value={user.login}
        onChangeText={(text) => setUser({ ...user, login: text })}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={user.password}
        onChangeText={(text) => setUser({ ...user, password: text })}
        secureTextEntry
      />

      <Text style={styles.label}>Cidade</Text>
      <TextInput
        style={styles.input}
        value={user.city}
        onChangeText={(text) => setUser({ ...user, city: text })}
      />

      <Button title={saving ? "Salvando..." : "Salvar"} onPress={handleSave} disabled={saving} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
    marginBottom: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserEditScreen;
