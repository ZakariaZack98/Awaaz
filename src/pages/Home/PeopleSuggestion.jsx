import React, { useContext } from 'react'
import { DataContext } from '../../contexts/DataContexts';
import UserCard from '../../components/common/UserCard';


const PeopleSuggestion = () => {
    const { currentUser } = useContext(DataContext);
    return (
        <div className=" w-[70%] p-4 h-screen bg-white shadow rounded-xl space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={currentUser?.imgUrl} // Your profile image
                        alt="profile"
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <p className="text-sm font-bold text-gray-800">{currentUser?.fullName}</p>
                        <p className="text-xs text-gray-500">{currentUser?.fullName}</p>
                    </div>
                </div>
                <button className="text-sm text-blue-500 font-semibold">Switch</button>
            </div>

            <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-500">Suggested for you</p>
                <button className="text-xs text-blue-500 font-semibold">See All</button>
            </div>
            {/* UserCard Component */}
            <UserCard />
            {/* UserCard Component */}
            
            <footer className="pt-2 text-[10px] text-gray-400 space-y-1">
                <p>Developer</p>
                <p className="pt-2">© 2025 Awaaz</p>
            </footer>
        </div>
    );

}

export default PeopleSuggestion
