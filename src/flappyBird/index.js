import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Canvas, Circle, Group, useImage, Image, Fill, rect } from "@shopify/react-native-skia";

const { width, height } = Dimensions.get('window')

const FlappyBird = () => {
  const imageBird = useImage(require("../../access/sprites/yellowbird-downflap.png"));
  const imageBG = useImage(require("../../access/sprites/background-day.png"));
  const imageBase = useImage(require("../../access/sprites/base.png"));
  const imagePipe = useImage(require("../../access/sprites/pipe-green.png"));
  const imagePipeTop = useImage(require("../../access/sprites/pipe-green-top.png"));


  return (
    <Canvas style={{ flex: 1 }}>
      {/* background */}
      <Image image={imageBG} fit="cover" width={width} height={height} />

      {/* line  */}
      <Image image={imageBase} fit="cover" x={0} y={height - 100} width={width} height={100} />
      {/* pipe top */}
      <Image image={imagePipeTop} fit="cover" x={200} y={0} width={50} height={300} />

      {/* pipe bottom */}
      <Image image={imagePipe} fit="cover" x={200} y={height - 420} width={50} height={320} />


      {/* bird */}
      <Image image={imageBird} fit="contain" x={100} y={200} width={32} height={24} />


    </Canvas>
  );
}

export default FlappyBird

const styles = StyleSheet.create({


})