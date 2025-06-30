import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginScreenProps {
  navigation?: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Dados mock para login
  const mockUsers = [
    {
      id: 'driver-1',
      email: 'joao@logitrack.com',
      password: '123456',
      name: 'João Silva Santos',
      phone: '(13) 99821-1234',
      vehicle: 'Moto Honda CG 160',
      photo: null,
    },
    {
      id: 'driver-2',
      email: 'maria@logitrack.com',
      password: '123456',
      name: 'Maria das Graças',
      phone: '(13) 99765-4321',
      vehicle: 'Carro Fiat Uno',
      photo: null,
    },
  ];

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    // Simular delay de rede
    setTimeout(async () => {
      const user = mockUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (user) {
        try {
          // Salvar dados no AsyncStorage
          await AsyncStorage.setItem('auth_data', JSON.stringify(user));
          
          // A navegação será automaticamente tratada pelo AppNavigator
          // que detecta mudanças no estado de autenticação
          
        } catch (error) {
          console.error('Erro ao salvar dados de autenticação:', error);
          Alert.alert('Erro', 'Não foi possível fazer login. Tente novamente.');
        }
      } else {
        Alert.alert(
          'Erro de Login',
          'Email ou senha incorretos.\n\nUsuários de teste:\n• joao@logitrack.com\n• maria@logitrack.com\nSenha: 123456'
        );
      }

      setIsLoading(false);
    }, 1000);
  };

  const fillTestCredentials = (userIndex: number) => {
    const user = mockUsers[userIndex];
    setEmail(user.email);
    setPassword(user.password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo e Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="car-sport" size={60} color="#007AFF" />
            </View>
            <Text style={styles.title}>LogiTrack</Text>
            <Text style={styles.subtitle}>Entregador</Text>
            <Text style={styles.description}>
              Faça login para acessar suas entregas
            </Text>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.loginButtonText}>Entrando...</Text>
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Usuários de teste */}
          <View style={styles.testUsers}>
            <Text style={styles.testUsersTitle}>👨‍💻 Usuários de Teste</Text>
            
            <TouchableOpacity
              style={styles.testUserButton}
              onPress={() => fillTestCredentials(0)}
            >
              <View style={styles.testUserInfo}>
                <Ionicons name="person" size={24} color="#007AFF" />
                <View style={styles.testUserDetails}>
                  <Text style={styles.testUserName}>João Silva Santos</Text>
                  <Text style={styles.testUserEmail}>joao@logitrack.com</Text>
                  <Text style={styles.testUserVehicle}>Moto Honda CG 160</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.testUserButton}
              onPress={() => fillTestCredentials(1)}
            >
              <View style={styles.testUserInfo}>
                <Ionicons name="person" size={24} color="#4CAF50" />
                <View style={styles.testUserDetails}>
                  <Text style={styles.testUserName}>Maria das Graças</Text>
                  <Text style={styles.testUserEmail}>maria@logitrack.com</Text>
                  <Text style={styles.testUserVehicle}>Carro Fiat Uno</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              LogiTrack © 2025 - Versão MVP
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    padding: 8,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  testUsers: {
    marginBottom: 32,
  },
  testUsersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  testUserButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  testUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testUserDetails: {
    marginLeft: 12,
    flex: 1,
  },
  testUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  testUserEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  testUserVehicle: {
    fontSize: 12,
    color: '#999',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
