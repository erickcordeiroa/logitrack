import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { DeliveriesScreen } from '../screens/DeliveriesScreen';
import { DeliveryDetailsScreen } from '../screens/DeliveryDetailsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { LoadingScreen } from '../components/LoadingScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator para as telas de entregas
const DeliveriesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DeliveriesList"
        component={DeliveriesScreen}
        options={{ 
          headerShown: false, // Removendo o header para usar apenas o conteúdo da tela
        }}
      />
      <Stack.Screen
        name="DeliveryDetails"
        component={DeliveryDetailsScreen}
        options={{
          headerTitle: 'Detalhes da Entrega',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
    </Stack.Navigator>
  );
};

// Stack Navigator para o mapa
const MapStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MapView"
        component={HomeScreen}
        options={{ 
          headerShown: false, // Removendo o header para usar apenas o conteúdo da tela
        }}
      />
    </Stack.Navigator>
  );
};

// Stack Navigator para o perfil
const ProfileStack = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        options={{ 
          headerShown: false, // Removendo o header para usar apenas o conteúdo da tela
        }}
      >
        {(props: any) => <SettingsScreen {...props} user={user} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          headerTitle: 'Estatísticas',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
    </Stack.Navigator>
  );
};
const MainTabs = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        tabBarIcon: ({ focused, color, size }: any) => {
          let iconName: string;

          if (route.name === 'Deliveries') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Deliveries"
        component={DeliveriesStack}
        options={{
          tabBarLabel: 'Entregas',
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapStack}
        options={{
          tabBarLabel: 'Mapa',
        }}
      />
      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Perfil',
        }}
      >
        {() => <ProfileStack user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// Auth Stack Navigator
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

// Root Navigator
export const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuthState();
    
    // Verificar mudanças no AsyncStorage periodicamente (para detectar login)
    const interval = setInterval(checkAuthState, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const checkAuthState = async () => {
    try {
      const authData = await AsyncStorage.getItem('auth_data');
      if (authData) {
        const userData = JSON.parse(authData);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('auth_data');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (isAuthenticated === null) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <MainTabs user={user} onLogout={handleLogout} />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};
