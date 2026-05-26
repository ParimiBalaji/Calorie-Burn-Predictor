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

*  Bidirectional Glowing Decimal Inputs**: Value badges next to the parameters are active numerical text boxes supporting floating-point numbers. Typing directly (e.g. weight of `70.4 kg` or age of `25.5`) instantly repaints the slider track and runs model calculations.
*  Floating AI Fitness Advisor (Coach Aura)**: Resides in the bottom-right corner with a pulse indicator. It supports suggestion chips, dynamically reads active screen sliders, and provides personalized voice summaries.
*  Text-to-Speech (TTS) & Web Audio Soundscape**: Coach Aura speaks to you aloud! The UI is also equipped with mechanical ticks on adjustment and sci-fi swipes on preset transitions, synthesized purely in-browser via the Web Audio API.
*  Segmented Presets with Real-Time Slider Animations**: Instantly toggle presets (** HIIT**, ** Lift**, ** Yoga**, ** Walk**). Clicking a preset smoothly slides the inputs into their physiological ranges.
*  Real-Time Ambient Accent Theme Picker**: Switch between **Neon Coral**, **Electric Teal**, **Active Green**, and **Sun Gold** to instantly recolor the neon background glow orbs, indicators, and both graphical Chart.js canvases.
*  Muscular Heatmap & Metabolic Fuel Splitter**: Displays estimated muscular fatigue indicators and splits active aerobic (fat-burning) vs. anaerobic (glycolytic) energy states.
*  workout Logger & physical PDF Generator**: Tally and persist historical sessions inside the local browser (`localStorage`) and export physically clean PDF prints.

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


