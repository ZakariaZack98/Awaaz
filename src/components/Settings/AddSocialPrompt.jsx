import React, { useState } from 'react'

// Define platforms array outside component
const platforms = [
  "Facebook",
  "X (Twitter)", 
  "YouTube",
  "Instagram",
  "LinkedIn",
];

const AddSocialPrompt = ({ setSocialHandels, socialLink, setSocialLink }) => {
  // Keep useState hook inside component
  const [selectedPlatform, setSelectedPlatform] = useState("Facebook");

  const handleSocialLink = (platform, updateValue) => {
    setSocialLink(updateValue);
    setSocialHandels((prev) => ({
      ...prev,
      [platform.toLowerCase()]: {
        name: platform,
        url: updateValue,
      },
    }));
  };

  return (
    <div>
      <div>
        <label className="block font-medium mb-1">Social Handles</label>
        <select
          value={selectedPlatform}
          onChange={(e) => { 
            setSelectedPlatform(e.target.value); 
            setSocialLink("") 
          }}
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
        <div className='flex gap-x-1'>
          <input
            type="url"
            placeholder={`https://www.${selectedPlatform.toLowerCase().split(" ")[0]}.com/yourprofile`}
            value={socialLink}
            onChange={(e) => setSocialLink(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
          />
          {socialLink && (
            <button
              onClick={() => handleSocialLink(selectedPlatform, socialLink)}
              className="bg-blue-500 text-white px-4 cursor-pointer rounded"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddSocialPrompt
