"""
Ishihara Digit Classification Model Training Script
Trains a CNN to recognize digits (0-9) from Ishihara-style colour blindness test images.
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split
from PIL import Image
import re
from collections import defaultdict
import random

# Set random seeds for reproducibility
np.random.seed(42)
tf.random.set_seed(42)
random.seed(42)

# Constants
IMG_SIZE = 128
BATCH_SIZE = 32
EPOCHS = 50
DATA_DIR = r"C:\Users\adity\Downloads\archive\data"

# Training fonts (use more fonts to have sufficient training data)
# We'll use 70% of fonts for training, 30% for validation
TRAIN_SPLIT = 0.7

def parse_filename(filename):
    """
    Parse Ishihara image filename to extract digit, font, and type.
    Format: <digit>_<fontname>theme_<X> type_<Y>.png
    """
    match = re.match(r'(\d)_(.+?)theme_\d+ type_(\d)', filename)
    if match:
        digit = int(match.group(1))
        font = match.group(2)
        color_type = int(match.group(3))
        return digit, font, color_type
    return None, None, None

def load_and_preprocess_image(image_path):
    """Load and preprocess an image."""
    img = Image.open(image_path).convert('RGB')
    img = img.resize((IMG_SIZE, IMG_SIZE))
    img_array = np.array(img) / 255.0  # Normalize to [0, 1]
    return img_array

def load_dataset(data_dir, train_split=0.7):
    """
    Load dataset and split into train/validation based on fonts.
    Use train_split ratio of fonts for training, rest for validation.
    """
    # Get all image files
    all_files = [f for f in os.listdir(data_dir) if f.endswith('.png')]
    
    print(f"Total images found: {len(all_files)}")
    
    # Group files by font
    font_groups = defaultdict(list)
    type_stats = defaultdict(int)
    digit_stats = defaultdict(int)
    
    for filename in all_files:
        digit, font, color_type = parse_filename(filename)
        if digit is not None:
            font_groups[font].append((filename, digit))
            type_stats[color_type] += 1
            digit_stats[digit] += 1
    
    print(f"\nDataset statistics:")
    print(f"Unique fonts: {len(font_groups)}")
    print(f"Color types distribution: {dict(type_stats)}")
    print(f"Digit distribution: {dict(digit_stats)}")
    
    # Split fonts into train and validation
    all_fonts = list(font_groups.keys())
    random.shuffle(all_fonts)
    
    n_train_fonts = max(3, int(len(all_fonts) * train_split))
    train_fonts = all_fonts[:n_train_fonts]
    val_fonts = all_fonts[n_train_fonts:]
    
    print(f"\nTrain fonts ({len(train_fonts)}): {train_fonts[:5]}...")
    print(f"Val fonts ({len(val_fonts)}): {val_fonts[:5]}...")
    
    # Load images
    train_images = []
    train_labels = []
    val_images = []
    val_labels = []
    
    for font, files in font_groups.items():
        for filename, digit in files:
            image_path = os.path.join(data_dir, filename)
            img_array = load_and_preprocess_image(image_path)
            
            if font in train_fonts:
                train_images.append(img_array)
                train_labels.append(digit)
            else:
                val_images.append(img_array)
                val_labels.append(digit)
    
    # Convert to numpy arrays
    X_train = np.array(train_images)
    y_train = np.array(train_labels)
    X_val = np.array(val_images)
    y_val = np.array(val_labels)
    
    print(f"\nTraining set: {len(X_train)} images")
    print(f"Validation set: {len(X_val)} images")
    
    return X_train, y_train, X_val, y_val

def create_model(input_shape=(IMG_SIZE, IMG_SIZE, 3), num_classes=10):
    """
    Create a CNN model for digit classification.
    MNIST-style architecture adapted for colored images.
    """
    model = keras.Sequential([
        # Input layer
        layers.Input(shape=input_shape),
        
        # First convolutional block
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Second convolutional block
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Third convolutional block
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Fourth convolutional block
        layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.4),
        
        # Flatten and dense layers
        layers.Flatten(),
        layers.Dense(512, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        
        # Output layer
        layers.Dense(num_classes, activation='softmax')
    ])
    
    return model

def train_model(model, X_train, y_train, X_val, y_val):
    """Train the model with data augmentation and callbacks."""
    
    # Compile model
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Data augmentation
    data_augmentation = keras.Sequential([
        layers.RandomRotation(0.05),
        layers.RandomZoom(0.1),
        layers.RandomTranslation(0.05, 0.05),
    ])
    
    # Apply augmentation to training data
    def augment(images, labels):
        images = data_augmentation(images, training=True)
        return images, labels
    
    # Create datasets
    train_dataset = tf.data.Dataset.from_tensor_slices((X_train, y_train))
    train_dataset = train_dataset.shuffle(1000).batch(BATCH_SIZE).map(augment).prefetch(tf.data.AUTOTUNE)
    
    val_dataset = tf.data.Dataset.from_tensor_slices((X_val, y_val))
    val_dataset = val_dataset.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)
    
    # Callbacks
    callbacks = [
        keras.callbacks.ModelCheckpoint(
            'best_ishihara_model.keras',
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-7,
            verbose=1
        ),
        keras.callbacks.EarlyStopping(
            monitor='val_accuracy',
            patience=7,
            restore_best_weights=True,
            verbose=1
        )
    ]
    
    # Train model
    print("\n" + "="*60)
    print("Starting model training...")
    print("="*60 + "\n")
    
    history = model.fit(
        train_dataset,
        validation_data=val_dataset,
        epochs=EPOCHS,
        callbacks=callbacks,
        verbose=1
    )
    
    return history

def evaluate_model(model, X_val, y_val):
    """Evaluate model and show detailed metrics."""
    print("\n" + "="*60)
    print("Model Evaluation")
    print("="*60 + "\n")
    
    # Overall accuracy
    val_loss, val_accuracy = model.evaluate(X_val, y_val, verbose=0)
    print(f"Validation Loss: {val_loss:.4f}")
    print(f"Validation Accuracy: {val_accuracy*100:.2f}%")
    
    # Per-digit accuracy
    predictions = model.predict(X_val, verbose=0)
    predicted_labels = np.argmax(predictions, axis=1)
    
    print("\nPer-digit accuracy:")
    for digit in range(10):
        mask = y_val == digit
        if np.sum(mask) > 0:
            digit_accuracy = np.mean(predicted_labels[mask] == digit)
            print(f"  Digit {digit}: {digit_accuracy*100:.2f}% ({np.sum(mask)} samples)")
    
    # Confusion analysis
    print("\nMost common misclassifications:")
    errors = predicted_labels != y_val
    if np.sum(errors) > 0:
        error_pairs = defaultdict(int)
        for true_label, pred_label in zip(y_val[errors], predicted_labels[errors]):
            error_pairs[(true_label, pred_label)] += 1
        
        sorted_errors = sorted(error_pairs.items(), key=lambda x: x[1], reverse=True)
        for (true_label, pred_label), count in sorted_errors[:5]:
            print(f"  {true_label} → {pred_label}: {count} times")

def main():
    """Main training pipeline."""
    print("="*60)
    print("Ishihara Digit Classification Model Training")
    print("="*60)
    
    # Check if data directory exists
    if not os.path.exists(DATA_DIR):
        print(f"Error: Data directory not found: {DATA_DIR}")
        return
    
    # Load dataset
    print("\nLoading dataset...")
    X_train, y_train, X_val, y_val = load_dataset(DATA_DIR, TRAIN_SPLIT)
    
    # Create model
    print("\nCreating model...")
    model = create_model()
    model.summary()
    
    # Train model
    history = train_model(model, X_train, y_train, X_val, y_val)
    
    # Load best model
    print("\nLoading best model...")
    model = keras.models.load_model('best_ishihara_model.keras')
    
    # Evaluate
    evaluate_model(model, X_val, y_val)
    
    # Save final model
    final_model_path = 'ishihara_digit_model.keras'
    model.save(final_model_path)
    print(f"\n✓ Final model saved as: {final_model_path}")
    print(f"✓ Model is ready for integration with Flask backend!")
    
    print("\n" + "="*60)
    print("Training Complete!")
    print("="*60)

if __name__ == "__main__":
    main()
