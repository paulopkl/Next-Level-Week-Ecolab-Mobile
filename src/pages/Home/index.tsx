import React, { useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Image, ImageBackground, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

import { AppLoading } from 'expo';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import { Roboto_400Regular, Roboto_500Medium, useFonts } from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';


import styles from './styles';

const Home = () => {

    const [uf, setUf] = useState('');
    const [city, setCity] = useState('');

    const navigation = useNavigation();

    function handleNavigateToPoints() {
        navigation.navigate('Points', { uf, city });

    };

    const [fontsloaded] = useFonts({ Roboto_400Regular, Roboto_500Medium, Ubuntu_700Bold });

    if (!fontsloaded) {
        return <AppLoading />
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ImageBackground source={require('../../assets/home-background.png')} style={styles.container}
                imageStyle={{ width: 275, height: 368 }} >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de coleta de forma eficiente</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <TextInput style={styles.input} placeholder="Digite a UF" value={uf} 
                        maxLength={2} onChangeText={text => setUf(text)} autoCapitalize="characters" 
                        autoCorrect={false} />
                    <TextInput style={styles.input} placeholder="Digite a Cidade" value={city}
                        onChangeText={text => setCity(text)} autoCorrect={false} />
                    <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" color="#FFF" size={24} />
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}

export default Home;