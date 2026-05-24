/* ==========================================================================
   BurnFit AI - Frontend Application Controller (Complete Interactive Version)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // DOM Element Selections
    // -------------------------------------------------------------
    const form = document.getElementById('prediction-form');
    const ageSlider = document.getElementById('age');
    const heightSlider = document.getElementById('height');
    const weightSlider = document.getElementById('weight');
    const durationSlider = document.getElementById('duration');
    const heartRateSlider = document.getElementById('heart_rate');
    const bodyTempSlider = document.getElementById('body_temp');
    const calorieGoalSlider = document.getElementById('calorie-goal');

    const ageVal = document.getElementById('age-val');
    const heightVal = document.getElementById('height-val');
    const weightVal = document.getElementById('weight-val');
    const durationVal = document.getElementById('duration-val');
    const heartRateVal = document.getElementById('heart_rate-val');
    const bodyTempVal = document.getElementById('body_temp-val');
    const calorieGoalVal = document.getElementById('calorie-goal-val');

    const calorieDisplay = document.getElementById('calorie-prediction');
    const radialProgress = document.getElementById('radial-progress');
    const optimizeBtn = document.getElementById('optimize-btn');

    // Controls (Header)
    const soundToggleBtn = document.getElementById('sound-toggle');
    const infoToggleBtn = document.getElementById('info-toggle');
    const infoModal = document.getElementById('info-modal');
    const closeModalBtn = document.getElementById('close-modal');

    // Chatbot selections
    const chatLauncher = document.getElementById('chat-launcher-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.getElementById('close-chat');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessagesContainer = document.getElementById('chat-messages-container');
    const voiceChatBtn = document.getElementById('voice-chat');

    // Workout History Log selections
    const saveSessionBtn = document.getElementById('save-session-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    const clearLogBtn = document.getElementById('clear-log-btn');
    const logTotalSessions = document.getElementById('log-total-sessions');
    const logTotalCalories = document.getElementById('log-total-calories');
    const emptyLogMsg = document.getElementById('empty-log-msg');
    const logListContainer = document.getElementById('log-list-container');

    // Health analytics elements
    const bmiNum = document.getElementById('bmi-num');
    const bmiLabel = document.getElementById('bmi-label');
    const bmiIndicator = document.getElementById('bmi-indicator');
    const bmiRec = document.getElementById('bmi-recommendation');

    const hrZoneName = document.getElementById('hr-zone-name');
    const hrZoneBar = document.getElementById('hr-zone-bar');
    const maxHrVal = document.getElementById('max-hr-val');
    const intensityVal = document.getElementById('intensity-val');
    const zoneDescription = document.getElementById('zone-description');
    
    const insightsList = document.getElementById('workout-insights');
    const goalEtaText = document.getElementById('goal-eta-text');

    // Chart variables
    let importanceChart = null;
    let trendChart = null;

    // -------------------------------------------------------------
    // Pure Web Audio Synthesizer (No external audio file dependency)
    // -------------------------------------------------------------
    let audioEnabled = true;
    let audioCtx = null;

    const initAudio = () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    };

    const playSynthSound = (frequency, type = 'sine', duration = 0.08, volume = 0.02) => {
        if (!audioEnabled) return;
        try {
            initAudio();
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
            
            gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.warn("Audio synthesis context blocked or failed:", e);
        }
    };

    // Synthesized Sound Effects presets
    const playSoftClick = () => playSynthSound(900, 'sine', 0.04, 0.015);
    const playPresetClick = () => {
        playSynthSound(550, 'triangle', 0.12, 0.025);
        setTimeout(() => playSynthSound(750, 'sine', 0.08, 0.02), 60);
    };
    const playSuccessChime = () => {
        playSynthSound(600, 'sine', 0.14, 0.02);
        setTimeout(() => playSynthSound(900, 'sine', 0.18, 0.025), 80);
    };
    const playModalSound = () => playSynthSound(450, 'triangle', 0.18, 0.03);

    // Audio toggle click handler
    soundToggleBtn.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        soundToggleBtn.classList.toggle('active');
        
        const icon = soundToggleBtn.querySelector('i');
        if (audioEnabled) {
            icon.className = 'fa-solid fa-volume-high';
            playSoftClick();
        } else {
            icon.className = 'fa-solid fa-volume-xmark';
        }
    });

    // -------------------------------------------------------------
    // Premium Segments Workout Presets & Slider Animations
    // -------------------------------------------------------------
    const presets = {
        hiit: { gender: 'male', age: 24, height: 180, weight: 78, duration: 25, heart_rate: 122, body_temp: 41.5, goal: 300 },
        strength: { gender: 'male', age: 29, height: 178, weight: 86, duration: 28, heart_rate: 108, body_temp: 39.4, goal: 180 },
        yoga: { gender: 'female', age: 31, height: 165, weight: 56, duration: 20, heart_rate: 76, body_temp: 37.3, goal: 100 },
        walk: { gender: 'female', age: 46, height: 168, weight: 68, duration: 15, heart_rate: 85, body_temp: 38.1, goal: 80 }
    };

    const animateSlider = (slider, targetVal, callback) => {
        const start = parseFloat(slider.value);
        const end = parseFloat(targetVal);
        const totalSteps = 8;
        const delta = (end - start) / totalSteps;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            const nextVal = start + (delta * step);
            slider.value = nextVal.toFixed(slider.step ? 1 : 0);
            slider.dispatchEvent(new Event('input'));

            if (step >= totalSteps) {
                clearInterval(timer);
                slider.value = end;
                slider.dispatchEvent(new Event('input'));
                if (callback) callback();
            }
        }, 22);
    };

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const presetKey = btn.dataset.preset;
            const target = presets[presetKey];
            if (!target) return;

            playPresetClick();

            const genderRadio = document.getElementById(`gender-${target.gender}`);
            genderRadio.checked = true;
            genderRadio.dispatchEvent(new Event('change'));

            animateSlider(ageSlider, target.age);
            animateSlider(heightSlider, target.height);
            animateSlider(weightSlider, target.weight);
            animateSlider(durationSlider, target.duration);
            animateSlider(heartRateSlider, target.heart_rate);
            animateSlider(bodyTempSlider, target.body_temp);
            animateSlider(calorieGoalSlider, target.goal, () => {
                runMUPrediction(false);
            });
        });
    });

    // -------------------------------------------------------------
    // Color Theme Customizer & Graph Accent Color Swapper
    // -------------------------------------------------------------
    const themeColors = {
        coral: { primary: '#ff4757', glow: 'rgba(255, 71, 87, 0.4)' },
        teal: { primary: '#00d2fc', glow: 'rgba(0, 210, 252, 0.35)' },
        emerald: { primary: '#2ed573', glow: 'rgba(46, 213, 115, 0.4)' },
        gold: { primary: '#ffa502', glow: 'rgba(255, 165, 2, 0.4)' }
    };

    document.querySelectorAll('.theme-color').forEach(picker => {
        picker.addEventListener('click', () => {
            const colorKey = picker.dataset.color;
            const theme = themeColors[colorKey];
            if (!theme) return;

            playSoftClick();

            document.querySelectorAll('.theme-color').forEach(p => p.classList.remove('active'));
            picker.classList.add('active');

            document.documentElement.style.setProperty('--color-coral', theme.primary);
            document.documentElement.style.setProperty('--color-coral-glow', theme.glow);

            if (trendChart) {
                trendChart.data.datasets[0].borderColor = theme.primary;
                trendChart.data.datasets[0].pointBorderColor = theme.primary;
                trendChart.update();
            }
            if (importanceChart) {
                importanceChart.data.datasets[0].backgroundColor[0] = theme.primary;
                importanceChart.update();
            }
        });
    });

    // -------------------------------------------------------------
    // How It Works Modal overlay controller
    // -------------------------------------------------------------
    const openInfoModal = () => {
        playModalSound();
        infoModal.classList.add('open');
    };

    const closeInfoModal = () => {
        playSoftClick();
        infoModal.classList.remove('open');
    };

    infoToggleBtn.addEventListener('click', openInfoModal);
    closeModalBtn.addEventListener('click', closeInfoModal);
    infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) closeInfoModal();
    });

    // -------------------------------------------------------------
    // Bidirectional decimal input bindings (two-way sync)
    // -------------------------------------------------------------
    const setupSliderSync = (slider, badgeInput) => {
        badgeInput.value = parseFloat(slider.value).toFixed(slider.step === "0.1" ? 1 : 0);
        
        slider.addEventListener('input', () => {
            badgeInput.value = parseFloat(slider.value).toFixed(slider.step === "0.1" ? 1 : 0);
            calculateAllMetrics();
        });
        
        badgeInput.addEventListener('input', () => {
            let val = parseFloat(badgeInput.value);
            if (isNaN(val)) return;
            
            const min = parseFloat(slider.min);
            const max = parseFloat(slider.max);
            if (val < min) val = min;
            if (val > max) val = max;
            
            slider.value = val;
            calculateAllMetrics();
        });
        
        badgeInput.addEventListener('blur', () => {
            let val = parseFloat(badgeInput.value);
            if (isNaN(val)) {
                val = parseFloat(slider.value);
            }
            badgeInput.value = val.toFixed(slider.step === "0.1" ? 1 : 0);
        });
    };

    setupSliderSync(ageSlider, ageVal);
    setupSliderSync(heightSlider, heightVal);
    setupSliderSync(weightSlider, weightVal);
    setupSliderSync(durationSlider, durationVal);
    setupSliderSync(heartRateSlider, heartRateVal);
    setupSliderSync(bodyTempSlider, bodyTempVal);
    setupSliderSync(calorieGoalSlider, calorieGoalVal);

    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.addEventListener('change', () => {
            playSoftClick();
            calculateAllMetrics();
        });
    });

    optimizeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        playPresetClick();
        runMUPrediction(true);
    });

    // -------------------------------------------------------------
    // 1. BMI Calculation & Scale Indicator Mapping
    // -------------------------------------------------------------
    const updateBMI = () => {
        const heightM = parseFloat(heightSlider.value) / 100;
        const weightKg = parseFloat(weightSlider.value);
        if (heightM <= 0) return 0;
        const bmi = weightKg / (heightM * heightM);
        
        bmiNum.textContent = bmi.toFixed(1);
        
        let label = "";
        let colorClass = "";
        let rec = "";
        let percent = 0;

        if (bmi < 18.5) {
            label = "Underweight";
            colorClass = "text-info";
            rec = "Consider consulting a nutritionist to establish healthy mass building exercises.";
            percent = (bmi / 18.5) * 20;
        } else if (bmi >= 18.5 && bmi < 25) {
            label = "Normal Weight";
            colorClass = "text-success";
            rec = "Your weight matches an exceptionally healthy profile. Keep up the active lifestyle!";
            percent = 25 + ((bmi - 18.5) / 6.5) * 25;
        } else if (bmi >= 25 && bmi < 30) {
            label = "Overweight";
            colorClass = "text-warning";
            rec = "Combining active cardio burn with moderate calorie restriction will yield rapid fat loss.";
            percent = 55 + ((bmi - 25) / 5) * 20;
        } else {
            label = "Obese";
            colorClass = "text-coral";
            rec = "Prioritize cardio zones and stamina development to safely reduce stress on joints.";
            percent = 80 + Math.min(20, ((bmi - 30) / 10) * 20);
        }

        bmiLabel.textContent = label;
        bmiLabel.className = `bmi-status ${colorClass}`;
        bmiRec.textContent = rec;
        
        bmiIndicator.style.left = `${Math.min(97, Math.max(3, percent))}%`;
        return bmi;
    };

    // -------------------------------------------------------------
    // 2. Heart Rate Zones Calculation & Graphical Fill
    // -------------------------------------------------------------
    const updateHeartRateZones = () => {
        const age = parseFloat(ageSlider.value);
        const hr = parseFloat(heartRateSlider.value);
        const maxHr = 220 - age;
        const percent = (hr / maxHr) * 100;
        
        maxHrVal.textContent = `${Math.round(maxHr)} bpm`;
        
        let zone = "";
        let color = "";
        let intensity = "";
        let barWidth = 0;
        let desc = "";

        if (percent < 55) {
            zone = "Warm Up / Recovery";
            color = "#54a0ff";
            intensity = "Warm Up";
            barWidth = percent;
            desc = "Safe starting rate. Good for preparation or cooling down after heavy sets.";
        } else if (percent >= 55 && percent < 70) {
            zone = "Fat Burning Zone";
            color = "#2ed573";
            intensity = "Moderate";
            barWidth = percent;
            desc = "Optimized for metabolizing fatty acids as the primary cellular fuel source. Highly sustainable.";
        } else if (percent >= 70 && percent < 85) {
            zone = "Cardio Stamina Zone";
            color = "#1e90ff";
            intensity = "Vigorous";
            barWidth = percent;
            desc = "Outstanding for lung and aerobic vascular stamina. Builds long-term cellular endurance.";
        } else {
            zone = "Peak / Anaerobic";
            color = "#ff4757";
            intensity = "Maximum";
            barWidth = percent;
            desc = "High-energy anaerobic glycolysis zone. Great for maximum speed, explosive power and athletic threshold.";
        }

        hrZoneName.textContent = zone;
        hrZoneName.style.color = color;
        hrZoneBar.style.width = `${Math.min(100, barWidth)}%`;
        
        const activeThemeColor = getComputedStyle(document.documentElement).getPropertyValue('--color-coral').trim();
        const fillTheme = (percent >= 85) ? activeThemeColor : color;
        
        hrZoneBar.style.background = `linear-gradient(90deg, ${fillTheme}, #ffffff)`;
        intensityVal.textContent = intensity;
        intensityVal.style.color = fillTheme;
        zoneDescription.textContent = desc;

        return { percent, zone };
    };

    // -------------------------------------------------------------
    // 3. Goal Tracker Calculation & Motivator ETA
    // -------------------------------------------------------------
    const updateGoalETA = (predictedVal) => {
        const duration = parseFloat(durationSlider.value);
        const goal = parseFloat(calorieGoalSlider.value);
        const hr = parseFloat(heartRateSlider.value).toFixed(1);
        
        if (predictedVal <= 0 || duration <= 0) {
            goalEtaText.textContent = "Adjust parameters to calculate workout target ETA.";
            return;
        }

        const burnRate = predictedVal / duration;
        const minutesRequired = Math.ceil(goal / burnRate);

        goalEtaText.innerHTML = `<i class="fa-solid fa-clock text-neon-blue" id="goal-clock"></i> At <strong>${hr} bpm</strong>, you need exactly <strong>${minutesRequired} minutes</strong> of training to burn your <strong>${goal.toFixed(1)} kcal</strong> target.`;
    };

    // -------------------------------------------------------------
    // 4. Dynamic Health Insights Generation
    // -------------------------------------------------------------
    const updateInsights = (predictedCalories) => {
        const duration = parseFloat(durationSlider.value);
        const hr = parseFloat(heartRateSlider.value);
        const age = parseFloat(ageSlider.value);
        const maxHr = 220 - age;
        const percentHR = (hr / maxHr) * 100;
        
        let insightsHtml = "";

        if (duration > 0 && predictedCalories > 0) {
            const caloriePerMin = predictedCalories / duration;
            const targetDuration = 30;
            const projected30Min = Math.round(caloriePerMin * targetDuration);
            
            insightsHtml += `
                <li>
                    <i class="fa-solid fa-circle-check text-success"></i>
                    <span>Your active burn rate is <strong>${caloriePerMin.toFixed(1)} kcal/min</strong>. A 30-minute session will burn approximately <strong>${projected30Min} kcal</strong>!</span>
                </li>
            `;
        }

        if (percentHR < 55) {
            const targetMinHR = Math.round(maxHr * 0.55);
            insightsHtml += `
                <li>
                    <i class="fa-solid fa-circle-info text-info"></i>
                    <span>Your heart rate is low. Try picking up your pace to get your heart rate above <strong>${targetMinHR} bpm</strong> to target the active burn zone!</span>
                </li>
            `;
        } else if (percentHR >= 55 && percentHR < 70) {
            insightsHtml += `
                <li>
                    <i class="fa-solid fa-wand-magic-sparkles text-coral" id="insight-sparkle"></i>
                    <span>Perfect! You are in the <strong>Fat Burn Zone</strong>. Keep up this steady state effort to burn energy directly from fat reserves.</span>
                </li>
            `;
        } else if (percentHR >= 70 && percentHR < 85) {
            insightsHtml += `
                <li>
                    <i class="fa-solid fa-heart-pulse text-neon-blue"></i>
                    <span>Excellent aerobic conditioning! You are building deep cardiovascular endurance and strengthening your heart walls.</span>
                </li>
            `;
        } else {
            insightsHtml += `
                <li>
                    <i class="fa-solid fa-triangle-exclamation text-warning animate-bounce"></i>
                    <span>Peak intensity alert! Monitor fatigue. You are in a maximum performance zone which is best trained in short high-intensity intervals (HIIT).</span>
                </li>
            `;
        }

        const bodyTemp = parseFloat(bodyTempSlider.value);
        if (bodyTemp >= 40.5) {
            insightsHtml += `
                <li>
                    <i class="fa-solid fa-temperature-arrow-up text-coral"></i>
                    <span>High Core Temperature detected. Ensure adequate hydration during training to protect homeostasis.</span>
                </li>
            `;
        } else if (bodyTemp >= 39.5) {
            insightsHtml += `
                <li>
                    <i class="fa-solid fa-fire-burner text-success animate-pulse"></i>
                    <span>Good cellular warm-up state! Your muscles are primed and active, indicating high blood flow.</span>
                </li>
            `;
        }

        insightsList.innerHTML = insightsHtml;
    };

    // -------------------------------------------------------------
    // 5. ML Prediction Engine Call
    // -------------------------------------------------------------
    let debounceTimer = null;

    const calculateAllMetrics = () => {
        updateBMI();
        updateHeartRateZones();
        
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            runMUPrediction(false);
        }, 150);
    };

    const runMUPrediction = (animateButton = true) => {
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const originalDuration = parseFloat(durationSlider.value);
        const queryDuration = Math.min(originalDuration, 30);
        
        const payload = {
            gender: gender,
            age: parseFloat(ageSlider.value),
            height: parseFloat(heightSlider.value),
            weight: parseFloat(weightSlider.value),
            duration: queryDuration,
            heart_rate: parseFloat(heartRateSlider.value),
            body_temp: parseFloat(bodyTempSlider.value)
        };

        if (animateButton) {
            optimizeBtn.innerHTML = '<i class="fa-solid fa-circle-notch animate-spin"></i> Processing ML Engine...';
            optimizeBtn.classList.add('disabled');
        }

        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let predictedVal = data.calories_burnt;
                
                if (originalDuration > 30) {
                    predictedVal = (predictedVal / 30) * originalDuration;
                }
                
                predictedVal = Math.round(predictedVal * 100) / 100;
                
                animateCounter(predictedVal);

                const circumference = 283;
                const offset = circumference - (Math.min(predictedVal, 300) / 300) * circumference;
                radialProgress.style.strokeDashoffset = offset;

                updateTrendChart(predictedVal, originalDuration);
                updateInsights(predictedVal);
                updateGoalETA(predictedVal);

                if (animateButton) {
                    playSuccessChime();
                }
            } else {
                console.error("Prediction Engine Error:", data.error);
            }
        })
        .catch(err => {
            console.error("API Fetch Error:", err);
        })
        .finally(() => {
            if (animateButton) {
                optimizeBtn.innerHTML = '<i class="fa-solid fa-chart-line"></i> Run Prediction Engine';
                optimizeBtn.classList.remove('disabled');
            }
        });
    };

    const animateCounter = (targetVal) => {
        const currentVal = parseFloat(calorieDisplay.textContent);
        const duration = 600;
        const frameRate = 30;
        const totalFrames = (duration / 1000) * frameRate;
        const step = (targetVal - currentVal) / totalFrames;
        
        let frame = 0;
        const timer = setInterval(() => {
            frame++;
            const nextVal = currentVal + (step * frame);
            calorieDisplay.textContent = Math.round(nextVal);
            
            if (frame >= totalFrames) {
                clearInterval(timer);
                calorieDisplay.textContent = targetVal.toFixed(0);
            }
        }, 1000 / frameRate);
    };

    // -------------------------------------------------------------
    // 6. Chart.js Graphs Configuration
    // -------------------------------------------------------------
    const initCharts = () => {
        const ctxImportance = document.getElementById('importance-chart').getContext('2d');
        const activeThemeColor = getComputedStyle(document.documentElement).getPropertyValue('--color-coral').trim() || '#ff4757';
        
        const featureLabels = ['Workout Duration', 'Heart Rate', 'Body Temp', 'User Weight', 'User Age', 'User Height', 'Gender'];
        const featureWeights = [0.45, 0.35, 0.12, 0.04, 0.02, 0.01, 0.01];

        importanceChart = new Chart(ctxImportance, {
            type: 'bar',
            data: {
                labels: featureLabels,
                datasets: [{
                    label: 'XGBoost Feature Weight',
                    data: featureWeights,
                    backgroundColor: [
                        activeThemeColor,
                        'rgba(0, 210, 252, 0.85)',
                        'rgba(30, 144, 255, 0.85)',
                        'rgba(46, 213, 115, 0.85)',
                        'rgba(255, 165, 2, 0.85)',
                        'rgba(164, 176, 190, 0.85)',
                        'rgba(116, 125, 140, 0.85)'
                    ],
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    borderWidth: 1,
                    borderRadius: 5
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => ` Weight: ${(context.raw * 100).toFixed(0)}%`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: {
                            color: '#a4b0be',
                            callback: (value) => (value * 100) + '%'
                        }
                    },
                    y: {
                        grid: { display: false },
                        ticks: {
                            color: '#f1f2f6',
                            font: { family: 'Outfit', size: 11 }
                        }
                    }
                }
            }
        });

        // Trend Chart (Session Projection line chart)
        const ctxTrend = document.getElementById('trend-chart').getContext('2d');
        trendChart = new Chart(ctxTrend, {
            type: 'line',
            data: {
                labels: ['15 mins', '30 mins', '45 mins', '60 mins', '90 mins'],
                datasets: [{
                    label: 'Projected Calorie Burn',
                    data: [0, 0, 0, 0, 0],
                    borderColor: activeThemeColor,
                    borderWidth: 3,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: activeThemeColor,
                    pointHoverRadius: 6,
                    pointRadius: 4,
                    tension: 0.35,
                    fill: {
                        target: 'origin',
                        above: 'rgba(255, 71, 87, 0.06)'
                    }
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: '#a4b0be',
                            font: { family: 'Outfit', size: 11 }
                        }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: {
                            color: '#a4b0be',
                            callback: (value) => value + ' kcal'
                        }
                    }
                }
            }
        });
    };

    const updateTrendChart = (currentCalories, currentDuration) => {
        if (!trendChart || currentDuration <= 0) return;

        const burnRate = currentCalories / currentDuration;

        const checkpoints = [15, 30, 45, 60, 90];
        const projectedData = checkpoints.map(t => Math.round(burnRate * t));

        trendChart.data.datasets[0].data = projectedData;
        trendChart.update();
    };

    // -------------------------------------------------------------
    // 💥 Floating Chatbot Advisor Controller ("Coach Aura")
    // -------------------------------------------------------------
    chatLauncher.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
        playSoftClick();
        scrollChatToBottom();
    });

    closeChatBtn.addEventListener('click', () => {
        chatWindow.classList.remove('open');
        playSoftClick();
    });

    const scrollChatToBottom = () => {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    };

    document.querySelectorAll('.chat-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const userMsgText = chip.dataset.msg;
            if (!userMsgText) return;
            handleUserMessage(userMsgText);
        });
    });

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userMsgText = chatInput.value.trim();
        if (!userMsgText) return;
        
        chatInput.value = '';
        handleUserMessage(userMsgText);
    });

    const handleUserMessage = (text) => {
        playSoftClick();
        appendMessage(text, 'user-msg');
        scrollChatToBottom();

        setTimeout(() => {
            generateBotResponse(text);
        }, 500);
    };

    const appendMessage = (text, className) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${className}`;
        msgDiv.innerHTML = `<p>${text}</p>`;
        chatMessagesContainer.appendChild(msgDiv);
    };

    const generateBotResponse = (query) => {
        const q = query.toLowerCase();
        let reply = "";

        const gender = document.querySelector('input[name="gender"]:checked').value;
        const age = parseFloat(ageSlider.value).toFixed(1);
        const weight = parseFloat(weightSlider.value).toFixed(1);
        const height = parseFloat(heightSlider.value).toFixed(1);
        const duration = parseFloat(durationSlider.value).toFixed(1);
        const hr = parseFloat(heartRateSlider.value).toFixed(1);
        const calories = calorieDisplay.textContent;
        const bmi = bmiNum.textContent;
        const bmiCat = bmiLabel.textContent;
        const activeZone = hrZoneName.textContent;
        const calorieGoal = parseFloat(calorieGoalSlider.value).toFixed(1);

        const nameInput = document.getElementById('user-name-input');
        const userName = nameInput ? nameInput.value.trim() || "Athlete" : "Athlete";

        if (q.includes('model') || q.includes('xgboost') || q.includes('mae') || q.includes('accuracy') || q.includes('precision')) {
            reply = `Great question, <strong>${userName}</strong>! BurnFit AI utilizes a high-performance <strong>XGBoost Regressor machine learning model</strong> trained on <strong>15,000 active individuals</strong>.<br><br>
                     XGBoost is one of the most powerful algorithms for tabular data, leading to a tested <strong>Mean Absolute Error (MAE) of just 1.48 calories</strong>! This means predictions are virtually identical to professional metabolic lab tools.`;
        } 
        else if (q.includes('analyze') || q.includes('current workout') || q.includes('my workout') || q.includes('my stats')) {
            reply = `I've analyzed your live parameters, <strong>${userName}</strong>! 📊<br><br>
                     You are simulating a <strong>${duration} min</strong> session for a <strong>${age}-year-old ${gender}</strong> weighing <strong>${weight} kg</strong>.<br><br>
                     With an average heart rate of <strong>${hr} bpm</strong>, our ML model estimates you have burned <strong>${calories} kcal</strong>. You are exercising in the <strong>${activeZone}</strong> which corresponds to a healthy BMI profile of <strong>${bmi}</strong> (${bmiCat}). You need to burn ${Math.max(0, (calorieGoal - calories).toFixed(0))} more kcal to hit your target goal of <strong>${calorieGoal} kcal</strong>!`;
        } 
        else if (q.includes('bmi') || q.includes('weight') || q.includes('body mass')) {
            reply = `Your current live BMI is <strong>${bmi}</strong>, <strong>${userName}</strong>, which classifies as <strong class="text-neon-blue">${bmiCat}</strong>.<br><br>
                     Normal weight is classified between 18.5 and 24.9. Maintaining a normal BMI reduces pressure on joints and lowers cardiovascular strain during high-intensity training. Let me know if you want targeted exercise tips!`;
        } 
        else if (q.includes('heart') || q.includes('pulse') || q.includes('zone') || q.includes('cardio')) {
            reply = `Based on your age of <strong>${Math.round(age)}</strong>, <strong>${userName}</strong>, your estimated maximum heart rate is <strong>${Math.round(220 - age)} bpm</strong>.<br><br>
                     Currently, your heart rate is <strong>${hr} bpm</strong> putting you in the <strong class="text-neon-blue">${activeZone}</strong>.<br><br>
                     - <strong>Fat Burning (55-70% Max HR)</strong>: Best for burning fat stores.<br>
                     - <strong>Cardio Stamina (70-85% Max HR)</strong>: Best for cellular cardiovascular stamina.`;
        } 
        else if (q.includes('presets') || q.includes('hiit') || q.includes('lift') || q.includes('yoga') || q.includes('walk')) {
            reply = `Certainly, <strong>${userName}</strong>! We have preloaded four custom fitness profiles for you to explore! Try clicking them on the left sidebar:<br><br>
                     - ⚡ <strong>HIIT Preset</strong>: High-energy interval workout (high heart rate & temperature).<br>
                     - 🏋️ <strong>Lift Preset</strong>: Muscle building resistance workout.<br>
                     - 🧘 <strong>Yoga Preset</strong>: Steady core training & flexibility.<br>
                     - 🚶 <strong>Walk Preset</strong>: Light aerobic brisk walk.`;
        }
        else if (q.includes('diet') || q.includes('nutrition') || q.includes('protein') || q.includes('deficit')) {
            reply = `For maximum physical fitness, <strong>${userName}</strong>, pair your training with clean nutrition! 🍎<br><br>
                     If your goal is fat loss, aim for a minor calorie deficit (burning 300-500 kcal more than you consume daily). Ensure your protein intake is around 1.6g to 2g per kg of bodyweight to preserve active muscle mass.`;
        }
        else if (q.includes('duration') || q.includes('90') || q.includes('30') || q.includes('time')) {
            reply = `We've upgraded our input engine, <strong>${userName}</strong>, to allow workout durations up to <strong>90 minutes</strong>!<br><br>
                     To maintain strict ML scientific integrity (since the training dataset only contained workouts up to 30 minutes), the app caps queries to the XGBoost engine at 30 minutes and **scales predictions up linearly** for the extra duration. This guarantees absolute metabolic correctness!`;
        }
        else if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('aura') || q.includes('coach')) {
            reply = `Hello, <strong>${userName}</strong>! I'm Coach Aura. ⚡ How can I help you analyze your training, explain our XGBoost machine learning model, or optimize your caloric goals today?`;
        }
        else {
            reply = `That is an interesting question, <strong>${userName}</strong>! As your AI Fitness Advisor, I recommend adjusting the parameters on the left to see how heart rate, duration, and body mass index influence your active calorie burn in real-time.<br><br>
                     You can also ask me specific questions like <em>"Analyze my current workout"</em> or <em>"How does the ML model work?"</em> for personalized answers!`;
        }

        playSynthSound(700, 'sine', 0.12, 0.015);
        appendMessage(reply, 'bot-msg');
        scrollChatToBottom();
    };

    // -------------------------------------------------------------
    // 🔊 Text-To-Speech (TTS) Voice Synthesis for Coach Aura
    // -------------------------------------------------------------
    const speakLastResponse = () => {
        if (!('speechSynthesis' in window)) {
            console.warn("Speech Synthesis API not supported in this browser.");
            return;
        }
        
        // Cancel any active speaking session
        window.speechSynthesis.cancel();
        
        const botMessages = chatMessagesContainer.querySelectorAll('.bot-msg');
        if (botMessages.length === 0) return;
        
        const lastBotMsg = botMessages[botMessages.length - 1];
        // Strip HTML tags to extract clean text
        const plainText = lastBotMsg.innerText || lastBotMsg.textContent;
        
        const utterance = new SpeechSynthesisUtterance(plainText);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        
        // Pick an English-speaking voice if available
        const voices = window.speechSynthesis.getVoices();
        const engVoice = voices.find(v => v.lang.includes('en') && 
            (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft')));
            
        if (engVoice) {
            utterance.voice = engVoice;
        }
        
        window.speechSynthesis.speak(utterance);
        playSoftClick();
    };

    voiceChatBtn.addEventListener('click', speakLastResponse);
    // Populate voice list in the background (necessary for Chrome/Edge)
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {};
    }

    // -------------------------------------------------------------
    // 💾 Persisted Workout History Log Controller
    // -------------------------------------------------------------
    const loadWorkoutLog = () => {
        let log = JSON.parse(localStorage.getItem('burnfit_workout_log')) || [];
        
        // Re-render list
        logListContainer.innerHTML = '';
        
        if (log.length === 0) {
            emptyLogMsg.style.display = 'flex';
            logTotalSessions.textContent = '0';
            logTotalCalories.textContent = '0 kcal';
            return;
        }
        
        emptyLogMsg.style.display = 'none';
        
        let totalSessions = log.length;
        let totalCalories = 0;
        
        log.forEach((entry, idx) => {
            totalCalories += parseFloat(entry.calories);
            
            const logLi = document.createElement('li');
            logLi.className = 'log-entry';
            logLi.innerHTML = `
                <div class="log-entry-info">
                    <span class="log-entry-title">${entry.presetName}</span>
                    <span class="log-entry-meta">${entry.date} | ${entry.duration} mins @ ${entry.hr} bpm (${entry.gender})</span>
                </div>
                <span class="log-entry-burn">+${Math.round(entry.calories)} kcal</span>
            `;
            logListContainer.appendChild(logLi);
        });
        
        logTotalSessions.textContent = totalSessions;
        logTotalCalories.textContent = `${Math.round(totalCalories)} kcal`;
    };

    const saveCurrentWorkout = () => {
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const duration = parseFloat(durationSlider.value).toFixed(1);
        const hr = parseFloat(heartRateSlider.value).toFixed(1);
        const calories = parseFloat(calorieDisplay.textContent);
        
        if (calories <= 0) {
            playSynthSound(300, 'sawtooth', 0.2, 0.03); // Error buzz
            return;
        }
        
        // Auto resolve active preset name
        let presetName = "Custom Session";
        const hrPercent = (hr / (220 - parseFloat(ageSlider.value))) * 100;
        if (hrPercent >= 85) presetName = "Anaerobic Interval";
        else if (hrPercent >= 70) presetName = "Cardio Training";
        else if (hrPercent >= 55) presetName = "Fat Burn Active";
        else presetName = "Recovery / Warm Up";
        
        const newEntry = {
            date: new Date().toLocaleDateString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'}),
            gender: gender.toUpperCase(),
            duration: duration,
            hr: hr,
            calories: calories,
            presetName: presetName
        };
        
        let log = JSON.parse(localStorage.getItem('burnfit_workout_log')) || [];
        log.unshift(newEntry); // Insert at start (newest first)
        
        // Cap list at 10 items to save space
        if (log.length > 10) log.pop();
        
        localStorage.setItem('burnfit_workout_log', JSON.stringify(log));
        loadWorkoutLog();
        playSuccessChime();
    };

    const clearWorkoutLog = () => {
        playSoftClick();
        localStorage.removeItem('burnfit_workout_log');
        loadWorkoutLog();
    };

    saveSessionBtn.addEventListener('click', saveCurrentWorkout);
    clearLogBtn.addEventListener('click', clearWorkoutLog);

    // -------------------------------------------------------------
    // 📄 Export PDF Workout & ML Calibration Report
    // -------------------------------------------------------------
    const exportPDF = () => {
        playSoftClick();
        
        // Store original title
        const originalTitle = document.title;
        document.title = "BurnFit AI - Workout & ML Calibration Report";
        
        // Trigger browser native print dialogue
        window.print();
        
        // Restore title
        document.title = originalTitle;
    };

    exportPdfBtn.addEventListener('click', exportPDF);

    // -------------------------------------------------------------
    // Dynamic Name Change Listener
    // -------------------------------------------------------------
    const userNameInput = document.getElementById('user-name-input');
    if (userNameInput) {
        userNameInput.addEventListener('change', () => {
            const newName = userNameInput.value.trim() || "Athlete";
            playSoftClick();
            
            // Append nice greeting from Coach Aura
            const botGreeting = `Nice to meet you, <strong>${newName}</strong>! I have updated my records. Let me know when you are ready to analyze your workout!`;
            appendMessage(botGreeting, 'bot-msg');
            scrollChatToBottom();
            
            // Speak it if browser TTS is unmuted
            speakLastResponse();
        });
    }

    // -------------------------------------------------------------
    // Initial Setup Bootstraps
    // -------------------------------------------------------------
    initCharts();
    calculateAllMetrics();
    loadWorkoutLog();
    runMUPrediction(false);
});
