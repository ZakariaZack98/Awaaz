import React, { useEffect, useState } from 'react'
import { get, ref } from 'firebase/database';
import { auth, db } from '../../../Database/Firebase.config';
import UserList from './UserList';
const UserCard = () => {

    const [userData, setUserDAta] = useState([]);

    useEffect(() => {
        const usersRef = ref(db, `users/`);
        get(usersRef)
            .then(snapshot => {
                const userArr = [];
                snapshot.forEach(userSnapshot => {
                    // console.log(userSnapshot.key);
                    if (userSnapshot.key !== auth.currentUser.uid) {
                        userArr.push(userSnapshot.val());
                    }
                })
                setUserDAta(userArr);
            })
    }, [])

    return (
        <div className='space-y-4 h-[70%] overflow-y-scroll' style={{ scrollbarWidth: "none" }}>
                <UserList UserData={userData} />
            
        </div>
    )
}

export default UserCard
