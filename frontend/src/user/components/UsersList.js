import React from 'react'

import UserItem from './UserItem';
import Card from '../../shared/components/UIElements/Card';
import './UsersList.css'

const UsersList = (props) => {
    if(props.items.length === 0){
        return <div className='center'>
            <Card>
            <h2>No User Found.</h2>
            </Card>
        </div>
    }

    return (<ul className='users-list'>
        {props.items.map(item =>
            <UserItem 
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                placeCount={item.places}    
            />
        )}
    </ul>
    )
}

export default UsersList;
