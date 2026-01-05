# MadReps: Intelligent Workout Engine

**Stochastic workout generation for optimized training with minimal input.**

MadReps is a logic-driven workout application designed to eliminate decision fatigue and the burden of manual tracking. Unlike traditional fitness apps that require you to act as an accountant logging every repetition, MadReps uses stochastic generation and mathematical scaling to create dynamic, evolving training sessions.

It requires only **one single input** from you—a post-workout rating—to mathematically adjust your future training volume.

---

## The MadReps Philosophy

### 1. Zero-Friction Tracking (Low Cognitive Load)
Most workout apps are mentally taxing, forcing you to input data constantly during training. MadReps flips the script. You focus on the movement; the engine handles the math. By providing a single feedback score (1-10) at the end of a session, the application automatically calibrates your strength profile for the next workout using a square-root growth formula.

### 2. The Power of Stochastic Variance
Training linearly often leads to mental burnout or physical plateaus. MadReps uses controlled randomness ("stochastic process") under defined limits to generate repetitions.
* **The Push-Pull Effect:** By varying rep counts within a controlled range based on your 1-set max, some sets will feel lighter, providing a mental "win," while others push your limits.
* **Sustained Engagement:** This variance keeps the central nervous system engaged and prevents the psychological strain of feeling like you must hit a personal record every single session.

---

## Key Features

* **Dynamic Generation**: Workouts are generated just-in-time. Repetitions and exercise order change every time you play.
* **Smart Calibration**: A feedback-driven system that updates your strength metrics automatically based on perceived exertion.
* **Sinusoidal Rest Scaling**: Rest intervals are not static; they scale using a sine function to optimize recovery during the most intense parts of the workout.
* **Path-Based Organization**: Organize routines by distinct training styles (e.g., Animal Flow, Jump Rope, Calisthenics).
* **Workout Player**: A focused, timer-based interface with previous/next controls and upcoming exercise previews.
* **Exercise Shuffling**: Optional toggling to randomize exercise order per set, preventing order bias fatigue.

---

## Workout Generation Flowchart

Below is the logic flow for how a static configuration becomes a dynamic workout session and how user feedback loops back into the system.

```mermaid
graph TD
    A[Workout Config Blueprint] -->|User clicks Play| B(Generation Engine);
    B --> C{Stochastic Processes};
    C -->|Calculate Reps| D[Reps based on 1s_max bounds];
    C -->|Calculate Rest| E[Sinusoidal Rest Scaling];
    C -->|Optional| F[Shuffle Exercise Order];
    D --> G[Generated Workout Sequence];
    E --> G;
    F --> G;
    G -->|Loaded into| H[Workout Player UI];
    H -->|User completes session| I[User Feedback Input 1-10];
    I -->|Apply Calibration Formula| J(Update 1s_max);
    J -->|Save new metrics| K[(Database/LocalStorage)];
    K -->|Next session references| A;