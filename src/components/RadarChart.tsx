import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Text as SvgText } from 'react-native-svg';
import { COLORS } from '../utils/constants';

interface RadarPoint {
  label: string;
  value: number;
}

interface RadarChartProps {
  data?: RadarPoint[];
}

const RadarChart: React.FC<RadarChartProps> = ({ data = [] }) => {
  if (!data.length) {
    return <View style={styles.placeholder} />;
  }

  const size = 220;
  const center = size / 2;
  const radius = center - 24;
  const angleSlice = (Math.PI * 2) / data.length;
  const levels = 5;

  const getCoordinates = (value: number, index: number) => {
    const angle = angleSlice * index - Math.PI / 2;
    const scaled = (value / 10) * radius;
    return {
      x: center + scaled * Math.cos(angle),
      y: center + scaled * Math.sin(angle),
    };
  };

  const levelShapes = Array.from({ length: levels }).map((_, levelIndex) => {
    const level = ((levelIndex + 1) / levels) * 10;
    const points = data
      .map((_, index) => {
        const { x, y } = getCoordinates(level, index);
        return `${x},${y}`;
      })
      .join(' ');
    return <Polygon key={`level-${levelIndex}`} points={points} fill="none" stroke={COLORS.border} strokeWidth={1} strokeOpacity={0.5} />;
  });

  const skillPoints = data
    .map((item, index) => {
      const { x, y } = getCoordinates(item.value, index);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {levelShapes}
        {data.map((item, index) => {
          const { x, y } = getCoordinates(10, index);
          return <Line key={`axis-${item.label}`} x1={center} y1={center} x2={x} y2={y} stroke={COLORS.border} strokeWidth={1} strokeOpacity={0.4} />;
        })}
        <Polygon points={skillPoints} fill="rgba(59,130,246,0.3)" stroke={COLORS.primary} strokeWidth={2} />
        {data.map((item, index) => {
          const { x, y } = getCoordinates(10.6, index);
          return (
            <SvgText key={`label-${item.label}`} x={x} y={y} fontSize="10" fill={COLORS.textDark} textAnchor="middle">
              {item.label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    height: 200,
  },
});

export default RadarChart;
