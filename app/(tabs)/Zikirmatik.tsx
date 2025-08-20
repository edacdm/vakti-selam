import React, { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const zikirs = [
  'SubhanAllah',
  'Alhamdulillah',
  'Allahu Akbar',
  'La ilahe illallah',
];

// Tip: her string key için number değer
type CountsType = {
  [key: string]: number;
};

export default function Zikirmatik() {
  const [selectedZikir, setSelectedZikir] = useState(zikirs[0]);

  // Her zikir için ayrı sayaç
  const [counts, setCounts] = useState<CountsType>(
    zikirs.reduce((acc, zikir) => {
      acc[zikir] = 0;
      return acc;
    }, {} as CountsType)
  );

  const handleIncrement = () => {
    setCounts({
      ...counts,
      [selectedZikir]: counts[selectedZikir] + 1,
    });
  };

  const handleReset = () => {
    setCounts({
      ...counts,
      [selectedZikir]: 0,
    });
  };

  return (
    <View style={styles.container}>
      
      {/* Zikir seçimi */}
      <View style={styles.zikirContainer}>
        <FlatList
          horizontal
          data={zikirs}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.zikirButton,
                item === selectedZikir && styles.selectedZikir,
              ]}
              onPress={() => setSelectedZikir(item)}
            >
              <Text style={styles.zikirText}>{item}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Sayaç */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>{counts[selectedZikir]}</Text>
        <Text style={styles.zikirTextCounter}>{selectedZikir}</Text>
      </View>

      {/* Butonlar */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>Sıfırla</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.incrementButton} onPress={handleIncrement}>
          <Text style={styles.incrementText}>+1</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2c3e50',
  },
  zikirContainer: {
    height: 60,
  },
  zikirButton: {
    marginHorizontal: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  selectedZikir: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  zikirText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  counterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontSize: 80,
    color: 'white',
    fontWeight: 'bold',
  },
  zikirTextCounter: {
    fontSize: 24,
    color: 'white',
    marginTop: 10,
  },
  buttonsContainer: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginBottom: 50,
  },
  resetButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
  },
  resetText: {
    color: 'white',
    fontWeight: 'bold',
  },
  incrementButton: {
    backgroundColor: 'white',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incrementText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});
