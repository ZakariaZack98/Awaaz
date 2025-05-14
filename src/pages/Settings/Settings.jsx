import React, { useState } from 'react'

const Settings = () => {
    const [showThreadsBadge, setShowThreadsBadge] = useState(true);
    const [showSuggestion, setShowSuggestion] = useState(true);
    const [followersVisibility, setFollowersVisibility] = useState('Public');
    const [followingVisibility, setFollowingVisibility] = useState('Public');

    // State for Social handle
    const [selectedPlatform, setSelectedPlatform] = useState('Facebook');
    const [socialLink, setSocialLink] = useState('');
    const platforms = ['Facebook', 'X (Twitter)', 'YouTube', 'Instagram', 'LinkedIn'];

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">Edit profile</h1>

            <div className="flex items-center gap-4 mb-6">
                <img src="https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg" alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                <div>
                    <p className="font-medium">Sabbir Hossain S</p>
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
                        className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
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
                        className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
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
                        className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
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
                        className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
                    />
                </div>

                {/* Bio Section */}
                <div>
                    <label className="block font-medium mb-1">Bio</label>
                    <textarea
                        placeholder="Bio"
                        maxLength={150}
                        className="w-full border rounded-md p-2 h-24 focus:ring focus:ring-blue-300"
                    ></textarea>
                </div>

                {/* Threads Badge Toggle */}
                <div>
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
                    <select className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">This won’t be part of your public profile.</p>
                </div>

                {/* Show Suggestions Toggle */}
                <div>
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
                    <p className="text-xs text-gray-500 mt-1">
                        Choose whether people can see similar account suggestions on your profile.
                    </p>
                </div>
            </div>
            <button className="w-full mt-6 bg-blue-500 text-white rounded-md py-2 font-medium hover:bg-blue-600 cursor-pointer">
                Submit
            </button>
        </div>
    );
};

export default Settings
