import { Dimensions, Platform, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { Canvas, Circle, Group, useImage, Image, Fill, rect, Text, matchFont, RoundedRect } from "@shopify/react-native-skia";
import { Easing, Extrapolation, ReduceMotion, cancelAnimation, clamp, interpolate, runOnJS, useAnimatedReaction, useDerivedValue, useFrameCallback, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { withPause } from 'react-native-redash';

const { width, height } = Dimensions.get('window')
const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
const fontStyle = {
  fontFamily,
  fontSize: 14,
  fontStyle: "italic",
  fontWeight: "bold",
};

const FlappyBird = () => {
  const imageBird = useImage(require("../../access/sprites/yellowbird-downflap.png"));
  const imageBG = useImage(require("../../access/sprites/background-day.png"));
  const imageBase = useImage(require("../../access/sprites/base.png"));
  const imagePipe = useImage(require("../../access/sprites/pipe-green.png"));
  const imagePipeTop = useImage(require("../../access/sprites/pipe-green-top.png"));

  const font = matchFont(fontStyle);

  let pipeOffset = 0
  const pipeX = useSharedValue(width)
  const pipeYTop = useSharedValue(pipeOffset - 320)
  const pipeYBottom = useSharedValue(height - 320 + pipeOffset)

  const GRAVITY = 500
  const birdX = width / 4
  const birdY = useSharedValue(200)
  const birdVelocity = useSharedValue(100)
  const pipeWidth = 103
  const pipeHeight = 640
  const birdCenterX = useDerivedValue(() => birdX + 32)
  const birdCenterY = useDerivedValue(() => birdY.value + 24)
  const speedAnimation = useSharedValue(1)
  // let gameOver = useSharedValue(false)
  let score = useSharedValue('0')
  const paused = useSharedValue(false);
  useEffect(() => {
    movePipe()
  }, [])

  // const handlerCancelAnimation = () => {
  //   cancelAnimation(pipeX)
  // }

  const changePipeHeight = () => {
    pipeOffset = Math.floor(Math.random() * 401) - 200
    pipeYTop.value = pipeOffset -320 
    pipeYBottom.value = height - 320 + pipeOffset
    movePipe()
  }

  const movePipe = () => {
    pipeX.value = withPause( 
      withSequence(
        withTiming(width, { easing: Easing.linear, duration: 0 }),
        withTiming(-150, { easing: Easing.linear, duration: 3000 / speedAnimation.value }, () => {
          runOnJS(changePipeHeight)()
        }),
        withTiming(width, { easing: Easing.linear, duration: 0, })
      ), paused)
  }

  const birdFall = (dt) => {
    if (!dt || paused.value) return
    birdY.value = birdY.value + (birdVelocity.value * dt) / 1000
    birdVelocity.value = birdVelocity.value + (GRAVITY * dt) / 1000
  }

  const checkGameOver = (currentBirdY, previousBirdY) => {
    //top base and bottom base
    if (currentBirdY >= height - 150 || currentBirdY <= 0) {  
      paused.value = true
      // handlerCancelAnimation()
      return
    }
    //bottom pipe
    if(birdCenterX.value >= pipeX.value &&
      birdCenterX.value <= pipeX.value + pipeWidth &&
      birdCenterY.value >= pipeYBottom.value &&
      birdCenterY.value <= pipeYBottom.value + pipeHeight) {
      paused.value = true
      // handlerCancelAnimation()
      return
    }
    // top pipe 
    if(birdCenterX.value >= pipeX.value &&
      birdCenterX.value <= pipeX.value + pipeWidth &&
      birdCenterY.value >= pipeYTop.value &&
      birdCenterY.value <= pipeYTop.value + pipeHeight) {
      paused.value = true
      // handlerCancelAnimation()
      return
    }
  }

  useAnimatedReaction(
    () => pipeX.value,
    (currentValue, previousValue) => {
      const middle = width / 3 - 90
      if(currentValue !== previousValue && previousValue && currentValue < middle && previousValue > middle) {
        score.value =  (Number(score.value) + 1).toString()
        if(Number(score.value)) {
          speedAnimation.value = interpolate(Number(score.value), [0, 20], [1, 2])
        }
      }
    }
  )

  useAnimatedReaction(
    () => birdY.value,
    (currentBirdY, previousBirdYValue) => {
      runOnJS(checkGameOver)(currentBirdY, previousBirdYValue)
    }
    )

  useFrameCallback(({ timeSincePreviousFrame: dt }) => {
    runOnJS(birdFall)(dt)
  })

  const reStartGame = () => {
    birdY.value = 301
    score.value = '0'
    pipeX.value = withTiming(width, { easing: Easing.linear, duration: 0, })
    paused.value = false
    movePipe()
  }

  const birdFly = () => {
    if (paused.value) {
      reStartGame()
    }

    birdVelocity.value = - 300
  }

  const birdOrigin = useDerivedValue(() => {
    return {
      x: width / 4, y: birdY.value + 24
    }
  })

  const birdTransform = useDerivedValue(() => {
    return [{ rotate: interpolate(birdVelocity.value, [-500, 500], [-0.8, 0.5], Extrapolation.CLAMP) }]
  })


  return (
    // <GestureHandlerRootView style={{ flex: 1 }}>
    //   <GestureDetector gesture={tap}>
        <Canvas style={{ width, height }} onTouch={birdFly}>
          {/* background */}
          <Image image={imageBG} fit="cover" width={width} height={height} />

          {/* pipe top */}
          <Image
            image={imagePipeTop}
            x={pipeX}
            y={pipeYTop}
            width={pipeWidth}
            height={pipeHeight}
          />

          {/* pipe bottom */}
          <Image
            image={imagePipe}
            x={pipeX}
            y={pipeYBottom}
            width={pipeWidth}
            height={pipeHeight}
          />


          {/* bird */}
            {/* <Image image={imageBird} fit="contain" x={birdX} y={birdY} width={64} height={48} /> */}
            <Group transform={birdTransform} origin={birdOrigin}>
              <Image image={imageBird} fit="contain" x={birdX} y={birdY} width={64} height={48} />
            </Group>

          {/* line  */}
          <Image image={imageBase} fit="cover" x={0} y={height - 100} width={width} height={100} />
          <Text
            text={score}
            x={width / 2}
            y={100}
            font={font}
          />
        </Canvas>
    //   </GestureDetector>
    // </GestureHandlerRootView>
  );
}

export default FlappyBird

const styles = StyleSheet.create({


})