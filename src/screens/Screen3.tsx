import React, {useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../utils/types';
import CommonStyles from '../styles/CommonStyles';
import {useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {WebView} from 'react-native-webview';
import ViewShot from 'react-native-view-shot';

type Props = NativeStackScreenProps<RootStackParamList, 'Screen3'>;

function Screen3({navigation, route}: Props) {
  const {result, healing_square} = route.params;

  const ref = useRef();
  console.log(JSON.stringify(result?.data?.result?.healing_square));
  const source = {
    html: JSON.stringify(result?.data?.result?.healing_square),
  };

  function RenderHTMLView() {
    return (
      <WebView
        source={{html: result?.data?.result?.healing_square}}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={false}
        scalesPageToFit={Platform.OS === 'ios' ? false : true}
        style={{
          height: 400,
          width: 400,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        }}
      />
    );
  }
  const content = {
    nameLabel: 'Name:',
    totalValueLabel: 'Total value:',
    talismanLabel: 'Associated talisman:',
    talismanValue: 'Centipede Stone',
    nextButton: 'Next',
  };

  return (
    <ScrollView
      contentContainerStyle={CommonStyles.scrollContainer}
      style={CommonStyles.scrollView}>
      <View style={[CommonStyles.container, styles.container]}>
        <Text style={styles.label}>{content.nameLabel}</Text>
        <Text style={styles.value}>{result.data.result.name}</Text>
        <Text style={styles.label}>{content.totalValueLabel}</Text>
        <Text style={styles.value}>{result.data.result.numerical_value}</Text>

        <View style={styles.gridContainer}>
          {result.data.result.magic_square.map(
            (row: number[], rowIndex: number) => (
              <View key={rowIndex} style={styles.gridRow}>
                {row.map((value, colIndex) => (
                  <View key={colIndex} style={styles.gridItem}>
                    <Text style={styles.gridText}>{value}</Text>
                  </View>
                ))}
              </View>
            ),
          )}
        </View>

        {!!healing_square && (
          <ViewShot
            style={{flex: 1}}
            ref={ref}
            options={{fileName: 'healingSquare', format: 'jpg', quality: 0.9}}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {RenderHTMLView()}
            </View>
          </ViewShot>
        )}

        {!!healing_square && (
          <TouchableOpacity
            style={CommonStyles.button}
            onPress={async () => {
              console.log('downloading healing square ...', ref?.current);
              const imageURI = await ref?.current?.capture();
              Share?.share({title: 'HealingSquare', url: imageURI});
            }}>
            <Text style={CommonStyles.buttonText}>
              {'Download Healing Square'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={CommonStyles.button}
          onPress={() => navigation.navigate('Screen4', {result: result})}>
          <Text style={CommonStyles.buttonText}>{content.nextButton}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  value: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  gridContainer: {
    marginTop: 50,
    marginBottom: 50,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  gridItem: {
    width: 43,
    height: 43,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  gridText: {
    color: '#fff',
  },
});

export default Screen3;
