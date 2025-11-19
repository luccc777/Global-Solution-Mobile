import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../utils/constants';
import { useSkillTrack } from '../context/SkillTrackContext';
import { useAssessments } from '../hooks/useAssessments';

interface AddAssessmentScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const AddAssessmentScreen: React.FC<AddAssessmentScreenProps> = ({ navigation }) => {
  const { skills } = useSkillTrack();
  const { addAssessment } = useAssessments();
  const [skillId, setSkillId] = useState<string | undefined>(skills[0]?.id);
  const [newLevel, setNewLevel] = useState<number>(skills[0]?.currentLevel || 1);
  const [achievements, setAchievements] = useState('');
  const [challenges, setChallenges] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (skills.length && !skillId) {
      setSkillId(skills[0].id);
      setNewLevel(skills[0].currentLevel || 1);
    }
  }, [skills, skillId]);

  if (!skills.length) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.empty}>Cadastre habilidades antes de realizar autoavaliações.</Text>
      </View>
    );
  }

  const handleSave = async () => {
    if (!skillId) {
      Alert.alert('Validação', 'Selecione uma habilidade.');
      return;
    }
    await addAssessment({
      skillId,
      newLevel: Math.round(newLevel),
      achievements,
      challenges,
      nextSteps,
      date,
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Autoavaliação</Text>

      <Text style={styles.label}>Habilidade</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={skillId}
          onValueChange={(value) => {
            const selected = value as string;
            setSkillId(selected);
            const skill = skills.find((item) => item.id === selected);
            if (skill) setNewLevel(skill.currentLevel);
          }}
          style={styles.picker}
          dropdownIconColor={COLORS.textDark}
          itemStyle={{ color: COLORS.textDark }}
        >
          {skills.map((skill) => (
            <Picker.Item key={skill.id} label={skill.name} value={skill.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Novo nível: {Math.round(newLevel)}</Text>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={newLevel}
        onValueChange={setNewLevel}
        minimumTrackTintColor={COLORS.primary}
      />

      <Text style={styles.label}>Conquistas</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        multiline
        value={achievements}
        onChangeText={setAchievements}
        placeholderTextColor={COLORS.textLight}
      />

      <Text style={styles.label}>Dificuldades</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        multiline
        value={challenges}
        onChangeText={setChallenges}
        placeholderTextColor={COLORS.textLight}
      />

      <Text style={styles.label}>Próximos passos</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        multiline
        value={nextSteps}
        onChangeText={setNextSteps}
        placeholderTextColor={COLORS.textLight}
      />

      <Text style={styles.label}>Data (AAAA-MM-DD)</Text>
      <TextInput 
        style={styles.input} 
        value={date} 
        onChangeText={setDate}
        placeholderTextColor={COLORS.textLight}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        accessibilityRole="button"
        accessibilityHint="Salva a autoavaliação"
      >
        <Text style={styles.buttonText}>Salvar avaliação</Text>
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.cardElevated,
    marginTop: 4,
    overflow: 'hidden',
  },
  picker: {
    color: COLORS.textDark,
    backgroundColor: COLORS.cardElevated,
    height: 50,
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
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
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
    fontWeight: '700',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});

export default AddAssessmentScreen;
