import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsScreenProps {
  user: any;
  onLogout: () => void;
  navigation?: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, onLogout, navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoOptimize, setAutoOptimize] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sair do App',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('auth_data');
              onLogout();
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              onLogout(); // Fazer logout mesmo se houver erro
            }
          }
        },
      ]
    );
  };

  const handleProfileEdit = () => {
    Alert.alert('Em Desenvolvimento', 'Funcionalidade de edição de perfil será implementada em breve.');
  };

  const handleStats = () => {
    // Navegar para tela de estatísticas
    if (navigation) {
      navigation.navigate('Stats');
    } else {
      Alert.alert('Em Desenvolvimento', 'Estatísticas detalhadas serão implementadas em breve.');
    }
  };

  const handleSupport = () => {
    Alert.alert(
      'Suporte',
      'Entre em contato conosco:\n\n📧 suporte@logitrack.com\n📱 (13) 99999-0000\n\nHorário: Segunda a Sexta, 8h às 18h'
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Sobre o LogiTrack',
      'LogiTrack Entregador v1.0.0\n\nSistema de gestão de entregas para otimizar rotas e melhorar a eficiência dos entregadores.\n\n© 2025 LogiTrack. Todos os direitos reservados.'
    );
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightComponent?: React.ReactNode,
    showArrow: boolean = true
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon as any} size={20} color="#007AFF" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && onPress && (
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header do Perfil */}
        <View style={styles.profileHeader}>
          <View style={styles.profilePicture}>
            <Ionicons name="person" size={40} color="#007AFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Usuário'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>
            <Text style={styles.profileVehicle}>
              <Ionicons name="car" size={14} color="#666" /> {user?.vehicle || 'Veículo não informado'}
            </Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleProfileEdit}>
            <Ionicons name="pencil" size={16} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Entregas hoje</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Taxa de sucesso</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Avaliação</Text>
          </View>
        </View>

        {/* Configurações de Entrega */}
        {renderSection('Configurações de Entrega', (
          <>
            {renderSettingItem(
              'map',
              'Otimização automática de rota',
              'Recalcula automaticamente a melhor rota',
              undefined,
              <Switch
                value={autoOptimize}
                onValueChange={setAutoOptimize}
                trackColor={{ false: '#ddd', true: '#007AFF' }}
              />,
              false
            )}
            {renderSettingItem(
              'notifications',
              'Notificações',
              'Receber alertas de novas entregas',
              undefined,
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#ddd', true: '#007AFF' }}
              />,
              false
            )}
            {renderSettingItem(
              'volume-high',
              'Sons',
              'Sons de notificação e alertas',
              undefined,
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#ddd', true: '#007AFF' }}
              />,
              false
            )}
          </>
        ))}

        {/* Aparência */}
        {renderSection('Aparência', (
          <>
            {renderSettingItem(
              'moon',
              'Modo escuro',
              'Tema escuro para uso noturno',
              undefined,
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#ddd', true: '#007AFF' }}
              />,
              false
            )}
          </>
        ))}

        {/* Conta */}
        {renderSection('Conta', (
          <>
            {renderSettingItem(
              'analytics',
              'Minhas Estatísticas',
              'Visualizar desempenho e métricas',
              handleStats
            )}
            {renderSettingItem(
              'person-circle',
              'Editar perfil',
              'Alterar dados pessoais e foto',
              handleProfileEdit
            )}
            {renderSettingItem(
              'lock-closed',
              'Alterar senha',
              'Modificar sua senha de acesso',
              () => Alert.alert('Em Desenvolvimento', 'Funcionalidade será implementada em breve.')
            )}
            {renderSettingItem(
              'card',
              'Formas de pagamento',
              'Gerenciar métodos de recebimento',
              () => Alert.alert('Em Desenvolvimento', 'Funcionalidade será implementada em breve.')
            )}
          </>
        ))}

        {/* Suporte */}
        {renderSection('Suporte', (
          <>
            {renderSettingItem(
              'help-circle',
              'Central de ajuda',
              'Perguntas frequentes e tutoriais',
              () => Alert.alert('Em Desenvolvimento', 'Central de ajuda será implementada em breve.')
            )}
            {renderSettingItem(
              'chatbubble-ellipses',
              'Falar com suporte',
              'Entre em contato conosco',
              handleSupport
            )}
            {renderSettingItem(
              'star',
              'Avaliar o app',
              'Deixe sua avaliação na loja',
              () => Alert.alert('Avaliação', 'Obrigado pelo interesse! Link para avaliação será implementado em breve.')
            )}
            {renderSettingItem(
              'information-circle',
              'Sobre o LogiTrack',
              'Versão e informações do app',
              handleAbout
            )}
          </>
        ))}

        {/* Botão de Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#ff4444" />
          <Text style={styles.logoutButtonText}>Sair do App</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>LogiTrack Entregador v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 44, // Espaço para status bar
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  profileVehicle: {
    fontSize: 12,
    color: '#999',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#fff',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#ff4444',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
