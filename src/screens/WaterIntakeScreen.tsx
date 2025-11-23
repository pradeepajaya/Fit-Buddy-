import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

interface WaterEntry {
  date: string;
  amount: number;
}

const WaterIntakeScreen = () => {
  const [todayAmount, setTodayAmount] = useState(0);
  const [goal] = useState(2000);
  const [history, setHistory] = useState<WaterEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem('waterHistory');
      if (stored) {
        const data = JSON.parse(stored);
        setHistory(data);
        
        const today = new Date().toDateString();
        const todayData = data.find((item: WaterEntry) => item.date === today);
        if (todayData) {
          setTodayAmount(todayData.amount);
        }
      }
    } catch (error) {
      console.error('Error loading water data:', error);
    }
  };

  const saveData = async (newHistory: WaterEntry[]) => {
    try {
      await AsyncStorage.setItem('waterHistory', JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Error saving water data:', error);
    }
  };

  const addWater = (amount: number) => {
    const today = new Date().toDateString();
    const newAmount = todayAmount + amount;
    setTodayAmount(newAmount);

    const updatedHistory = [...history];
    const todayIndex = updatedHistory.findIndex((item) => item.date === today);

    if (todayIndex >= 0) {
      updatedHistory[todayIndex].amount = newAmount;
    } else {
      updatedHistory.unshift({ date: today, amount: newAmount });
    }

    saveData(updatedHistory);
  };

  const addCustomAmount = () => {
    const amount = parseInt(customAmount);
    if (!isNaN(amount) && amount > 0) {
      addWater(amount);
      setCustomAmount('');
      setShowAddModal(false);
    }
  };

  const percentage = Math.min((todayAmount / goal) * 100, 100);

  const quickAmounts = [250, 500, 750, 1000];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Water Intake</Text>
          <Text style={styles.subtitle}>Stay hydrated</Text>
        </View>

        {/* Main Water Display */}
        <View style={styles.mainCard}>
          <LinearGradient
            colors={['#3b82f6', '#06b6d4']}
            style={styles.waterCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.waterContent}>
              <Icon name="water" size={48} color="#ffffff" />
              <Text style={styles.waterAmount}>{todayAmount}ml</Text>
              <Text style={styles.waterGoal}>of {goal}ml</Text>
              <View style={styles.waterProgress}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressBar, { width: `${percentage}%` }]} />
                </View>
                <Text style={styles.progressText}>{percentage.toFixed(0)}%</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Add Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickGrid}>
            {quickAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickButton}
                onPress={() => addWater(amount)}
              >
                <LinearGradient
                  colors={['#3b82f6', '#2563eb']}
                  style={styles.quickGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="add-circle-outline" size={24} color="#ffffff" />
                  <Text style={styles.quickAmount}>{amount}ml</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.customButton}
            onPress={() => setShowAddModal(true)}
          >
            <Icon name="create-outline" size={20} color="#3b82f6" />
            <Text style={styles.customButtonText}>Custom Amount</Text>
          </TouchableOpacity>
        </View>

        {/* History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>History</Text>
          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="water-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>No water logged yet</Text>
            </View>
          ) : (
            history.slice(0, 7).map((entry, index) => {
              const entryDate = new Date(entry.date);
              const isToday = entry.date === new Date().toDateString();
              const entryPercentage = (entry.amount / goal) * 100;

              return (
                <View key={index} style={styles.historyCard}>
                  <View style={styles.historyIcon}>
                    <Icon name="water" size={20} color="#3b82f6" />
                  </View>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyDate}>
                      {isToday ? 'Today' : entryDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </Text>
                    <View style={styles.historyBar}>
                      <View
                        style={[
                          styles.historyBarFill,
                          { width: `${Math.min(entryPercentage, 100)}%` },
                        ]}
                      />
                    </View>
                  </View>
                  <Text style={styles.historyAmount}>{entry.amount}ml</Text>
                </View>
              );
            })
          )}
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <View style={styles.tipCard}>
            <Icon name="bulb-outline" size={24} color="#f59e0b" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Hydration Tip</Text>
              <Text style={styles.tipText}>
                Drink water consistently throughout the day rather than all at once
                for better absorption.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Custom Amount Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Custom Amount</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter amount in ml"
              keyboardType="numeric"
              value={customAmount}
              onChangeText={setCustomAmount}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonAdd]}
                onPress={addCustomAmount}
              >
                <LinearGradient
                  colors={['#3b82f6', '#2563eb']}
                  style={styles.modalButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.modalButtonText}>Add</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  mainCard: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  waterCircle: {
    borderRadius: 200,
    padding: 40,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  waterContent: {
    alignItems: 'center',
  },
  waterAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
  },
  waterGoal: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  waterProgress: {
    marginTop: 20,
    alignItems: 'center',
  },
  progressTrack: {
    width: width - 120,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 8,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickButton: {
    width: (width - 64) / 2,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  quickAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  customButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    gap: 8,
  },
  customButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyContent: {
    flex: 1,
    marginLeft: 12,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  historyBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  historyBarFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 12,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#fffbeb',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#78350f',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width - 80,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalButtonCancel: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonTextCancel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  modalButtonAdd: {},
  modalButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default WaterIntakeScreen;
