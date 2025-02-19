import React, {useState, useEffect, useRef} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import {Image} from 'react-native';
import {API_URL} from '../config';

const SoundPlayer = ({audio}: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const intervalRef: any = useRef(null);

  const audioUrl = `${API_URL}/${audio}`; // Replace with your audio URL

  useEffect(() => {
    // Initialize the sound
    const loadedSound = new Sound(audioUrl, null as any, (error: any) => {
      if (error) {
        console.error('Failed to load sound', error);
        return;
      }
      setDuration(loadedSound.getDuration()); // Set the audio duration in seconds
      setSound(loadedSound);
    });

    return () => {
      if (sound) {
        sound.release();
      }
      clearInterval(intervalRef.current); // Cleanup interval on unmount
    };
  }, []);

  const handlePlayPause = () => {
    if (!sound) return;

    if (isPlaying) {
      sound.pause();
      setIsPlaying(false);
      clearInterval(intervalRef.current);
    } else {
      sound.play((success: any) => {
        if (success) {
          console.log('Playback finished');
          setIsPlaying(false);
          setProgress(0);
          clearInterval(intervalRef.current);
        } else {
          console.error('Playback failed');
        }
      });
      setIsPlaying(true);

      // Start updating progress
      intervalRef.current = setInterval(() => {
        sound.getCurrentTime((seconds: any) => {
          setProgress(seconds / duration); // Update progress as a fraction
        });
      }, 100); // Update every 100ms
    }
  };

  const handleSeek = (value: any) => {
    if (!sound) return;

    const seekTime = value * duration; // Calculate the seek time in seconds
    sound.setCurrentTime(seekTime);
    setProgress(value);
  };

  const formatTime = (seconds: any) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
        <Text style={styles.playButtonText}>
          {isPlaying ? 'Pause' : 'Play'}
        </Text>
      </TouchableOpacity> */}
      <View
        style={{
          width: '35%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity onPress={handlePlayPause}>
          {!isPlaying ? (
            <Image
              source={require('../assets/play.png')}
              style={{width: 20, height: 20}}
            />
          ) : (
            <Image
              source={require('../assets/pause.png')}
              style={{width: 20, height: 20}}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.time}>
          {formatTime(progress * duration)} / {formatTime(duration)}
        </Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={progress}
        onValueChange={handleSeek} // Seek when the slider is moved
        minimumTrackTintColor="#1DB954"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#2f4f4f"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  playButton: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2f4f4f',
    borderRadius: 25,
    marginBottom: 20,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  slider: {
    width: '60%',
    height: 40,
    paddingRight: 30,
  },
  time: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
});

export default SoundPlayer;
