# ⚡ BurnFit AI — Premium Calorie Burn Prediction Dashboard

[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/)
[![Flask Version](https://img.shields.io/badge/flask-2.0%2B-green.svg)](https://flask.palletsprojects.com/)
[![ML Engine](https://img.shields.io/badge/engine-XGBoost-ff4757.svg)](https://xgboost.readthedocs.io/)
[![Precision MAE](https://img.shields.io/badge/precision-~1.48%20kcal-00d2fc.svg)](#-machine-learning-under-the-hood)
[![Accuracy R²](https://img.shields.io/badge/accuracy-99.9%25-emerald.svg)](#-machine-learning-under-the-hood)

**BurnFit AI** is an exceptionally premium, visually stunning, and highly interactive sports dashboard that uses an advanced **XGBoost Regressor Machine Learning model** to predict active caloric burn during workouts with near-lab precision. 

By analyzing user biometrics (Age, Gender, Weight, Height) and workout intensity telemetry (Duration, Average Heart Rate, Core Body Temperature), BurnFit AI delivers instant, customized thermodynamic calculations in milliseconds.

---

##  Project Showcase & Key Features

We have upgraded the dashboard with several high-fidelity interactive elements designed to deliver an extreme peak-level user experience:

Features
## Smart Number Inputs
** Easily type values like weight, age, or calories directly with decimal support. Sliders update instantly and calculations run in real time.
## AI Fitness Assistant – Coach Aura
** A floating AI coach gives workout suggestions, reads your current settings, and provides voice-based fitness guidance.
## Voice & Sound Effects
** Built-in text-to-speech lets the AI coach speak aloud. Interactive sounds make slider movements and transitions feel more engaging.
## Quick Workout Presets
** Choose presets like HIIT, Lift, Yoga, or Walk to automatically adjust workout settings with smooth animations.
## Custom Theme Colors
** Switch between themes like Neon Coral, Electric Teal, Active Green, and Sun Gold to personalize the app appearance.
## Muscle & Energy Tracking
** Visual indicators show estimated muscle fatigue and energy usage between fat-burning and high-intensity states.
## Workout History & PDF Export
** Save workout sessions in the browser and export clean PDF reports for tracking progress.

---

##  Machine Learning Under the Hood

The predictive core is trained on **15,000 active workout profiles** to model the human metabolic output. 

### Model Performance Metrics
* **Algorithm**: XGBoost Regressor (`XGBRegressor`)
* **Tested Mean Absolute Error (MAE)**: **~1.483 calories** (Near-lab precision)
* **Variance Explained ($R^2$ Score)**: **99.9%**

### Core Biological Feature Weights
Through statistical training, the model weights specific physiological attributes based on thermodynamic energy expenditure:
1. **Workout Duration (45% Weight)**: The single largest driver. The longer the body performs physical work, the more thermodynamic heat is generated.
2. **Average Heart Rate (35% Weight)**: Direct biological indicator of oxygen uptake (VO2) and cardiac intensity.
3. **Core Body Temperature (12% Weight)**: Directly measures muscular friction and active metabolic sweat triggers.
4. **User Biometrics (8% Weight)**: Age, weight, height, and gender set the basal resting speed, completing the final calculation.

> [!NOTE]
> **Extrapolation Capping Logic**: Tree-based models like XGBoost cannot predict patterns above the maximum values seen in training data (the dataset caps workouts at 30 minutes). To prevent flat-out plateaus for longer sessions, BurnFit AI caps the API query at 30 minutes and **scales predictions up linearly** in JavaScript for durations up to 90 minutes.

---

## 📂 Project Architecture

```
d:\Calorie_Website/
│
├── app.py                     # Flask backend micro-server & prediction API
├── calorie_model.pkl          # Pickled, pre-trained XGBoost Regressor model
├── calories.csv               # Calorie dataset (source)
├── exercise.csv               # Exercise biometric dataset (source)
├── train_model.py             # Python training script with original seeds (random_state=2)
├── generate_pdf.py            # Local PDF generation script (compiles pitch presentation guide)
├── BurnFit_AI_Project_Presentation.pdf # Presentation pitch document
├── README.md                  # Beautiful repository documentation (this file)
│
├── templates/
│   └── index.html             # Premium glassmorphic semantic UI dashboard
│
└── static/
    ├── css/
    │   └── style.css          # Viewport responsive design, theme variables, and print stylesheets
    └── js/
        └── script.js          # Interactive controller: TTS, presets, Web Audio, and Chart.js binding
```

---

##  Installation & Local Setup

Get BurnFit AI running on your machine in just three simple steps:

### 1. Clone the Repository
```bash
git clone https://github.com/ParimiBalaji/Calorie-Burn-Predictor.git
cd Calorie-Burn-Predictor
```

### 2. Install Dependencies
Ensure you have Python installed, then run:
```bash
pip install flask xgboost scikit-learn pandas numpy reportlab
```

### 3. Run the Flask Web Server
```bash
python app.py
```

### 4. Open in Your Browser
Navigate to:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**


