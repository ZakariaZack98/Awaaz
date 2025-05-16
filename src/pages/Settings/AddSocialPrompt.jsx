import React, { useState } from 'react'

const AddSocialPrompt = ({ setSocialHandels }) => {
    const [selectedPlatform, setSelectedPlatform] = useState("Facebook");
    const [socialLink, setSocialLink] = useState("");
    const platforms = [
        "Facebook",
        "X (Twitter)",
        "YouTube",
        "Instagram",
        "LinkedIn",
    ];
    
    const handleSocialLink = (platform, value) => {
        setSocialLink(value);
        setSocialHandels((prev) => ({
            ...prev,
            [platform.toLowerCase()]: {
                name: platform,
                url: value,
            },
        }));
    };

    return (
        <div>
              <div>
                <label className="block font-medium mb-1">Social Handles</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => {setSelectedPlatform(e.target.value); setSocialLink("")}}
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
                  placeholder={`https://www.${
                    selectedPlatform.toLowerCase().split(" ")[0]
                  }.com/yourprofile`}
                  value={socialLink}
                  onChange={(e) =>
                    handleSocialLink(selectedPlatform, e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                />
              </div>
        </div>
    )
}

export default AddSocialPrompt
