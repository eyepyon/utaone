'use client';

import axios from 'axios';
import styles from './page.module.css';
import { AudioRecorder } from './components/audio-recorder';
import { ThreeScene } from './components/three-scene';
import { useState, createRef, useEffect } from 'react';
import { Grid, Button } from '@mui/material';

interface AnimationInfo {
  name: string;
  displayName: string;
  path: string;
}

export default function Home() {
  const threeSceneRef = createRef<ThreeScene>();
  const threeScene = <ThreeScene ref={threeSceneRef} />;
  const [animationInfos, setAnimationInfos] = useState<AnimationInfo[]>([]);
  useEffect(() => {
    (async () => {
      const animationListResponse = await axios.get('/threedmodels/vrmas/animation-list.json');
      setAnimationInfos(animationListResponse.data.animations);
    })();
  }, []);

  const onChangeAnimation = async (animationInfo: AnimationInfo) => {
    const vrmaDataAnimationResponse = await axios.get(animationInfo.path, { responseType: 'arraybuffer' });
    threeSceneRef?.current?.updateVrmAnimationArryaBuffer(vrmaDataAnimationResponse.data);
  };
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {threeScene}
        <h3>押したボタンのモーションに切り替わります</h3>
        <Grid container spacing={2}>
          {animationInfos.map((animationInfo, index) => (
            <Grid key={index} size={2}>
              <Button variant="contained" style={{ textAlign: 'center' }} onClick={(e) => onChangeAnimation(animationInfo)}>
                {animationInfo.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
