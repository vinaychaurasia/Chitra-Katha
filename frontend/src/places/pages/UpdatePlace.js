import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import Input from '../../shared/components/FormComponents/Input';
import Button from '../../shared/components/FormComponents/Button';
import Card from '../../shared/components/UIElements/Card';
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from '../../shared/components/util/validators';
import { useForm } from '../../shared/hooks/form-hook';

import './FormPlace.css';

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

const UpdatePlace = () => {

    const [isLoading, setIsLoading] = useState(true);
    const placeId = useParams().placeId;
    
    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
        }, false);

    const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);
    console.log('placeId => ' + placeId)

    useEffect(() => {
        if(identifiedPlace){
            setFormData({
                title: {
                    value: identifiedPlace.title,
                    isValid: true
                },
                description: {
                    value: identifiedPlace.description,
                    isValid: true
                }
            }, true);
        }

        setIsLoading(false);

    }, [setFormData, identifiedPlace]);

    const placeUpdateSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
    }

    if(!identifiedPlace){
        return <div className='center'>
            <Card>
                <h2>Could not find place</h2>
            </Card>
        </div>
    }

    if(isLoading){
        return <div className='center'>
            <h2>Loading...</h2>
        </div>
    }

    return <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
        <Input 
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please Enter a Valid Title"
            onInput = {inputHandler}
            initialValue={formState.inputs.title.value}
            initialValid={formState.inputs.title.isValid}
        />

        <Input 
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please Enter a Valid description (min 5 Characters)."
            onInput = {inputHandler}
            initialValue={formState.inputs.description.value}
            initialValid={formState.inputs.description.isValid}
        />

        <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
    </form>
}

export default UpdatePlace;
