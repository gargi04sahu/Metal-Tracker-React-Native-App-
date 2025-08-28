import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MetalPrice, MarketSummary, RootStackParamList } from '../types/MetalTypes';
import MetalCard from '../components/MetalCard';
import MetalApiService from '../services/MetalApiService';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [metalPrices, setMetalPrices] = useState<MetalPrice[]>([]);
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (showRefresh: boolean = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setIsLoading(true);
      
      setError(null);
      
      const prices = await MetalApiService.getAllMetalPrices();
      const summary = await MetalApiService.getMarketSummary(prices);
      
      setMetalPrices(prices);
      setMarketSummary(summary);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch metal prices');
      Alert.alert(
        'Connection Error',
        'Unable to fetch live prices. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  const handleMetalPress = (metal: string) => {
    navigation.navigate('MetalDetail', { metal });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>₹</Text>
          </View>
          <Text style={styles.title}>MetalTracker</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.marketStatus}>
            <View style={styles.liveIndicator} />
            <Text style={styles.marketText}>Markets Open</Text>
          </View>
          <Text style={styles.timeText}>{getCurrentTime()}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFD700"
          />
        }
      >
        {/* Page Title */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Live Precious Metal Prices</Text>
          <Text style={styles.subtitle}>Real-time pricing in Indian Rupees</Text>
        </View>

        {/* Metal Price Cards */}
        <View style={styles.cardsContainer}>
          {['gold', 'silver', 'platinum', 'palladium'].map((metalType) => {
            const metalData = metalPrices.find(p => p.metal === metalType);
            return (
              <MetalCard
                key={metalType}
                metal={metalData || null}
                isLoading={isLoading && !metalData}
                error={error}
                onPress={() => handleMetalPress(metalType)}
              />
            );
          })}
        </View>

        {/* Market Summary */}
        {marketSummary && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Market Summary</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{marketSummary.metalsUp}</Text>
                <Text style={styles.summaryLabel}>Metals Up</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValueDown}>{marketSummary.metalsDown}</Text>
                <Text style={styles.summaryLabel}>Metals Down</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[
                  styles.summaryValue,
                  { color: marketSummary.avgChange >= 0 ? '#10B981' : '#EF4444' }
                ]}>
                  {marketSummary.avgChange >= 0 ? '+' : ''}{marketSummary.avgChange.toFixed(2)}%
                </Text>
                <Text style={styles.summaryLabel}>Avg Change</Text>
              </View>
            </View>
          </View>
        )}

        {/* Auto Refresh Status */}
        <View style={styles.refreshStatus}>
          <View style={styles.refreshIndicator} />
          <Text style={styles.refreshText}>Auto-refreshing every 30 seconds</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  marketStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  marketText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  cardsContainer: {
    paddingBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  summaryValueDown: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  refreshStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  refreshIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  refreshText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default HomeScreen;