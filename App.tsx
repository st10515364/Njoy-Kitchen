import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // this is a React Native component which i used it using AI assistant (DeepSeek, 2025).

const COURSES = ['Starter', 'Main', 'Dessert', 'Side', 'Beverage'];

type MenuItem = {
  id: string;
  name: string;
  description: string;
  course: string;
  price: number;
};

function App() {
  const [screen, setScreen] = useState<string>('home');
  const [dishName, setDishName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [course, setCourse] = useState<string>('Starter');
  const [price, setPrice] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);  // the useState is a standard react but got assistance from AI (DeepSeek, 2025)

  const resetForm = () => {
    setDishName('');
    setDescription('');
    setCourse('Starter');
    setPrice('');
  };

  const handleSave = () => {
    if (!dishName.trim()) {
      Alert.alert('Validation Error', 'Please enter a dish name.');
      return;
    }
    if (!price.trim()) {
      Alert.alert('Validation Error', 'Please enter a price.');
      return;
    }
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price greater than 0.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description.');
      return;
    } // from line 44 to 57, some line of code are AI generated, some are not.

    const newItem: MenuItem = {
      id: Date.now().toString(), // this line of code is AI generated (DeepSeek, 2025)
      name: dishName.trim(),
      description: description.trim(),
      course,
      price: numericPrice,
    };

    setMenuItems([newItem, ...menuItems]);
    resetForm();
    Alert.alert('Success', `"${newItem.name}" has been added to the menu.`);
    setScreen('menu');
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.course}</Text>
        </View>
      </View>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <Text style={styles.cardPrice}>R{item.price.toFixed(2)}</Text>
    </View>
  );

  const renderHome = () => (
    <View style={styles.screen}>
      <View style={styles.statsCard}>
        <Text style={styles.statsLabel}>OVERVIEW</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{menuItems.length}</Text>
            <Text style={styles.statCaption}>Total Dishes</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>
              R
              {menuItems.length
                ? (
                    menuItems.reduce((sum, i) => sum + i.price, 0) /
                    menuItems.length
                  ).toFixed(0)
                : 0}
            </Text>
            <Text style={styles.statCaption}>Avg Price</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={() => setScreen('add')}
      >
        <Text style={styles.buttonText}>+ Add New Dish</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => setScreen('menu')}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          View Full Menu
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAdd = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.label}>DISH NAME *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Burrata & Heirloom Tomato"
          value={dishName}
          onChangeText={setDishName}
        />

        <Text style={styles.label}>COURSE</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={course} onValueChange={setCourse}>
            {COURSES.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>PRICE (R) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 150"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>DESCRIPTION *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="e.g. Buffalo burrata with heirloom tomatoes and basil"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity
          style={[styles.button, styles.successButton]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save Dish</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setScreen('home')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderMenu = () => (
    <View style={styles.screen}>
      {menuItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No dishes added yet</Text>
          <Text style={styles.emptyText}>
            Tap "Add New Dish" to start building your menu.
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => setScreen('add')}
          >
            <Text style={styles.buttonText}>+ Add New Dish</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={renderMenuItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NJOY Kitchen</Text>
        <Text style={styles.headerSubtitle}>Chef's Menu Manager</Text>
      </View>

      <View style={{ flex: 1 }}> // this was generated by AI (DeepSeek, 2025).
        {screen === 'home' && renderHome()}
        {screen === 'add' && renderAdd()}
        {screen === 'menu' && renderMenu()}
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setScreen('home')}
        >
          <Text
            style={[
              styles.navText,
              screen === 'home' && styles.navTextActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setScreen('menu')}
        >
          <Text
            style={[
              styles.navText,
              screen === 'menu' && styles.navTextActive,
            ]}
          >
            Menu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setScreen('add')}
        >
          <Text
            style={[
              styles.navText,
              screen === 'add' && styles.navTextActive,
            ]}
          >
            Add
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: '#4285F4',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: '700' },
  headerSubtitle: { color: '#D9E7FF', fontSize: 13, marginTop: 2 },

  screen: { flex: 1, padding: 20 },

  statsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statsLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: '#8899AA',
    marginBottom: 12,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statBlock: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700', color: '#222' },
  statCaption: { fontSize: 12, color: '#8899AA', marginTop: 4 },

  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: { backgroundColor: '#4285F4' },
  successButton: { backgroundColor: '#28A745' },
  secondaryButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDE3EA',
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  secondaryButtonText: { color: '#4285F4' },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5A6B7B',
    marginBottom: 6,
    marginTop: 14,
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E1E7ED',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  pickerWrapper: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E1E7ED',
    overflow: 'hidden',
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#222', flex: 1 },
  badge: {
    backgroundColor: '#FFF4D6',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 11, color: '#B57A00', fontWeight: '600' },
  cardDescription: { fontSize: 13, color: '#667', marginBottom: 6 },
  cardPrice: { fontSize: 15, fontWeight: '700', color: '#4285F4' },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  emptyText: {
    fontSize: 14,
    color: '#8899AA',
    textAlign: 'center',
    marginVertical: 12,
    paddingHorizontal: 30,
  },

  navBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E1E7ED',
    backgroundColor: '#FFF',
    paddingVertical: 10,
  },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { fontSize: 13, color: '#8899AA', fontWeight: '500' },
  navTextActive: { color: '#4285F4', fontWeight: '700' },
});

export default App;
