import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, get } from "firebase/database";
import { getAuth } from "firebase/auth";

const Settings = () => {
    const db = getDatabase()
    const auth = getAuth()
    const [showThreadsBadge, setShowThreadsBadge] = useState(true);
    const [showSuggestion, setShowSuggestion] = useState(true);
    const [followersVisibility, setFollowersVisibility] = useState('Public');
    const [followingVisibility, setFollowingVisibility] = useState('Public');
    const [gender, setGender] = useState("Unselected")

    // State for Social handle
    const [selectedPlatform, setSelectedPlatform] = useState('Facebook');
    const [socialLink, setSocialLink] = useState('');
    const platforms = ['Facebook', 'X (Twitter)', 'YouTube', 'Instagram', 'LinkedIn'];

    const [userData, setUserData] = useState()

    // useEffec, fetch data /user/`${auth.current.uid}`
    // fetch Data from user
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userRef = ref(db, `users/${auth?.currentUser?.uid}`);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    setUserData(snapshot.val());
                }
            } catch (error) {
                console.error("Error fetch data", error);
            }
        };
        fetchUserData();
    }, []);

    console.log(userData);

    return (

        <>
            {userData ?
                <div className="max-w-xl mx-auto p-6" >
                    <h1 h1 className="text-2xl font-semibold mb-6" > Edit profile</h1 >

                    <div className="flex items-center gap-4 mb-6">
                        <img src={userData?.imgUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                        <div>
                            <p className="font-medium">{userData?.fullName}</p>
                            <button className="text-blue-500 font-medium">Change photo</button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Follower / Following Visibility Section (Select dropdown) */}
                        <div>
                            <label className="block font-medium mb-1">Followers Visibility</label>
                            <select
                                value={followersVisibility}
                                onChange={(e) => setFollowersVisibility(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                            >
                                <option value="Public">Public</option>
                                <option value="Private">Private</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Following Visibility</label>
                            <select
                                value={followingVisibility}
                                onChange={(e) => setFollowingVisibility(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                            >
                                <option value="Public">Public</option>
                                <option value="Private">Private</option>
                            </select>
                        </div>

                        {/* Social Handles Section */}
                        <div>
                            <label className="block font-medium mb-1">Social Handles</label>
                            <select
                                value={selectedPlatform}
                                onChange={(e) => setSelectedPlatform(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                            >
                                {platforms.map((platform) => (
                                    <option key={platform} value={platform}>
                                        {platform}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium mb-1">
                                Enter {selectedPlatform} Link
                            </label>
                            <input
                                type="url"
                                placeholder={`https://www.${selectedPlatform.toLowerCase().split(' ')[0]}.com/yourprofile`}
                                value={socialLink}
                                onChange={(e) => setSocialLink(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                            />
                        </div>

                        {/* Bio Section */}
                        <div>
                            <label className="block font-medium mb-1">Bio</label>
                            <textarea
                                placeholder="Bio"
                                maxLength={160}
                                className="w-full border border-gray-300 rounded-md p-2 h-24 focus:ring focus:ring-blue-300"
                            ></textarea>
                        </div>

                        {/* Threads Badge Toggle */}
                        <div className='flex justify-between border border-gray-300 rounded-md p-2'>
                            <label className="block font-medium mb-1">Show Threads badge</label>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={showThreadsBadge}
                                    onChange={() => setShowThreadsBadge(!showThreadsBadge)}
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full relative peer-checked:bg-blue-500">
                                    <div
                                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${showThreadsBadge ? 'translate-x-5' : ''}`}
                                    ></div>
                                </div>
                            </label>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block font-medium mb-1">Gender</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300">
                                <option value={"Male"}>Male</option>
                                <option value={"Female"}>Female</option>
                                <option value={"Unselected"}>Unselected</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">This won’t be part of your public profile.</p>
                        </div>

                        {/* Show Suggestions Toggle */}
                        <div className='flex justify-between border border-gray-300 rounded-md p-2'>
                            <label className="block font-medium mb-1">Show account suggestions on profiles</label>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={showSuggestion}
                                    onChange={() => setShowSuggestion(!showSuggestion)}
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full relative peer-checked:bg-blue-500">
                                    <div
                                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${showSuggestion ? 'translate-x-5' : ''}`}
                                    ></div>
                                </div>
                            </label>
                        </div>
                    </div>
                    <button className="w-full mt-6 bg-blue-500 text-white rounded-md py-2 font-medium hover:bg-blue-600 cursor-pointer">
                        Submit
                    </button>
                </div >
                :
                <div className="max-w-xl mx-auto p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-6 w-32"></div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                        <div className="space-y-2">
                            <div className="w-32 h-4 bg-gray-200 rounded"></div>
                            <div className="w-24 h-3 bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i}>
                                <div className="w-40 h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="w-full h-10 bg-gray-200 rounded"></div>
                            </div>
                        ))}

                        <div>
                            <div className="w-40 h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="w-full h-10 bg-gray-200 rounded"></div>
                        </div>

                        <div>
                            <div className="w-40 h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="w-full h-10 bg-gray-200 rounded"></div>
                        </div>

                        <div>
                            <div className="w-16 h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="w-full h-24 bg-gray-200 rounded"></div>
                        </div>

                        <div className="flex justify-between items-center border border-gray-300 rounded-md p-2">
                            <div className="w-32 h-4 bg-gray-200 rounded"></div>
                            <div className="w-11 h-6 bg-gray-200 rounded-full"></div>
                        </div>

                        <div>
                            <div className="w-16 h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="w-full h-10 bg-gray-200 rounded"></div>
                            <div className="w-48 h-3 bg-gray-200 rounded mt-2"></div>
                        </div>

                        <div className="flex justify-between items-center border border-gray-300 rounded-md p-2">
                            <div className="w-40 h-4 bg-gray-200 rounded"></div>
                            <div className="w-11 h-6 bg-gray-200 rounded-full"></div>
                        </div>
                    </div>

                    <div className="w-full h-10 bg-gray-200 rounded mt-6"></div>
                </div>
            }
        </>
    );
};

export default Settings
