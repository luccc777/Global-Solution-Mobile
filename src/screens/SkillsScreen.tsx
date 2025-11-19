import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS, SKILL_CATEGORIES } from '../utils/constants';
import SkillCard from '../components/SkillCard';
import { useSkills } from '../hooks/useSkills';
import { Skill, SkillCategory } from '../types';

type SortOption = 'level' | 'practice' | 'name';

interface SkillsScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
}

const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'Nível', value: 'level' },
  { label: 'Última prática', value: 'practice' },
  { label: 'Nome', value: 'name' },
];

const SkillsScreen: React.FC<SkillsScreenProps> = ({ navigation }) => {
  const { skills, deleteSkill } = useSkills();
  const [category, setCategory] = useState<'all' | SkillCategory>('all');
  const [sort, setSort] = useState<SortOption>('level');

  const skillList = useMemo(() => {
    let result: Skill[] = skills;
    if (category !== 'all') {
      result = result.filter((skill) => skill.category === category);
    }
    return [...result].sort((a, b) => {
      if (sort === 'practice') {
        return (b.lastPractice || 0) - (a.lastPractice || 0);
      }
      if (sort === 'name') {
        return a.name.localeCompare(b.name);
      }
      return Number(b.currentLevel || 0) - Number(a.currentLevel || 0);
    });
  }, [skills, category, sort]);

  return (
    <View style={styles.container}>
      <View style={styles.filters} accessibilityRole="summary" accessibilityLabel="Filtros de habilidades">
        <View style={styles.filter}>
          <Text style={styles.filterLabel}>Categoria</Text>
          <Picker 
            selectedValue={category} 
            onValueChange={(value) => setCategory(value as 'all' | SkillCategory)}
            style={styles.picker}
            dropdownIconColor={COLORS.textDark}
            itemStyle={{ color: COLORS.textDark }}
          >
            <Picker.Item label="Todas" value="all" />
            {SKILL_CATEGORIES.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
        </View>
        <View style={styles.filter}>
          <Text style={styles.filterLabel}>Ordenar por</Text>
          <Picker 
            selectedValue={sort} 
            onValueChange={(value) => setSort(value as SortOption)}
            style={styles.picker}
            dropdownIconColor={COLORS.textDark}
            itemStyle={{ color: COLORS.textDark }}
          >
            {sortOptions.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 120 }} accessibilityRole="scrollbar">
        {skillList.length ? (
          skillList.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={() => navigation.navigate('AddSkill', { skill })}
              onDelete={() => deleteSkill(skill.id)}
            />
          ))
        ) : (
          <Text style={styles.empty}>Nenhuma habilidade cadastrada ainda.</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddSkill')}
        accessibilityRole="button"
        accessibilityLabel="Adicionar nova habilidade"
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
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
  filter: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.background,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
  },
  filterLabel: {
    fontWeight: '600',
    marginBottom: 4,
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
    marginTop: 40,
    textAlign: 'center',
    color: COLORS.textLight,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.background,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 32,
  },
});

export default SkillsScreen;
