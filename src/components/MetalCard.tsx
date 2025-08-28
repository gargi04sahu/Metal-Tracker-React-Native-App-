import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { MetalPrice } from '../types/MetalTypes';

interface MetalCardProps {
  metal: MetalPrice | null;
  isLoading: boolean;
  error?: string | null;
  onPress: () => void;
}

const MetalCard: React.FC<MetalCardProps> = ({ metal, isLoading, error, onPress }) => {
  if (error) {
    return (
      <View style={styles.errorCard}>
        <Text style={styles.errorTitle}>Error Loading Price</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (isLoading || !metal) {
    return (
      <View style={styles.loadingCard}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const isPositive = metal.change >= 0;
  const metalColor = getMetalColor(metal.metal);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.metalInfo}>
          <View style={[styles.icon, { backgroundColor: `${metalColor}20` }]}>
            <View style={[styles.iconDot, { backgroundColor: metalColor }]} />
          </View>
          <View>
            <Text style={styles.metalName}>{metal.name}</Text>
            <Text style={styles.metalSymbol}>{metal.symbol}</Text>
          </View>
        </View>
        <View style={styles.liveIndicator} />
      </View>
      
      <View style={styles.priceSection}>
        <Text style={styles.price}>₹{metal.price.toFixed(2)}</Text>
        <View style={styles.changeContainer}>
          <Text style={[styles.change, { color: isPositive ? '#10B981' : '#EF4444' }]}>
            {isPositive ? '+' : ''}₹{metal.change.toFixed(2)}
          </Text>
          <Text style={[styles.changePercent, { color: isPositive ? '#10B981' : '#EF4444' }]}>
            ({isPositive ? '+' : ''}{metal.changePercent.toFixed(2)}%)
          </Text>
        </View>
        <Text style={styles.lastUpdate}>Last updated: {metal.lastUpdate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const getMetalColor = (metal: string): string => {
  switch (metal) {
    case 'gold': return '#FFD700';
    case 'silver': return '#C0C0C0';
    case 'platinum': return '#5B9BD5';
    case 'palladium': return '#9966CC';
    default: return '#FFD700';
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  loadingCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  errorCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  metalSymbol: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  priceSection: {
    alignItems: 'flex-start',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  change: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  changePercent: {
    fontSize: 14,
  },
  lastUpdate: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default MetalCard;