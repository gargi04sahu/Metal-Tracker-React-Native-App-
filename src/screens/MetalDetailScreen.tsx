import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MetalPrice, RootStackParamList } from '../types/MetalTypes';
import MetalApiService from '../services/MetalApiService';

type MetalDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MetalDetail'>;
type MetalDetailScreenRouteProp = RouteProp<RootStackParamList, 'MetalDetail'>;

interface MetalDetailScreenProps {
  navigation: MetalDetailScreenNavigationProp;
  route: MetalDetailScreenRouteProp;
}

const MetalDetailScreen: React.FC<MetalDetailScreenProps> = ({ navigation, route }) => {
  const { metal } = route.params;
  const [metalData, setMetalData] = useState<MetalPrice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetalData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await MetalApiService.getMetalPrice(metal);
      setMetalData(data);
    } catch (err) {
      console.error(`Error fetching ${metal} price:`, err);
      setError('Failed to fetch metal details');
      Alert.alert(
        'Error',
        'Failed to load metal details. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [metal]);

  useEffect(() => {
    fetchMetalData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchMetalData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchMetalData]);

  const getMetalConfig = (metalType: string) => {
    switch (metalType) {
      case 'gold': return { color: '#FFD700', name: 'Gold (24K)' };
      case 'silver': return { color: '#C0C0C0', name: 'Silver' };
      case 'platinum': return { color: '#5B9BD5', name: 'Platinum' };
      case 'palladium': return { color: '#9966CC', name: 'Palladium' };
      default: return { color: '#FFD700', name: 'Gold (24K)' };
    }
  };

  const config = getMetalConfig(metal);

  if (!['gold', 'silver', 'platinum', 'palladium'].includes(metal)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Invalid Metal</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Failed to Load Details</Text>
          <Text style={styles.errorText}>Unable to fetch metal price information</Text>
          <View style={styles.errorButtons}>
            <TouchableOpacity style={styles.retryButton} onPress={fetchMetalData}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MetalTracker</Text>
        <View style={styles.marketStatus}>
          <View style={styles.liveIndicator} />
          <Text style={styles.marketText}>Live</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.detailCard}>
          {/* Metal Header */}
          <View style={styles.metalHeader}>
            <View style={styles.metalInfo}>
              <View style={[styles.icon, { backgroundColor: `${config.color}20` }]}>
                <View style={[styles.iconDot, { backgroundColor: config.color }]} />
              </View>
              <View>
                <Text style={styles.metalName}>{config.name} Details</Text>
                {metalData && <Text style={styles.metalSymbol}>{metalData.symbol}</Text>}
              </View>
            </View>
          </View>

          {/* Content */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingText}>Loading metal details...</Text>
            </View>
          ) : metalData ? (
            <View style={styles.dataContainer}>
              {/* Current Price */}
              <View style={styles.priceContainer}>
                <Text style={styles.currentPrice}>₹{metalData.price.toFixed(2)}</Text>
                <View style={styles.changeRow}>
                  <Text style={[
                    styles.changeText,
                    { color: metalData.change >= 0 ? '#10B981' : '#EF4444' }
                  ]}>
                    {metalData.change >= 0 ? '+' : ''}₹{metalData.change.toFixed(2)} 
                    ({metalData.change >= 0 ? '+' : ''}{metalData.changePercent.toFixed(2)}%)
                  </Text>
                </View>
              </View>

              {/* Market Data Grid */}
              <View style={styles.dataGrid}>
                <View style={styles.dataRow}>
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>Previous Open</Text>
                    <Text style={styles.dataValue}>₹{metalData.previousOpen.toFixed(2)}</Text>
                  </View>
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>Previous Close</Text>
                    <Text style={styles.dataValue}>₹{metalData.previousClose.toFixed(2)}</Text>
                  </View>
                </View>
                <View style={styles.dataRow}>
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>Day's High</Text>
                    <Text style={styles.dataValue}>₹{metalData.dayHigh.toFixed(2)}</Text>
                  </View>
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>Day's Low</Text>
                    <Text style={styles.dataValue}>₹{metalData.dayLow.toFixed(2)}</Text>
                  </View>
                </View>
              </View>

              {/* Additional Details */}
              <View style={styles.detailsList}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>52 Week High</Text>
                  <Text style={styles.detailValue}>₹{metalData.weekHigh52.toFixed(2)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>52 Week Low</Text>
                  <Text style={styles.detailValue}>₹{metalData.weekLow52.toFixed(2)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Volume</Text>
                  <Text style={styles.detailValue}>{metalData.volume}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Last Updated</Text>
                  <Text style={styles.detailValue}>
                    {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })} {metalData.lastUpdate}
                  </Text>
                </View>
              </View>

              {/* Auto Refresh Status */}
              <View style={styles.refreshStatus}>
                <View style={styles.refreshIndicator} />
                <Text style={styles.refreshText}>Auto-refreshing every 30 seconds</Text>
              </View>
            </View>
          ) : null}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backArrow: {
    fontSize: 24,
    color: '#9CA3AF',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9FAFB',
    flex: 1,
    textAlign: 'center',
  },
  marketStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  marketText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  detailCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    overflow: 'hidden',
  },
  metalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  metalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  metalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  metalSymbol: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 12,
  },
  dataContainer: {
    padding: 16,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  currentPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  changeRow: {
    alignItems: 'center',
  },
  changeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dataGrid: {
    marginBottom: 24,
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dataItem: {
    flex: 1,
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  dataLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  detailsList: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  detailLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F9FAFB',
  },
  refreshStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#111827',
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#F9FAFB',
    fontWeight: '500',
  },
});

export default MetalDetailScreen;