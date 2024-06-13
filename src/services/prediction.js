const tf = require("@tensorflow/tfjs-node");

async function predictClassification(model, image) {
  const tensor = tf.node.decodeJpeg(image).resizeNearestNeighbor([224, 224]).expandDims().toFloat();

  const prediction = model.predict(tensor);
  const score = await prediction.data();
  const confidenceScore = Math.max(...score) * 100;

  const classes = ['Melanocytic nevus', 'Squamous cell carcinoma', 'Vascular lesion'];
  // const classes = ['Potato__early_blight', 'Potato__healthy', 'Potato__late_blight'];
  const classResult = tf.argMax(prediction, 1).dataSync()[0];
  const label = classes[classResult];

  let explanation, suggestion;

  if (label === 'Melanocytic nevus') {
    explanation = "Melanocytic nevus blablablalbabla."
    suggestion = "blablablalbabla."
  }

  if (label === 'Squamous cell carcinoma') {
    explanation = "Squamous cell carcinoma blablablalbabla."
    suggestion = "blablablalbabla."
  }

  if (label === 'Vascular lesion') {
    explanation = "Vascular lesion blablablalbabla."
    suggestion = "blablablalbabla."
  }
  // if (label === 'Potato__early_blight') {
  //   explanation = "Potato__early_blight blablablalbabla."
  //   suggestion = "blablablalbabla."
  // }

  // if (label === 'Potato__healthy') {
  //   explanation = "Potato__healthy blablablalbabla."
  //   suggestion = "blablablalbabla."
  // }

  // if (label === 'Potato__late_blight') {
  //   explanation = "Potato__late_blight blablablalbabla."
  //   suggestion = "blablablalbabla."
  // }

  return { confidenceScore, label, explanation, suggestion };
//   const prediction = model.predict(tensor);
//   const softmaxPredictions = tf.softmax(prediction);
//   const probabilities = await softmaxPredictions.array();
//   const maxIndex = probabilities[0].indexOf(Math.max(...probabilities[0]));
//   const maxProbability = probabilities[0][maxIndex];

//   const diseaseLabels = ["Potato__early_blight", "Potato__healthy", "Potato__late_blight"];

//   return maxProbability < 0.2 ? { message: "No disease detected" } : { disease: diseaseLabels[maxIndex] };
}

module.exports = predictClassification;
