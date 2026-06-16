import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNav';
import { ChevronLeft, Camera as CameraIcon, FileUp } from 'lucide-react-native';
import { Camera, useCameraDevice, useCameraPermission, usePhotoOutput, type CameraRef } from 'react-native-vision-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import * as DocumentPicker from '@react-native-documents/picker';
import { isErrorWithCode, errorCodes } from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
const mammoth = require('mammoth/mammoth.browser.js');

export const ScanScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef<CameraRef>(null);
  const photoOutput = usePhotoOutput();
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleCapture = async () => {
    if (camera.current && !isProcessing) {
      try {
        setIsProcessing(true);
        const photoFile = await photoOutput.capturePhotoToFile(
          { flashMode: 'off' },
          {}
        );
        
        const imagePath = photoFile.filePath.startsWith('file://') ? photoFile.filePath : `file://${photoFile.filePath}`;
        const result = await TextRecognition.recognize(imagePath);
        
        if (result && result.text) {
          setIsProcessing(false);
          navigation.replace('Generate', { scannedText: result.text });
        } else {
          setIsProcessing(false);
          navigation.replace('Generate', { scannedText: 'No text found.' });
        }
      } catch (error) {
        console.error('OCR Error:', error);
        setIsProcessing(false);
      }
    }
  };

  const handleUpload = async () => {
    if (isProcessing) return;
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf, DocumentPicker.types.docx],
      });
      const file = result[0];
      if (!file) return;

      setIsProcessing(true);

      if (file.type?.startsWith('image/')) {
        const textResult = await TextRecognition.recognize(file.uri);
        navigation.replace('Generate', { scannedText: textResult?.text || 'No text found in image.' });
      } else if (file.type === 'application/pdf' || file.name?.endsWith('.pdf')) {
        // Mock PDF text extraction due to RN offline limitations
        navigation.replace('Generate', { scannedText: '[PDF Uploaded] Mocked extracted text from PDF... (Full PDF support pending backend API)' });
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name?.endsWith('.docx')) {
        const base64Str = await RNFS.readFile(file.uri, 'base64');
        const buffer = Buffer.from(base64Str, 'base64');
        const { value: text } = await mammoth.extractRawText({ buffer });
        navigation.replace('Generate', { scannedText: text || 'No text found in Word document.' });
      } else {
        navigation.replace('Generate', { scannedText: 'Unsupported file type.' });
      }
    } catch (err) {
      if (!(isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED)) {
        console.error('File Picker Error:', err);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!hasPermission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 16 }}>Requesting Camera Permission...</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>No Camera Device Found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        outputs={[photoOutput]}
      />
      
      {/* Header Overlay */}
      <View style={[styles.headerOverlay, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('generate.scanNotes')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Capture Button Overlay */}
      <View style={[styles.bottomOverlay, { paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={[styles.sideBtn, { backgroundColor: 'rgba(0,0,0,0.5)' }]} 
            onPress={handleUpload}
            disabled={isProcessing}
          >
            <FileUp color="#FFF" size={24} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.captureBtnInner} 
            onPress={handleCapture}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <CameraIcon color={colors.primary} size={32} />
            )}
          </TouchableOpacity>
          
          {/* Spacer to balance the layout */}
          <View style={styles.sideBtn} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
  },
  sideBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtnInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
});
