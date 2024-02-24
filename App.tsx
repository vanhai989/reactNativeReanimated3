import { Button, View } from 'react-native';
// import WithDecayComponent from './src/animated/functions/withDecay';
// import WithSequence from './src/animated/functions/withSequence';
// import WithSpringComponent from './src/animated/functions/withSpring';
// import WithTimingComponent from './src/animated/functions/withTiming';
import FlappyBird from './src/flappyBird';
// const paths = {
//   firstAnimation: 'FIRST_ANIMATION',
//   withDecay: 'WITH_DECAY'
// }
// const listFeatures = [
//   {
//     name: 'First animation',
//     path: paths.firstAnimation
//   },
//   {
//     name: 'With decay',
//     path: paths.withDecay
//   },
// ]

export default function App() {

  return <FlappyBird />

  // return (
  //   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //     {/* <WithDecayComponent /> */}
  //     {/* <WithSequence /> */}
  //     {/* <WithSpringComponent /> */}
  //     <WithTimingComponent />
  //   </View>
  // );
}