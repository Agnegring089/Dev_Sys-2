import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Button } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";

// Defina os parâmetros esperados pela navegação
type RootStackParamList = {
  Home: undefined;
  UserDetails: { userId: number };
  EditUser: { userId: number }; // Adicione a rota para EditUser
};

// Defina os tipos para as props da tela de detalhes
type UserDetailsScreenRouteProp = RouteProp<RootStackParamList, "UserDetails">;

type UserDetailsScreenProps = {
  route: UserDetailsScreenRouteProp;
};

// Defina o tipo do usuário que você vai buscar
type User = {
  id: number;
  name: string;
  email: string;
  login: string;
  city: string;
};

const UserDetailsScreen: React.FC<UserDetailsScreenProps> = ({ route }) => {
  const { userId } = route.params; // Pega o userId dos parâmetros da rota
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Use o hook de navegação
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://192.168.100.107:3000/users/${userId}` // Busca da sua API local
        );
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

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
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.detail}>Email: {user.email}</Text>
      <Text style={styles.detail}>Login: {user.login}</Text>
      <Text style={styles.detail}>Cidade: {user.city}</Text>

      {/* Adicionando o botão para editar o usuário */}
      <Button
        title="Editar Usuário"
        onPress={() => navigation.navigate("EditUser", { userId })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserDetailsScreen;
