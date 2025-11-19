import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import dayjs from 'dayjs';
import { usePractices } from '../hooks/usePractices';
import { useSkillTrack } from '../context/SkillTrackContext';
import PracticeListItem from '../components/PracticeListItem';
import { COLORS } from '../utils/constants';

const ranges = [
  { label: 'Últimos 7 dias', value: 7 },
  { label: 'Últimos 30 dias', value: 30 },
  { label: 'Todos', value: 999 },
];

interface PracticesScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const PracticesScreen: React.FC<PracticesScreenProps> = ({ navigation }) => {
  const { practices } = usePractices();
  const { skills } = useSkillTrack();
  const [skillFilter, setSkillFilter] = useState<'all' | string>('all');
  const [range, setRange] = useState<number>(30);

  const practiceList = useMemo(() => {
    return practices.filter((practice) => {
      const matchesSkill = skillFilter === 'all' || practice.skillId === skillFilter;
      const matchesRange = range === 999 || dayjs(practice.timestamp).isAfter(dayjs().subtract(range, 'day'));
      return matchesSkill && matchesRange;
    });
  }, [practices, skillFilter, range]);

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Habilidade</Text>
          <Picker 
            selectedValue={skillFilter} 
            onValueChange={(value) => setSkillFilter(value as string)}
            style={styles.picker}
            dropdownIconColor={COLORS.textDark}
            itemStyle={{ color: COLORS.textDark }}
          >
            <Picker.Item label="Todas" value="all" />
            {skills.map((skill) => (
              <Picker.Item key={skill.id} label={skill.name} value={skill.id} />
            ))}
          </Picker>
        </View>
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Período</Text>
          <Picker 
            selectedValue={range} 
            onValueChange={(value) => setRange(Number(value))}
            style={styles.picker}
            dropdownIconColor={COLORS.textDark}
            itemStyle={{ color: COLORS.textDark }}
          >
            {ranges.map((item) => (
              <Picker.Item key={item.value} label={item.label} value={item.value} />
            ))}
          </Picker>
        </View>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 120 }}>
        {practiceList.length ? (
          practiceList.map((practice) => <PracticeListItem key={practice.id} practice={practice} />)
        ) : (
          <Text style={styles.empty}>Nenhuma prática registrada.</Text>
        )}
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddPractice')}
          accessibilityRole="button"
        >
          <Text style={styles.actionText}>Registrar Prática</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondary]}
          onPress={() => navigation.navigate('AddAssessment')}
          accessibilityRole="button"
        >
          <Text style={[styles.actionText, styles.secondaryText]}>Autoavaliação</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filters: {
    padding: 16,
    gap: 12,
  },
  filterBlock: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  filterLabel: {
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingTop: 12,
    color: COLORS.textDark,
  },
  picker: {
    color: COLORS.textDark,
    backgroundColor: COLORS.cardElevated,
    height: 50,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 40,
  },
  actions: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.background,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondary: {
    backgroundColor: COLORS.cardElevated,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryText: {
    color: COLORS.primary,
  },
});

export default PracticesScreen;
