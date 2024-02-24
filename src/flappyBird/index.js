import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Canvas, Circle, Group, useImage, Image, Fill, rect } from "@shopify/react-native-skia";
import { Easing, ReduceMotion, runOnJS, useFrameCallback, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window')
  

const FlappyBird = () => {
  const imageBird = useImage(require("../../access/sprites/yellowbird-downflap.png"));
  const imageBG = useImage(require("../../access/sprites/background-day.png"));
  const imageBase = useImage(require("../../access/sprites/base.png"));
  const imagePipe = useImage(require("../../access/sprites/pipe-green.png"));
  const imagePipeTop = useImage(require("../../access/sprites/pipe-green-top.png"));
  
  let pipeOffset = 0
  const pipeX = useSharedValue(width / 2)
  const pipeYTop = useSharedValue(-320 + pipeOffset)
  const pipeYBottom = useSharedValue(height - 320 + pipeOffset)

  const GRAVITY = 500
  const birdY = useSharedValue(0)
  const birdVelocity = useSharedValue(100)
  useEffect(() => {
    movePipe()
   
  }, [])

  const changePipeHeight = () => {
    pipeOffset = Math.floor(Math.random() * 401) - 200
    pipeYTop.value = -320 + pipeOffset
    pipeYBottom.value = height - 320 + pipeOffset
  }

  const movePipe = () => {
    pipeX.value =  withRepeat(withSequence(
      withTiming(-103, {easing: Easing.linear, duration: 3000,}, () => {
       runOnJS(changePipeHeight)()
      }),
      withTiming(width, {easing: Easing.linear, duration: 0,}),
    ), -1,
    true)
  }

  const birdFall = (dt) => {
    if(!dt) return
    birdY.value = birdY.value + (birdVelocity.value * dt) / 1000
    birdVelocity.value = birdVelocity.value + (GRAVITY * dt) / 1000
  }

  useFrameCallback(({timeSincePreviousFrame: dt}) => {
    runOnJS(birdFall)(dt)
  })

  const birdFly = () => {
    birdVelocity.value =  - 300
  }
  

  return (
    <Canvas style={{ width, height }} onTouch={birdFly}>
      {/* background */}
      <Image image={imageBG} fit="cover" width={width} height={height} />

      {/* pipe top */}
      <Image 
        image={imagePipeTop} 
        x={pipeX} 
        y={pipeYTop} 
        width={103} 
        height={640}
        />

      {/* pipe bottom */}
      <Image  
        image={imagePipe} 
        x={pipeX} 
        y={pipeYBottom} 
        width={103} 
        height={640} 
        />


      {/* bird */}
      <Image image={imageBird} fit="contain" x={width / 4} y={birdY} width={64} height={48} />

    {/* line  */}
    <Image image={imageBase} fit="cover" x={0} y={height - 100} width={width} height={100} />
    </Canvas>
  );
}

export default FlappyBird

const styles = StyleSheet.create({


})