import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS, ACTIVITY_TYPES, DIFFICULTY_LEVELS } from '../utils/constants';
import { usePractices } from '../hooks/usePractices';
import { useSkillTrack } from '../context/SkillTrackContext';
import { ActivityType, DifficultyLevel } from '../types';

interface AddPracticeScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const AddPracticeScreen: React.FC<AddPracticeScreenProps> = ({ navigation }) => {
  const { addPractice } = usePractices();
  const { skills } = useSkillTrack();
  const [skillId, setSkillId] = useState<string | undefined>(skills[0]?.id);
  const [duration, setDuration] = useState('60');
  const [activityType, setActivityType] = useState<ActivityType>(ACTIVITY_TYPES[0]);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DIFFICULTY_LEVELS[0]);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (skills.length && !skillId) {
      setSkillId(skills[0].id);
    }
  }, [skills, skillId]);

  if (!skills.length) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.empty}>Cadastre uma habilidade antes de registrar práticas.</Text>
      </View>
    );
  }

  const handleSave = async () => {
    if (!skillId) {
      Alert.alert('Validação', 'Selecione uma habilidade.');
      return;
    }
    if (!duration) {
      Alert.alert('Validação', 'Informe a duração em minutos.');
      return;
    }

    await addPractice({
      skillId,
      duration: Number(duration),
      activityType,
      difficulty: Number(difficulty),
      note,
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Registrar prática</Text>

      <Text style={styles.label}>Habilidade</Text>
      <View style={styles.pickerWrapper}>
        <Picker 
          selectedValue={skillId} 
          onValueChange={(value) => setSkillId(value as string)}
          style={styles.picker}
          dropdownIconColor={COLORS.textDark}
          itemStyle={{ color: COLORS.textDark }}
        >
          {skills.map((skill) => (
            <Picker.Item key={skill.id} label={skill.name} value={skill.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Duração (min)</Text>
      <TextInput 
        style={styles.input} 
        keyboardType="numeric" 
        value={duration} 
        onChangeText={setDuration}
        placeholderTextColor={COLORS.textLight}
      />

      <Text style={styles.label}>Tipo de atividade</Text>
      <View style={styles.pickerWrapper}>
        <Picker 
          selectedValue={activityType} 
          onValueChange={(value) => setActivityType(value as ActivityType)}
          style={styles.picker}
          dropdownIconColor={COLORS.textDark}
          itemStyle={{ color: COLORS.textDark }}
        >
          {ACTIVITY_TYPES.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Dificuldade</Text>
      <View style={styles.pickerWrapper}>
        <Picker 
          selectedValue={difficulty} 
          onValueChange={(value) => setDifficulty(value as DifficultyLevel)}
          style={styles.picker}
          dropdownIconColor={COLORS.textDark}
          itemStyle={{ color: COLORS.textDark }}
        >
          {DIFFICULTY_LEVELS.map((item) => (
            <Picker.Item key={item} label={`${item}`} value={item} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Anotações</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={note}
        onChangeText={setNote}
        placeholder="O que você aprendeu?"
        placeholderTextColor={COLORS.textLight}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        accessibilityRole="button"
        accessibilityHint="Registra a prática informada"
      >
        <Text style={styles.buttonText}>Salvar prática</Text>
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
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  empty: {
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default AddPracticeScreen;
