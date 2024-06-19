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

const copyImageInGCS = async (sourceImageUrl, destinationFolder) => {
  const bucket = cloudStorage.bucket(bucketName);
  const sourceFileName = sourceImageUrl.replace(`https://storage.googleapis.com/${bucketName}/`, '');
  const sourceFile = bucket.file(sourceFileName);
  const destinationFileName = `${destinationFolder}/${sourceFileName.split('/').pop()}`;
  const destinationFile = bucket.file(destinationFileName);

  await sourceFile.copy(destinationFile);

  return `https://storage.googleapis.com/${bucketName}/${destinationFileName}`;
};
module.exports = { uploadImageToGCS, deleteImageFromGCS, copyImageInGCS };
