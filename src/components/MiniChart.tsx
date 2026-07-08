import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';

interface MiniChartProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export function MiniChart({ data, color = colors.primary, height = 80, width = 300 }: MiniChartProps) {
  if (data.length < 2) return <View style={{ height }} />;

  const min = Math.min(...data) * 0.9;
  const max = Math.max(...data) * 1.1;
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((val, i) => {
    const x = i * stepX;
    const y = height - ((val - min) / range) * (height - 10) + 5;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  });

  const linePath = points.join(' ');
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <View style={styles.container}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <Defs>
          <SvgGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </SvgGradient>
        </Defs>
        <Path d={areaPath} fill="url(#chartGrad)" />
        <Path d={linePath} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
});
