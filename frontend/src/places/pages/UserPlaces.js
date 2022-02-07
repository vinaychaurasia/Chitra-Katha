import React from 'react'
import {useParams} from 'react-router-dom';

import PlacesList from '../../places/components/PlacesList';

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world',
        imageUrl: 'https://media.timeout.com/images/101705309/image.jpg',
        address: '20 W 29th St, New York, NY 10001',
        creator: 'u1',
        location: {
            lat: 40.7484405,
            lng: -73.9856644
        }
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world',
        imageUrl: 'https://media.timeout.com/images/101705309/image.jpg',
        address: '20 W 29th St, New York, NY 10001',
        creator: 'u2',
        location: {
            lat: 40.7484405,
            lng: -73.9856644
        }
    }
]

const UserPlaces = () => {
    const userId = useParams().userId;
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
    return <PlacesList items={loadedPlaces}/>
}

export default UserPlaces
