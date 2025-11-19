import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { COLORS, SKILL_CATEGORIES } from '../utils/constants';
import { useSkills } from '../hooks/useSkills';
import { Skill, SkillCategory } from '../types';

interface AddSkillScreenProps {
  navigation: {
    goBack: () => void;
  };
  route?: {
    params?: {
      skill?: Skill;
    };
  };
}

const AddSkillScreen: React.FC<AddSkillScreenProps> = ({ navigation, route }) => {
  const { addSkill, updateSkill } = useSkills();
  const editingSkill = route?.params?.skill;
  const [name, setName] = useState(editingSkill?.name || '');
  const [category, setCategory] = useState<SkillCategory>(editingSkill?.category || SKILL_CATEGORIES[0]);
  const [currentLevel, setCurrentLevel] = useState(editingSkill?.currentLevel || 1);
  const [targetLevel, setTargetLevel] = useState(editingSkill?.targetLevel || 7);
  const [startDate, setStartDate] = useState(editingSkill?.startDate || new Date().toISOString().slice(0, 10));

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validação', 'Informe um nome para a habilidade.');
      return;
    }

    const payload = {
      name: name.trim(),
      category,
      currentLevel: Math.round(currentLevel),
      targetLevel: Math.round(targetLevel),
      startDate,
    };

    if (editingSkill) {
      await updateSkill(editingSkill.id, payload);
    } else {
      await addSkill(payload);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{editingSkill ? 'Editar Habilidade' : 'Nova Habilidade'}</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
        placeholder="Ex: React Native"
        placeholderTextColor={COLORS.textLight}
      />

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.pickerWrapper}>
        <Picker 
          selectedValue={category} 
          onValueChange={(value) => setCategory(value as SkillCategory)}
          style={styles.picker}
          dropdownIconColor={COLORS.textDark}
          itemStyle={{ color: COLORS.textDark }}
        >
          {SKILL_CATEGORIES.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Nível atual: {Math.round(currentLevel)}</Text>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={currentLevel}
        onValueChange={setCurrentLevel}
        minimumTrackTintColor={COLORS.primary}
      />

      <Text style={styles.label}>Meta: {Math.round(targetLevel)}</Text>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={targetLevel}
        onValueChange={setTargetLevel}
        minimumTrackTintColor={COLORS.secondary}
      />

      <Text style={styles.label}>Data de início (AAAA-MM-DD)</Text>
      <TextInput 
        style={styles.input} 
        value={startDate} 
        onChangeText={setStartDate}
        placeholderTextColor={COLORS.textLight}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        accessibilityRole="button"
        accessibilityHint="Salva a habilidade informada"
      >
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: COLORS.textDark,
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    color: COLORS.textDark,
  },
  input: {
    backgroundColor: COLORS.cardElevated,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 4,
    color: COLORS.textDark,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    marginTop: 4,
    overflow: 'hidden',
  },
  picker: {
    color: COLORS.textDark,
    backgroundColor: COLORS.cardElevated,
    height: 50,
  },
  button: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AddSkillScreen;
