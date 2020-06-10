import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import api from '../../services/api';

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface Point {
    id: number;
    name: string;
    image: string;
    image_url: string;
    latitude: number;
    longitude: number;
}

interface Params {
    uf: string;
    city: string;
}

import styles from './styles';

const Points = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [points, SetPoints] = useState<Point[]>([]);
    const [selectedItems, SetSelectedItems] = useState<number[]>([]);

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const navigation = useNavigation();
    const route = useRoute();

    const routeParams = route.params as Params;

    const handleNavigateBack = () => {
        navigation.goBack();
    };

    const handleNavigateToDetail = (id: number) => {
        navigation.navigate('Detail', { point_id: id });
    };

    const handleSelectItem = (id: number) => {
        const alreadySelected = selectedItems.findIndex(item => item === id);
        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            SetSelectedItems(filteredItems);
        } else {
            SetSelectedItems([...selectedItems, id]);
        }
    }

    useEffect(() => {
        const loadPosition = async () => {
            const { status } = await Location.requestPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Ooops...', 'Precisamos de sua permissão para obter a localização');
                return;
            }

            const location = await Location.getCurrentPositionAsync();
            const { latitude, longitude } = await location.coords;

            setInitialPosition([latitude, longitude]);
        }

        loadPosition();

        api.get('items').then(res => {
            setItems(res.data);
        }).catch(err => alert(err));

    }, []);

    useEffect(() => {
        api.get('points', {
            params: {
                city: routeParams.city,
                uf: routeParams.uf,
                items: selectedItems
            }
        }).then(res => {
            SetPoints(res.data);
        });
    }, [selectedItems])

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Feather name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>

                <Text style={styles.title}>Bem vindo.</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

                <View style={styles.mapContainer}>
                    {initialPosition[0] !== 0 && (
                        <MapView initialRegion={{
                            latitude: initialPosition[0] || -22.8255629,
                            longitude: initialPosition[1] || -47.2723987,
                            latitudeDelta: 0.014,
                            longitudeDelta: 0.014
                        }} style={styles.map} loadingEnabled={initialPosition[0] === 0}>
                            {points.map(point => (
                                <Marker key={String(point.id)}
                                    onPress={() => handleNavigateToDetail(point.id)}
                                    style={styles.mapMarker} coordinate={{
                                        latitude: point.latitude,
                                        longitude: point.longitude
                                    }}>
                                    <View style={styles.mapMarkerContainer}>
                                        <Image style={styles.mapMarkerImage}
                                            source={{ uri: point.image_url.length > 80? point.image : point.image_url }} />
                                        <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    )}
                </View>
            </View>

            <View style={styles.itemsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}>
                    {items.map(item => (
                        <TouchableOpacity key={item.id}
                            style={[styles.item, selectedItems.includes(item.id) ? styles.selectedItem : {}]}
                            onPress={() => handleSelectItem(item.id)} activeOpacity={0.6}>
                            <SvgUri width={42} height={42} uri={item.image_url} />
                            <Text style={styles.itemTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>
    )
}

export default Points;