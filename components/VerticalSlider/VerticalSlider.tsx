import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureChangeEventPayload,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { TSliderProps, TSliderRef } from './types';

const calculateValue = (
  startPosition: number,
  currPosition: number,
  startValue: number,
  min: number,
  max: number,
  step: number,
  height: number
): number => {
  'worklet';
  const delta = startPosition - currPosition
  const deltaProp = delta / height

  const range = (max - min)
  const deltaRange = deltaProp * range

  let value = startValue + deltaRange
  value = Math.round(value / step) * step;
  value = Math.min(max, Math.max(min, value));
  //console.log("CALVCAL", { value, startValue, startPosition, currPosition, min, max, step, height })
  return value;
};

const VerticalSlider = React.forwardRef<TSliderRef, TSliderProps>(
  (
    {
      min = 0,
      max = 100,
      step = 1,
      width = 350,
      height = 30,
      borderRadius = 5,
      maximumTrackTintColor = '#3F2DA5',
      minimumTrackTintColor = '#77ADE6',
      disabled = false,
      onChange = () => { },
      value: currentValue = 0,
      containerStyle = {},
      sliderStyle = {},
      onDoubleTap = () => { },
    },
    ref
  ) => {
    let point = useSharedValue<number>(currentValue);
    let disabledProp = useSharedValue<boolean>(disabled);
    const [startEventY, setStartEventY] = useState(null)
    const [startValue, setStartValue] = useState(null)

    // Memoized BaseView styles
    const calculateBaseView = () => ({
      height,
      width,
      borderRadius,
      backgroundColor: maximumTrackTintColor,
    });
    const baseViewStyle = React.useMemo(calculateBaseView, [
      borderRadius,
      height,
      maximumTrackTintColor,
      width,
    ]);

    //
    // GESTURE HANDLERS
    //
    const onGestureStart = (
      event: GestureStateChangeEvent<PanGestureHandlerEventPayload>
    ) => {
      if (disabledProp.value) return;
      setStartEventY(event.y)
      setStartValue(currentValue)
    }
    const onGestureChange = (
      event: GestureUpdateEvent<
        PanGestureHandlerEventPayload & PanGestureChangeEventPayload
      >
    ) => {
      if (disabledProp.value) return;
      let value = calculateValue(startEventY, event.y, startValue, min, max, step, height);
      point.value = value
      return runOnJS(onChange)(value)
    }
    const panGesture = Gesture.Pan()
      .onBegin(onGestureStart)
      .onChange(onGestureChange)
      .runOnJS(true);

    const doubleTapGesture = Gesture.Tap()
      .numberOfTaps(2)
      .onEnd(onDoubleTap)
      .runOnJS(true)

    // Ref methods
    const setValueQuietly = (value: number) => {
      point.value = value;
    }
    React.useImperativeHandle(ref, () => ({
      setValueQuietly,
      setValue: (value: number) => {
        setValueQuietly(value);
        onChange(value);
      },
      setState: (state: boolean) => {
        disabledProp.value = state;
      },
    }));
    // slider styles
    const slider = useAnimatedStyle(() => {
      let heightPercentage = ((point.value - min) / (max - min)) * 100;
      const style: ViewStyle = {
        backgroundColor: minimumTrackTintColor,
        height: `${heightPercentage}%`,
      };
      return style;
    }, [point.value, minimumTrackTintColor]);
    return (
      <GestureDetector gesture={doubleTapGesture}>
        <GestureDetector gesture={panGesture}>
          <View style={[baseViewStyle, containerStyle]}>
            <View style={[baseViewStyle, styles.box, sliderStyle]}>
              <Animated.View style={[styles.box, slider]} />
            </View>
          </View>
        </GestureDetector>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  box: {
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default VerticalSlider;
