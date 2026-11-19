/* ===========================
   MICROBLOOM - HABIT TRACKER
   Main Application Logic
   =========================== */

// ===========================
// DATA MANAGEMENT & STORAGE
// ===========================

class HabitTracker {
    constructor() {
        this.habits = [
            {
                id: 'water',
                name: 'Drink Water',
                icon: '💧',
                type: 'quantity',
                unit: 'ml',
                daily_target: 2000,
                increment_options: [250, 500]
            },
            {
                id: 'movement',
                name: 'Keep Moving',
                icon: '🚶',
                type: 'quantity',
                unit: 'minutes',
                daily_target: 20,
                weekly_target: 5,
                increment_options: [5, 10]
            },
            {
                id: 'meditation',
                name: 'Meditate Daily',
                icon: '🧘',
                type: 'timer',
                unit: 'seconds',
                daily_target: 420 // 7 minutes in seconds
            },
            {
                id: 'sleep',
                name: 'Sleep Better',
                icon: '😴',
                type: 'quantity',
                unit: 'hours',
                daily_target: 7
            },
            {
                id: 'early_dinner',
                name: 'Eat Earlier',
                icon: '🍽️',
                type: 'time_checkpoint',
                default_time: '19:00'
            },
            {
                id: 'mindful_eating',
                name: 'Mindful Eating',
                icon: '🥗',
                type: 'checkbox'
            }
        ];

        this.storage_prefix = 'microbloom_';
        this.loadData();
        this.updateMotivationalGreeting();
    }

    // Load all data from localStorage
    loadData() {
        const savedData = localStorage.getItem(this.storage_prefix + 'data');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.selectedHabits = data.selectedHabits || [];
            this.dailyProgress = data.dailyProgress || {};
            this.historyLog = data.historyLog || {};
            this.achievements = data.achievements || [];
            this.preferences = data.preferences || {};
        } else {
            this.selectedHabits = [];
            this.dailyProgress = {};
            this.historyLog = {};
            this.achievements = [];
            this.preferences = {
                dinner_time: '19:00'
            };
        }
        this.initializeTodayData();
    }

    // Initialize today's progress data
    initializeTodayData() {
        const today = this.getTodayKey();
        if (!this.dailyProgress[today]) {
            this.dailyProgress[today] = {};
            for (const habitId of this.selectedHabits) {
                this.dailyProgress[today][habitId] = this.getDefaultProgress(habitId);
            }
        }
    }

    // Get default progress object for a habit
    getDefaultProgress(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return {};

        switch (habit.type) {
            case 'quantity':
                return { current: 0, completed: false };
            case 'timer':
                return { elapsed_seconds: 0, completed: false };
            case 'time_checkpoint':
                return { completed: false };
            case 'checkbox':
                return { completed: false };
            default:
                return {};
        }
    }

    // Get today's date key (YYYY-MM-DD)
    getTodayKey() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    // Get date key for a specific date
    getDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    // Save all data to localStorage
    saveData() {
        const data = {
            selectedHabits: this.selectedHabits,
            dailyProgress: this.dailyProgress,
            historyLog: this.historyLog,
            achievements: this.achievements,
            preferences: this.preferences
        };
        localStorage.setItem(this.storage_prefix + 'data', JSON.stringify(data));
    }

    // Reset all data
    resetAllData() {
        localStorage.removeItem(this.storage_prefix + 'data');
        this.selectedHabits = [];
        this.dailyProgress = {};
        this.historyLog = {};
        this.achievements = [];
        this.preferences = { dinner_time: '19:00' };
    }

    // Reset today's progress
    resetTodayProgress() {
        const today = this.getTodayKey();
        if (this.dailyProgress[today]) {
            for (const habitId of this.selectedHabits) {
                this.dailyProgress[today][habitId] = this.getDefaultProgress(habitId);
            }
            this.saveData();
        }
    }

    // Update motivational greeting
    updateMotivationalGreeting() {
        const hour = new Date().getHours();
        let greeting = 'Good morning! Let\'s build some habits.';

        if (hour >= 12 && hour < 18) {
            greeting = 'Afternoon! Keep up the momentum.';
        } else if (hour >= 18) {
            greeting = 'Evening! Finish strong today.';
        }

        return greeting;
    }
}

const tracker = new HabitTracker();

// ===========================
// SCREEN NAVIGATION
// ===========================

function showScreen(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show specific screen
    const screen = document.getElementById(screenName + 'Screen');
    if (screen) {
        screen.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// ===========================
// WELCOME SCREEN
// ===========================

document.getElementById('startButton').addEventListener('click', () => {
    renderHabitSelection();
    showScreen('habitSelection');
});

// ===========================
// HABIT SELECTION SCREEN
// ===========================

function renderHabitSelection() {
    const habitsGrid = document.getElementById('habitsGrid');
    habitsGrid.innerHTML = '';

    tracker.habits.forEach(habit => {
        const isSelected = tracker.selectedHabits.includes(habit.id);
        const card = document.createElement('div');
        card.className = `habit-option ${isSelected ? 'selected' : ''}`;
        
        // Build content safely using DOM methods
        const icon = document.createElement('span');
        icon.className = 'habit-icon';
        icon.textContent = habit.icon;
        card.appendChild(icon);
        
        const name = document.createElement('h3');
        name.textContent = habit.name;
        card.appendChild(name);
        
        const description = document.createElement('p');
        description.textContent = 
            habit.name === 'Drink Water' ? '2 liters daily' :
            habit.name === 'Keep Moving' ? '20 minutes, 5 days per week' :
            habit.name === 'Meditate Daily' ? '7 minutes daily' :
            habit.name === 'Sleep Better' ? '7 hours daily' :
            habit.name === 'Eat Earlier' ? 'Before chosen time' :
            'One mindful meal daily';
        card.appendChild(description);

        card.addEventListener('click', () => {
            if (isSelected) {
                tracker.selectedHabits = tracker.selectedHabits.filter(id => id !== habit.id);
            } else {
                tracker.selectedHabits.push(habit.id);
            }
            updateHabitSelectionUI();
        });

        habitsGrid.appendChild(card);
    });

    updateHabitSelectionUI();
}

function updateHabitSelectionUI() {
    // Update selected count
    document.getElementById('selectedCount').textContent = tracker.selectedHabits.length;

    // Enable/disable start button
    const startButton = document.getElementById('startTrackingButton');
    const errorMessage = document.getElementById('selectionError');
    startButton.disabled = tracker.selectedHabits.length === 0;

    if (tracker.selectedHabits.length === 0) {
        errorMessage.style.display = 'none';
    }

    // Update visual selection
    document.querySelectorAll('.habit-option').forEach(card => {
        card.classList.remove('selected');
    });

    tracker.habits.forEach((habit, index) => {
        if (tracker.selectedHabits.includes(habit.id)) {
            document.querySelectorAll('.habit-option')[index].classList.add('selected');
        }
    });
}

document.getElementById('startTrackingButton').addEventListener('click', () => {
    if (tracker.selectedHabits.length > 0) {
        tracker.initializeTodayData();
        tracker.saveData();
        renderDashboard();
        showScreen('dashboard');
    } else {
        document.getElementById('selectionError').style.display = 'block';
    }
});

// ===========================
// DASHBOARD SCREEN
// ===========================

function renderDashboard() {
    updateDashboardHeader();
    updateSummarySection();
    renderHabitCards();
    updateWeeklyOverview();
    renderAchievements();
    checkCelebration();
}

function updateDashboardHeader() {
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });
    document.getElementById('currentDate').textContent = dateFormatter.format(new Date());
    document.getElementById('motivationalGreeting').textContent = tracker.updateMotivationalGreeting();
}

function updateSummarySection() {
    const today = tracker.getTodayKey();
    const todayData = tracker.dailyProgress[today] || {};

    // Calculate completion percentage
    let completedCount = 0;
    let totalCount = tracker.selectedHabits.length;

    tracker.selectedHabits.forEach(habitId => {
        const progress = todayData[habitId];
        if (progress && progress.completed) {
            completedCount++;
        }
    });

    const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    document.getElementById('completionPercentage').textContent = completionPercentage + '%';
    document.getElementById('completedCount').textContent = completedCount + '/' + totalCount;

    // Update progress bar
    document.getElementById('summaryProgress').style.width = completionPercentage + '%';

    // Calculate and display current streak
    const streak = calculateStreak();
    document.getElementById('streakCount').textContent = streak + ' ';

    // Calculate weekly consistency
    const weeklyConsistency = calculateWeeklyConsistency();
    document.getElementById('weeklyConsistency').textContent = weeklyConsistency + '%';
}

function calculateStreak() {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateKey = tracker.getDateKey(checkDate);

        // Don't count future incomplete days
        if (checkDate > today) continue;

        const dayData = tracker.dailyProgress[dateKey];
        if (!dayData) break;

        // Check if all selected habits were completed
        let allCompleted = true;
        for (const habitId of tracker.selectedHabits) {
            if (!dayData[habitId] || !dayData[habitId].completed) {
                allCompleted = false;
                break;
            }
        }

        if (allCompleted || i === 0) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

function calculateWeeklyConsistency() {
    let completedDays = 0;
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateKey = tracker.getDateKey(checkDate);

        const dayData = tracker.dailyProgress[dateKey];
        if (!dayData) continue;

        let allCompleted = true;
        for (const habitId of tracker.selectedHabits) {
            if (!dayData[habitId] || !dayData[habitId].completed) {
                allCompleted = false;
                break;
            }
        }

        if (allCompleted) {
            completedDays++;
        }
    }

    return completedDays > 0 ? Math.round((completedDays / 7) * 100) : 0;
}

function checkCelebration() {
    const today = tracker.getTodayKey();
    const todayData = tracker.dailyProgress[today] || {};

    let allCompleted = tracker.selectedHabits.every(habitId => {
        return todayData[habitId] && todayData[habitId].completed;
    });

    const celebrationContainer = document.getElementById('celebrationAnimation');
    if (allCompleted && tracker.selectedHabits.length > 0) {
        celebrationContainer.style.display = 'block';
    } else {
        celebrationContainer.style.display = 'none';
    }
}

function renderHabitCards() {
    const habitsSection = document.getElementById('habitsSection');
    habitsSection.innerHTML = '';

    if (tracker.selectedHabits.length === 0) {
        habitsSection.innerHTML = '<p class="empty-message">No habits selected. Go back to select habits.</p>';
        return;
    }

    const container = document.createElement('div');
    container.className = 'habits-container';

    tracker.selectedHabits.forEach(habitId => {
        const habit = tracker.habits.find(h => h.id === habitId);
        if (habit) {
            const card = createHabitCard(habit);
            container.appendChild(card);
        }
    });

    habitsSection.appendChild(container);
}

function createHabitCard(habit) {
    const card = document.createElement('div');
    card.className = 'habit-card';

    const today = tracker.getTodayKey();
    const progress = tracker.dailyProgress[today]?.[habit.id] || tracker.getDefaultProgress(habit.id);

    // Create header
    const header = document.createElement('div');
    header.className = 'habit-card-header';
    
    const icon = document.createElement('span');
    icon.className = 'habit-card-icon';
    icon.textContent = habit.icon;
    header.appendChild(icon);
    
    const title = document.createElement('h4');
    title.className = 'habit-card-title';
    title.textContent = habit.name;
    header.appendChild(title);
    
    card.appendChild(header);

    // Target display
    const targetText = getHabitTargetText(habit);
    if (targetText) {
        const targetDiv = document.createElement('div');
        targetDiv.className = 'habit-target';
        targetDiv.textContent = targetText;
        card.appendChild(targetDiv);
    }

    // Create habit-specific controls
    if (habit.type === 'quantity') {
        addQuantityControls(card, habit, progress);
    } else if (habit.type === 'timer') {
        addTimerControls(card, habit, progress);
    } else if (habit.type === 'time_checkpoint') {
        addTimeCheckpointControls(card, habit, progress);
    } else if (habit.type === 'checkbox') {
        addCheckboxControls(card, habit, progress);
    }

    // Add event listeners
    card.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleHabitControl(e, habit, progress));
    });

    return card;
}

function getHabitTargetText(habit) {
    switch (habit.id) {
        case 'water':
            return 'Target: 2 liters (2000ml) daily';
        case 'movement':
            return 'Target: 20 minutes daily, 5 days per week';
        case 'meditation':
            return 'Target: 7 minutes daily';
        case 'sleep':
            return 'Target: 7 hours daily';
        case 'early_dinner':
            return 'Target: Finish dinner before ' + (tracker.preferences.dinner_time || '19:00');
        case 'mindful_eating':
            return 'Target: One mindful meal daily';
        default:
            return '';
    }
}

function addQuantityControls(card, habit, progress) {
    const percentage = Math.min(100, Math.round((progress.current / habit.daily_target) * 100));
    const isCompleted = progress.completed;
    const incrementOptions = habit.increment_options || [1];

    const progressDiv = document.createElement('div');
    progressDiv.className = 'habit-progress';
    
    const label = document.createElement('div');
    label.className = 'progress-label';
    
    const labelText = document.createElement('span');
    labelText.textContent = 'Progress';
    label.appendChild(labelText);
    
    const current = document.createElement('span');
    current.className = 'progress-current';
    current.textContent = `${progress.current}/${habit.daily_target}${habit.unit ? ' ' + habit.unit : ''}`;
    label.appendChild(current);
    
    progressDiv.appendChild(label);
    
    const bar = document.createElement('div');
    bar.className = 'progress-bar';
    
    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.width = `${percentage}%`;
    if (isCompleted) fill.style.opacity = '0.6';
    
    bar.appendChild(fill);
    progressDiv.appendChild(bar);
    card.appendChild(progressDiv);
    
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'habit-controls';
    
    incrementOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'control-btn';
        btn.setAttribute('data-action', 'add');
        btn.setAttribute('data-value', opt);
        btn.textContent = `+${opt}`;
        controlsDiv.appendChild(btn);
    });
    
    const undoBtn = document.createElement('button');
    undoBtn.className = 'control-btn undo';
    undoBtn.setAttribute('data-action', 'undo');
    undoBtn.textContent = '↶';
    controlsDiv.appendChild(undoBtn);
    
    card.appendChild(controlsDiv);
}

function addTimerControls(card, habit, progress) {
    const minutes = Math.floor(progress.elapsed_seconds / 60);
    const seconds = progress.elapsed_seconds % 60;
    
    const displayDiv = document.createElement('div');
    displayDiv.className = 'meditation-timer-display';
    if (progress.completed) displayDiv.style.opacity = '0.6';
    displayDiv.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    card.appendChild(displayDiv);
    
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'habit-controls meditation-controls';
    
    const btn = document.createElement('button');
    btn.className = 'control-btn';
    btn.setAttribute('data-action', 'timer');
    btn.textContent = 'Start Meditation';
    controlsDiv.appendChild(btn);
    
    card.appendChild(controlsDiv);
}

function addTimeCheckpointControls(card, habit, progress) {
    const dinnerTime = tracker.preferences.dinner_time || '19:00';
    const isCompleted = progress.completed;
    
    const container = document.createElement('div');
    container.style.marginTop = '15px';
    
    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'habit-completion-checkbox';
    checkboxDiv.style.cursor = 'auto';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `dinner-${tracker.getTodayKey()}`;
    if (isCompleted) checkbox.checked = true;
    checkboxDiv.appendChild(checkbox);
    
    const label = document.createElement('label');
    label.htmlFor = `dinner-${tracker.getTodayKey()}`;
    label.textContent = `Finished dinner by ${dinnerTime}`;
    checkboxDiv.appendChild(label);
    
    container.appendChild(checkboxDiv);
    
    const btn = document.createElement('button');
    btn.className = 'control-btn';
    btn.setAttribute('data-action', 'toggle');
    btn.style.width = '100%';
    btn.style.marginTop = '10px';
    btn.textContent = isCompleted ? '✓ Completed' : 'Mark as Complete';
    container.appendChild(btn);
    
    card.appendChild(container);
}

function addCheckboxControls(card, habit, progress) {
    const isCompleted = progress.completed;
    
    const container = document.createElement('div');
    container.style.marginTop = '15px';
    
    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'habit-completion-checkbox';
    checkboxDiv.style.cursor = 'auto';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `mindful-${tracker.getTodayKey()}`;
    if (isCompleted) checkbox.checked = true;
    checkboxDiv.appendChild(checkbox);
    
    const label = document.createElement('label');
    label.htmlFor = `mindful-${tracker.getTodayKey()}`;
    label.textContent = 'Completed';
    checkboxDiv.appendChild(label);
    
    container.appendChild(checkboxDiv);
    
    const btn = document.createElement('button');
    btn.className = 'control-btn';
    btn.setAttribute('data-action', 'toggle');
    btn.style.width = '100%';
    btn.style.marginTop = '10px';
    btn.textContent = isCompleted ? '✓ Completed' : 'Mark as Complete';
    container.appendChild(btn);
    
    card.appendChild(container);
}

function handleHabitControl(e, habit, progress) {
    const action = e.target.dataset.action;
    const today = tracker.getTodayKey();
    let todayData = tracker.dailyProgress[today];

    // Ensure today's data exists
    if (!todayData) {
        tracker.dailyProgress[today] = {};
        todayData = tracker.dailyProgress[today];
    }

    // Ensure habit data exists
    if (!todayData[habit.id]) {
        todayData[habit.id] = tracker.getDefaultProgress(habit.id);
    }

    if (action === 'add') {
        const value = parseInt(e.target.dataset.value);
        const current = (todayData[habit.id].current || 0) + value;
        
        // For water, cap at 5 liters (5000ml) maximum
        const maxLimit = habit.id === 'water' ? 5000 : current;
        todayData[habit.id].current = Math.min(current, maxLimit);
        todayData[habit.id].completed = todayData[habit.id].current >= habit.daily_target;
    } else if (action === 'undo') {
        todayData[habit.id].current = Math.max(0, (todayData[habit.id].current || 0) - (habit.increment_options?.[habit.increment_options.length - 1] || 1));
        todayData[habit.id].completed = false;
    } else if (action === 'timer') {
        openMeditationTimer(habit);
        return;
    } else if (action === 'toggle') {
        todayData[habit.id].completed = !todayData[habit.id].completed;
    }

    tracker.saveData();
    renderDashboard();
}

function updateWeeklyOverview() {
    const weeklyGrid = document.getElementById('weeklyGrid');
    weeklyGrid.innerHTML = '';

    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = tracker.getDateKey(date);

        const dayData = tracker.dailyProgress[dateKey];
        let completedCount = 0;
        let totalCount = tracker.selectedHabits.length;

        if (dayData) {
            tracker.selectedHabits.forEach(habitId => {
                if (dayData[habitId]?.completed) {
                    completedCount++;
                }
            });
        }

        const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        const isCompleted = percentage === 100 && totalCount > 0 && dayData;

        const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        const dayElement = document.createElement('div');
        dayElement.className = `weekly-day ${isCompleted ? 'completed' : ''}`;
        dayElement.innerHTML = `
            <div class="weekly-day-label">${dayLabel}</div>
            <div class="weekly-day-percentage">${percentage}%</div>
        `;

        weeklyGrid.appendChild(dayElement);
    }
}

function renderAchievements() {
    const achievementsContainer = document.getElementById('achievementsContainer');
    achievementsContainer.innerHTML = '';

    const achievements = [
        {
            id: 'first_step',
            emoji: '🌱',
            name: 'First Step',
            condition: () => {
                const today = tracker.getTodayKey();
                const todayData = tracker.dailyProgress[today];
                return todayData && tracker.selectedHabits.some(habitId => todayData[habitId]?.completed);
            }
        },
        {
            id: 'consistency_builder',
            emoji: '🔥',
            name: 'Consistency Builder',
            condition: () => calculateStreak() >= 3
        },
        {
            id: 'one_week_strong',
            emoji: '🏆',
            name: 'One Week Strong',
            condition: () => calculateStreak() >= 7
        },
        {
            id: 'hydration_hero',
            emoji: '💧',
            name: 'Hydration Hero',
            condition: () => {
                if (!tracker.selectedHabits.includes('water')) return false;
                const today = tracker.getTodayKey();
                const todayData = tracker.dailyProgress[today];
                return todayData?.water?.completed;
            }
        }
    ];

    achievements.forEach(achievement => {
        const isEarned = achievement.condition();
        const isAlreadyEarned = tracker.achievements.includes(achievement.id);

        if (isEarned && !isAlreadyEarned) {
            tracker.achievements.push(achievement.id);
            tracker.saveData();
        }

        const element = document.createElement('div');
        element.className = `achievement ${isEarned ? 'earned' : ''}`;
        element.innerHTML = `
            <span class="achievement-emoji">${achievement.emoji}</span>
            <div class="achievement-name">${achievement.name}</div>
        `;

        achievementsContainer.appendChild(element);
    });
}

// ===========================
// MEDITATION TIMER
// ===========================

let meditationTimer = null;
let meditationTotalSeconds = 0;

function openMeditationTimer(habit) {
    document.getElementById('timerModal').style.display = 'flex';
    meditationTotalSeconds = 0;
    updateTimerDisplay();

    document.getElementById('timerStartButton').onclick = startMeditationTimer;
    document.getElementById('timerPauseButton').onclick = pauseMeditationTimer;
    document.getElementById('timerResetButton').onclick = resetMeditationTimer;
    document.getElementById('timerCompleteButton').onclick = completeMeditationTimer;
    document.getElementById('closeTimerButton').onclick = closeMeditationTimer;
}

function startMeditationTimer() {
    if (meditationTimer) return;

    document.getElementById('timerStartButton').style.display = 'none';
    document.getElementById('timerPauseButton').style.display = 'inline-block';

    meditationTimer = setInterval(() => {
        meditationTotalSeconds++;
        updateTimerDisplay();

        if (meditationTotalSeconds >= 420) { // 7 minutes
            pauseMeditationTimer();
            document.getElementById('timerCompleteButton').style.display = 'block';
        }
    }, 1000);
}

function pauseMeditationTimer() {
    if (meditationTimer) {
        clearInterval(meditationTimer);
        meditationTimer = null;
    }
    document.getElementById('timerStartButton').style.display = 'inline-block';
    document.getElementById('timerPauseButton').style.display = 'none';
}

function resetMeditationTimer() {
    pauseMeditationTimer();
    meditationTotalSeconds = 0;
    updateTimerDisplay();
    document.getElementById('timerCompleteButton').style.display = 'none';
    document.getElementById('timerStartButton').style.display = 'inline-block';
}

function completeMeditationTimer() {
    const today = tracker.getTodayKey();
    tracker.dailyProgress[today]['meditation'].elapsed_seconds = meditationTotalSeconds;
    tracker.dailyProgress[today]['meditation'].completed = true;
    tracker.saveData();

    closeMeditationTimer();
    renderDashboard();
}

function closeMeditationTimer() {
    pauseMeditationTimer();
    document.getElementById('timerModal').style.display = 'none';
    meditationTotalSeconds = 0;
}

function updateTimerDisplay() {
    const minutes = Math.floor(meditationTotalSeconds / 60);
    const seconds = meditationTotalSeconds % 60;
    document.getElementById('timerDisplay').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ===========================
// SETTINGS MODAL
// ===========================

document.getElementById('settingsButton').addEventListener('click', () => {
    document.getElementById('settingsModal').style.display = 'flex';
    document.getElementById('dinnerTimeInput').value = tracker.preferences.dinner_time || '19:00';
});

document.getElementById('closeSettingsButton').addEventListener('click', () => {
    document.getElementById('settingsModal').style.display = 'none';
});

document.getElementById('dinnerTimeInput').addEventListener('change', (e) => {
    tracker.preferences.dinner_time = e.target.value;
    tracker.saveData();
    renderDashboard();
});

document.getElementById('editHabitsButton').addEventListener('click', () => {
    document.getElementById('settingsModal').style.display = 'none';
    renderHabitSelection();
    showScreen('habitSelection');
});

document.getElementById('resetTodayButton').addEventListener('click', () => {
    showConfirmation('Reset Today\'s Progress?', 'This will clear all progress for today. You can still track tomorrow!', () => {
        tracker.resetTodayProgress();
        document.getElementById('settingsModal').style.display = 'none';
        renderDashboard();
    });
});

document.getElementById('resetAllButton').addEventListener('click', () => {
    showConfirmation('Reset All Data?', 'This will delete ALL your habit history and progress. This cannot be undone!', () => {
        tracker.resetAllData();
        document.getElementById('settingsModal').style.display = 'none';
        renderHabitSelection();
        showScreen('habitSelection');
    });
});

// ===========================
// CONFIRMATION MODAL
// ===========================

function showConfirmation(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmationModal').style.display = 'flex';

    document.getElementById('confirmButton').onclick = () => {
        onConfirm();
        document.getElementById('confirmationModal').style.display = 'none';
    };

    document.querySelectorAll('.modal-cancel').forEach(btn => {
        btn.onclick = () => {
            document.getElementById('confirmationModal').style.display = 'none';
        };
    });
}

// ===========================
// MODAL MANAGEMENT
// ===========================

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    const timerModal = document.getElementById('timerModal');
    const settingsModal = document.getElementById('settingsModal');
    const confirmationModal = document.getElementById('confirmationModal');

    if (e.target === timerModal) {
        timerModal.style.display = 'none';
        pauseMeditationTimer();
    }
    if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
    if (e.target === confirmationModal) {
        confirmationModal.style.display = 'none';
    }
});

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    if (tracker.selectedHabits.length > 0) {
        renderDashboard();
        showScreen('dashboard');
    } else {
        showScreen('welcome');
    }
});

// Update data periodically to reflect time changes
setInterval(() => {
    if (tracker.selectedHabits.length > 0) {
        updateDashboardHeader();
    }
}, 60000); // Update every minute
