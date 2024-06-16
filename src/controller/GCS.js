const cloudStorage = require("../services/cloudStorage");

const bucketName = process.env.BUCKET_NAME;

const uploadImageToGCS = async (userId, imageFile) => {
  const bucket = cloudStorage.bucket(bucketName);
  const fileName = `upload/${userId}/${Date.now()}_${imageFile.originalname}`;
  const file = bucket.file(fileName);

  await file.save(imageFile.buffer, {
    metadata: {
      contentType: imageFile.mimetype,
    },
  });

  return `https://storage.googleapis.com/${bucketName}/${fileName}`;
};

const deleteImageFromGCS = async (imageUrl) => {
  const bucket = cloudStorage.bucket(bucketName);
  const fileName = imageUrl.replace(`https://storage.googleapis.com/${bucketName}/`, '');
  const file = bucket.file(fileName);

  await file.delete();
};

module.exports = { uploadImageToGCS, deleteImageFromGCS };
