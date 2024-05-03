import sys
from joblib import load

# Load the saved classifier
loaded_classifier = load('C:/Users/braie/OneDrive/Bureau/integrationPi/integration-v7/El-Kindy-Backend/controllers/sentiemnt_model_classifier.joblib')

# Load the saved CountVectorizer
loaded_cv = load('C:/Users/braie/OneDrive/Bureau/integrationPi/integration-v7/El-Kindy-Backend/controllers/sentiemnt_model.joblib')

# Extract the new_sentence from command-line arguments
new_sentence = sys.argv[1]

# Preprocess the sentence using the loaded CountVectorizer
new_sentence_transformed = loaded_cv.transform([new_sentence]).toarray()

# Predict sentiment using the loaded classifier
predicted_sentiment = loaded_classifier.predict(new_sentence_transformed)

if predicted_sentiment == 0:
  print("Negative")
elif predicted_sentiment == 1:
  print("Neutral")
elif predicted_sentiment == 2:
  print("Positive")
