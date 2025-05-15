export const uploadFiles = async (files) => {
  const uploadPreset = "awaaz_app";
  const cloudName = "dubcsgtfg";
  
  const uploadPromises = files.map((file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    
    const resourceType = file.type.startsWith("video/") ? "video" : "image";
    
    return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((result) => result.secure_url)
      .catch((err) => {
        console.error("Error uploading file:", err);
        return null;
      });
  });
  
  const urls = await Promise.all(uploadPromises);
  return urls.filter(url => url !== null);
};