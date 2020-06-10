import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, Linking } from 'react-native';

import { Feather as Icon, FontAwesome } from '@expo/vector-icons';

import styles from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';

interface Params {
    point_id: number;
}

interface Point {
    point: {
        image: string;
        image_url: string;
        name: string;
        email: string;
        whatssap: string;
        city: string;
        uf: string;
        latitude: number;
        longitude: number;
    };
    items: {
        title: string;
    }[]
}

const Detail = () => {

    const [Data, setData] = useState<Point>({} as Point);

    const navigation = useNavigation();
    const route = useRoute();

    const routeParams = route.params as Params;

    const handleNavigateBack = () => {
        navigation.goBack();
    };

    const handleComposeMail = () => {
        MailComposer.composeAsync({
            subject: `Interesse na coleta de residuos`,
            recipients: [Data.point.email]
        });
    };

    const handleWhatsapp = () => {
        Linking.openURL(`whatsapp://send?phone=${Data.point.whatssap}&text=Tenho Interesse sobre a coleta de resíduos`);
    }

    useEffect(() => {
        api.get(`points/${routeParams.point_id}`).then(res => {
            setData(res.data);
        })
    }, []);

    if(!Data.point) {
        return null;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>

                <Image style={styles.pointImage} source={{ uri: Data.point.image_url.length > 80? Data.point.image : Data.point.image_url }} />

                <Text style={styles.pointName}>{Data.point.name}</Text>
                <Text style={styles.pointItems}>{Data.items.map(item => item.title)}</Text>

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>{Data.point.city}, {Data.point.uf}</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatsapp}>
                    <FontAwesome name="whatsapp" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Whatsapp</Text>
                </RectButton>

                <RectButton style={styles.button} onPress={handleComposeMail}>
                    <Icon name="mail" size={20} color="#fff" />
                    <Text style={styles.buttonText}>E-Mail</Text>
                </RectButton>
            </View>
        </SafeAreaView>
    )
}

export default Detail;