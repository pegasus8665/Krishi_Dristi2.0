import tensorflow as tf
import os

try:
    model = tf.keras.models.load_model("disease.keras")
    print(f"Model Output Shape: {model.output_shape}")
    
    # Try to find class names in config
    print("Checking config for class names...")
    config = model.get_config()
    # print(config) # Too large to print all
    
    # Check if 'class_names' is in config
    if 'class_names' in config:
        print(f"Found class names in config: {config['class_names']}")
    else:
        print("Class names not found in top-level config.")
        
    # Sometimes they are in layers metadata? Unlikely.
    
except Exception as e:
    print(f"Error: {e}")
