// Cloudinary configuration
const CLOUD_NAME = 'dgmexpa8v';
const UPLOAD_PRESET = 'nk3archtecture';

export const uploadToCloudinary = async (file: File, folder: string = 'nk3d'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);
    
    // Determine resource type
    const resourceType = file.type.startsWith('image/') ? 'image' : 'raw';
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

    fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          reject(new Error(data.error.message));
        } else {
          resolve(data.secure_url);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

