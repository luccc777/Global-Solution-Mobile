# Alunos

Lucas Camargo de Souza - 551898

Sofia Barbosa Souza - 552298

Roberto Tetsuo Tagashira - 551838

# SkillTrack – Rastreador Inteligente de Habilidades

Aplicativo mobile desenvolvido em **React Native (Expo)** para a disciplina *Advanced Programming & Mobile Dev*. O SkillTrack ajuda profissionais a planejarem e acompanharem sua evolução por meio de registros diários, análises inteligentes e recomendações acionáveis alinhadas ao tema **DataWork – Inteligência Analítica no Mundo Corporativo**.

## Tecnologias principais

- React Native (Expo) + TypeScript
- React Navigation (Bottom Tabs + Stack)
- AsyncStorage (`@react-native-async-storage/async-storage`) para persistência local
- `react-native-chart-kit` + `react-native-svg` para os gráficos
- Expo Vector Icons e Linear Gradient para experiência visual
- Hooks e serviços customizados (`useSkills`, `usePractices`, `analyticsService`, `storageService`)

## Estrutura

```
src/
  components/      -> Cards reutilizáveis, gráfico radar, etc.
  context/         -> SkillTrackProvider centraliza dados e persistência
  hooks/           -> Abstrações para Skills, Practices e Assessments
  navigation/      -> Navegação em abas + stacks
  screens/         -> Dashboard, Skills, Práticas, Analytics, Perfil, formulários
  services/        -> AsyncStorage e cálculos analíticos
  utils/           -> Constantes e utilitários de data
```

Chaves no AsyncStorage:

```
'@skilltrack:skills'
'@skilltrack:practices'
'@skilltrack:assessments'
'@skilltrack:userProfile'
```

## Funcionalidades implementadas

- **Dashboard analítica:** nível profissional atual, horas semanais, gráfico radar das 6 principais skills, habilidades em risco, alertas preditivos e recomendações inteligentes.
- **Gestão de habilidades:** CRUD completo, filtros por categoria, ordenação (nível, última prática ou nome) e sliders 1–10 para nível/meta.
- **Registro de práticas:** formulário completo (skill, duração, tipo, dificuldade, notas), filtros por habilidade/período, atualização automática do `lastPractice` e cálculo das métricas exigidas.
- **Autoavaliações mensais:** formulário dedicado que atualiza o nível atual da skill e alimenta a evolução histórica.
- **Analytics & Relatórios:** linha de evolução de níveis, barras de horas por skill, pizza de distribuição por categoria, comparativo horizontal nível vs meta, insights numéricos (total/ média, skill mais praticada, maior evolução, taxa de metas) e card preditivo.
- **Perfil do usuário:** edição de dados, estatísticas gerais, badges gamificados (Primeiro Passo, Consistente, Polímata, Dedicado, Expert), exportação/limpeza de dados.
- **Recomendações inteligentes:** regras para skills sem prática >14 dias, desequilíbrio técnico, metas atingidas, necessidade de autoavaliação e lembretes quando ficar 3+ dias sem praticar.
- **Persistência local confiável:** todos os registros permanecem ao fechar/reabrir o app, atendendo ao roteiro de demonstração.

## Como rodar

1. Instale as dependências
   ```bash
   npm install
   ```
2. Inicie o Expo
   ```bash
   npm run start
   ```
3. Use o app no Expo Go (Android/iOS) ou emuladores (`npm run android` / `npm run ios`) e valide também em `npm run web` se desejar.

## Dicas para apresentação

- Cadastre múltiplas habilidades (técnicas e comportamentais) e explore os filtros/ordenações.
- Registre práticas variadas para alimentar o dashboard e os gráficos analíticos.
- Execute uma autoavaliação e mostre o gráfico de evolução atualizando imediatamente.
- Abra a aba Analytics para evidenciar gráficos e o card preditivo.
- No perfil, destaque badges conquistadas e demonstre a exportação de dados.
- Finalize fechando e reabrindo o app para reforçar a persistência via AsyncStorage.

## Próximos passos sugeridos

- Integrar notificações do Expo para lembretes reais de prática/assessment.
- Adicionar autenticação e sincronização em nuvem para múltiplos dispositivos.
- Inserir compartilhamento de relatórios (PDF/CSV) e integração com calendários.
