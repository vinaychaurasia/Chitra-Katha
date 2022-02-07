import React, {useState, useContext} from 'react';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormComponents/Input';
import Button from '../../shared/components/FormComponents/Button';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/components/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './Auth.css';

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            input: '',
            isValid: false
        },
        password: {
            input: '',
            isValid: false
        }
    }, false);

    const switchModeHandler = () => {
        if(!isLoginMode){
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            )
        }else{
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                }
            }, false)
        }
        setIsLoginMode(prevMode => !prevMode);
    }

    
    const authSubmitHandler = async event => {
        event.preventDefault();
        if(isLoginMode){
        }else{
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:5000/api/users/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    })
                })
                const responseData = await response.json();
                console.log(responseData);
                setIsLoading(false);
                auth.login();
            } catch (error) {
                console.log(error);
                setIsLoading(false);
                setError(error.message || 'Something went wrong, Please try again.');
            }
        }
    }

    return <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
            {
                !isLoginMode && 
                <Input 
                element="input"
                id="name"
                type="text"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please provide a valid Name"
                onInput={inputHandler}
            />
            }
            <Input 
                element="input"
                id="email"
                type="email"
                label="E-mail"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please provide a valid Email address."
                onInput={inputHandler}
            />
            <Input 
                element="input"
                id="password"
                type="password"
                label="Password"
                validators={[VALIDATOR_MINLENGTH(8)]}
                errorText="Please provide a valid password, at least 8 character."
                onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>{isLoginMode ? 'LOGIN' : 'SIGNUP'}</Button>
            <Button inverse onClick={switchModeHandler}>Switch to {isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
        </form>
        </Card>
}

export default Auth;