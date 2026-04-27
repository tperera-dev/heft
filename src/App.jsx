import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
const APP_VERSION = "1.1";

// ── Default Exercise Library ──────────────────────────────────
const DEFAULT_EXERCISES = [
  // Chest
  { id: "e1",  name: "Bench Press",              muscle: "Chest" },
  { id: "e12", name: "Incline Bench Press",       muscle: "Chest" },
  { id: "e13", name: "Dumbbell Fly",              muscle: "Chest" },
  { id: "e16", name: "Machine Chest Press",       muscle: "Chest" },
  { id: "e17", name: "Cable Fly",                 muscle: "Chest" },
  { id: "e18", name: "Pec Deck",                  muscle: "Chest" },
  { id: "e19", name: "Push Up",                   muscle: "Chest" },

  // Back
  { id: "e3",  name: "Deadlift",                  muscle: "Back" },
  { id: "e5",  name: "Barbell Row",               muscle: "Back" },
  { id: "e6",  name: "Pull-Up",                   muscle: "Back" },
  { id: "e11", name: "Lat Pulldown",              muscle: "Back" },
  { id: "e10", name: "Romanian Deadlift",         muscle: "Back" },
  { id: "e20", name: "Seated Cable Row",          muscle: "Back" },
  { id: "e21", name: "Single Arm Dumbbell Row",   muscle: "Back" },
  { id: "e22", name: "T-Bar Row",                 muscle: "Back" },
  { id: "e23", name: "Hyperextension",            muscle: "Back" },

  // Legs
  { id: "e2",  name: "Squat",                     muscle: "Legs" },
  { id: "e9",  name: "Leg Press",                 muscle: "Legs" },
  { id: "e14", name: "Leg Curl",                  muscle: "Legs" },
  { id: "e15", name: "Calf Raise",                muscle: "Legs" },
  { id: "e24", name: "Hack Squat",                muscle: "Legs" },
  { id: "e25", name: "Leg Extension",             muscle: "Legs" },
  { id: "e26", name: "Walking Lunge",             muscle: "Legs" },
  { id: "e27", name: "Bulgarian Split Squat",     muscle: "Legs" },
  { id: "e28", name: "Hip Thrust",                muscle: "Legs" },
  { id: "e29", name: "Seated Calf Raise",         muscle: "Legs" },

  // Shoulders
  { id: "e4",  name: "Overhead Press",            muscle: "Shoulders" },
  { id: "e30", name: "Lateral Raise",             muscle: "Shoulders" },
  { id: "e31", name: "Front Raise",               muscle: "Shoulders" },
  { id: "e32", name: "Rear Delt Fly",             muscle: "Shoulders" },
  { id: "e33", name: "Arnold Press",              muscle: "Shoulders" },
  { id: "e34", name: "Machine Shoulder Press",    muscle: "Shoulders" },
  { id: "e35", name: "Cable Lateral Raise",       muscle: "Shoulders" },
  { id: "e36", name: "Face Pull",                 muscle: "Shoulders" },

  // Arms
  { id: "e7",  name: "Dumbbell Curl",             muscle: "Arms" },
  { id: "e8",  name: "Tricep Pushdown",           muscle: "Arms" },
  { id: "e37", name: "Barbell Curl",              muscle: "Arms" },
  { id: "e38", name: "Hammer Curl",               muscle: "Arms" },
  { id: "e39", name: "Preacher Curl",             muscle: "Arms" },
  { id: "e40", name: "Cable Curl",                muscle: "Arms" },
  { id: "e41", name: "Skull Crusher",             muscle: "Arms" },
  { id: "e42", name: "Overhead Tricep Extension", muscle: "Arms" },
  { id: "e43", name: "Close Grip Bench Press",    muscle: "Arms" },
  { id: "e44", name: "Dip",                       muscle: "Arms" },

  // Core
  { id: "e45", name: "Plank",                     muscle: "Core" },
  { id: "e46", name: "Cable Crunch",              muscle: "Core" },
  { id: "e47", name: "Hanging Leg Raise",         muscle: "Core" },
  { id: "e48", name: "Ab Wheel Rollout",          muscle: "Core" },
  { id: "e49", name: "Russian Twist",             muscle: "Core" },
  { id: "e50", name: "Decline Sit Up",            muscle: "Core" },
];

const MUSCLE_GROUPS = ["Chest","Back","Legs","Shoulders","Arms","Core","Cardio","Other"];

// ── Styles ─────────────────────────────────────────────────────
const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0a0a;
    overscroll-behavior: none;
  }

  .app {
    font-family: 'Barlow', sans-serif;
    background: #0a0a0a;
    color: #e8e8e8;
    min-height: 100vh;
    min-height: 100dvh;
    max-width: 480px;
    margin: 0 auto;
    position: relative;
  }

  .header {
    background: #0a0a0a;
    border-bottom: 2px solid #c8ff00;
    padding: 16px 20px 12px;
    padding-top: calc(16px + env(safe-area-inset-top));
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .header-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    font-size: 28px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #fff;
    line-height: 1;
  }
  .header-title span { color: #c8ff00; }
  .header-date {
    font-size: 12px;
    color: #666;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .nav {
    display: flex;
    background: #111;
    border-bottom: 1px solid #1e1e1e;
    position: sticky;
    top: 69px;
    z-index: 99;
  }
  .nav-btn {
    flex: 1;
    padding: 12px 4px;
    background: none;
    border: none;
    color: #555;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 0.15s;
    border-bottom: 3px solid transparent;
    -webkit-tap-highlight-color: transparent;
  }
  .nav-btn.active {
    color: #c8ff00;
    border-bottom: 3px solid #c8ff00;
  }

  .content {
    padding: 16px;
    padding-bottom: calc(30px + env(safe-area-inset-bottom));
  }

  /* Cards */
  .card {
    background: #111;
    border: 1px solid #1e1e1e;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 12px;
  }
  .card-header {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700;
    font-size: 18px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #fff;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .card-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 6px;
  }

  /* Buttons */
  .btn {
    padding: 10px 16px;
    border: none;
    border-radius: 2px;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-primary { background: #c8ff00; color: #0a0a0a; }
  .btn-primary:hover { background: #d4ff33; }
  .btn-ghost { background: transparent; color: #888; border: 1px solid #2a2a2a; }
  .btn-ghost:hover { border-color: #555; color: #e8e8e8; }
  .btn-ghost:disabled { opacity: 0.3; cursor: default; }
  .btn-danger { background: transparent; color: #ff4444; border: 1px solid #331111; }
  .btn-danger:hover { background: #331111; }
  .btn-sm { padding: 6px 10px; font-size: 12px; }
  .btn-icon {
    width: 32px; height: 32px;
    border-radius: 2px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; line-height: 1;
  }

  /* Inputs */
  .input {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 2px;
    color: #e8e8e8;
    padding: 10px 12px;
    font-family: 'Barlow', sans-serif;
    font-size: 16px; /* 16px prevents iOS zoom */
    width: 100%;
    outline: none;
    transition: border-color 0.15s;
    appearance: none;
    -webkit-appearance: none;
  }
  .input:focus { border-color: #c8ff00; }
  .input::placeholder { color: #444; }
  select.input { cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }

  /* Sets table */
  .sets-row {
    display: grid;
    grid-template-columns: 32px 1fr 1fr auto;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
  }
  .set-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700;
    font-size: 16px;
    color: #c8ff00;
    text-align: center;
  }
  .sets-header {
    display: grid;
    grid-template-columns: 32px 1fr 1fr auto;
    gap: 8px;
    margin-bottom: 8px;
  }

  /* Exercise block in log */
  .exercise-block {
    background: #0d0d0d;
    border: 1px solid #1e1e1e;
    border-left: 3px solid #c8ff00;
    border-radius: 2px;
    padding: 14px;
    margin-bottom: 10px;
  }
  .exercise-block-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700;
    font-size: 18px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #fff;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* Routine items */
  .routine-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 12px;
    background: #0d0d0d;
    border: 1px solid #1e1e1e;
    border-radius: 2px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: border-color 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .routine-item:hover { border-color: #333; }
  .routine-item.selected { border-color: #c8ff00; }
  .routine-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700;
    font-size: 17px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Exercise library */
  .ex-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: #0d0d0d;
    border: 1px solid #1e1e1e;
    border-radius: 2px;
    margin-bottom: 6px;
  }
  .ex-name { font-weight: 600; font-size: 15px; }
  .ex-muscle {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #c8ff00;
    background: #1a2200;
    padding: 2px 6px;
    border-radius: 2px;
  }

  /* Progress */
  .prog-select { margin-bottom: 16px; }
  .stat-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    margin-bottom: 16px;
  }
  .stat-box {
    background: #0d0d0d;
    border: 1px solid #1e1e1e;
    border-radius: 2px;
    padding: 12px;
    text-align: center;
  }
  .stat-val {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    font-size: 26px;
    color: #c8ff00;
    line-height: 1;
  }
  .stat-lbl {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #555;
    margin-top: 4px;
  }

  .empty {
    text-align: center;
    color: #444;
    padding: 40px 20px;
    font-size: 14px;
    letter-spacing: 0.5px;
    line-height: 1.6;
  }
  .empty-icon { font-size: 36px; margin-bottom: 12px; }

  .tag {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    padding: 2px 7px;
    border-radius: 2px;
    margin: 2px;
    color: #888;
  }

  .date-nav {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }
  .date-nav .date-label {
    flex: 1;
    text-align: center;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700;
    font-size: 17px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    z-index: 200;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  .modal {
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 4px 4px 0 0;
    padding: 20px;
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
    width: 100%;
    max-width: 480px;
    max-height: 80vh;
    overflow-y: auto;
  }
  .modal-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    font-size: 22px;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .flex-row { display: flex; gap: 8px; align-items: center; }
  .flex-1 { flex: 1; }

  .search-input { margin-bottom: 12px; }

  .check-ex {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border: 1px solid #1e1e1e;
    border-radius: 2px;
    margin-bottom: 6px;
    cursor: pointer;
    background: #0d0d0d;
    transition: border-color 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .check-ex.selected { border-color: #c8ff00; }
  .check-box {
    width: 20px; height: 20px;
    border: 2px solid #333;
    border-radius: 2px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: all 0.15s;
  }
  .check-ex.selected .check-box {
    background: #c8ff00;
    border-color: #c8ff00;
    color: #000;
    font-weight: 900;
    font-size: 13px;
  }

  .pb-badge {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    background: #c8ff00;
    color: #000;
    padding: 1px 5px;
    border-radius: 2px;
  }

  .custom-tooltip {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    padding: 8px 12px;
    border-radius: 2px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px;
  }
`;

// ── Utils ──────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];
const uid = () => Math.random().toString(36).slice(2, 9);

const fmt = (d) => {
  const [, m, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[+m - 1]} ${+day}`;
};

const fmtFull = (d) => {
  const [y, m, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const dt = new Date(d + "T12:00:00");
  return `${days[dt.getDay()]}, ${months[+m - 1]} ${+day} ${y}`;
};

const addDays = (d, n) => {
  const dt = new Date(d + "T12:00:00");
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().split("T")[0];
};

const maxWeight = (sets) => Math.max(...sets.map(s => parseFloat(s.weight) || 0));
const totalVol  = (sets) => sets.reduce((a, s) => a + (parseFloat(s.weight)||0) * (parseInt(s.reps)||0), 0);

// ── localStorage helpers ───────────────────────────────────────
function load(key, fallback) {
  try {
    const r = localStorage.getItem(key);
    return r ? JSON.parse(r) : fallback;
  } catch { return fallback; }
}

function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]               = useState("log");
  const [selectedDate, setSelectedDate] = useState(today());
  const [exercises, setExercises] = useState(() => {
    const savedVersion = load("wt:version", null);
    const saved = load("wt:exercises", null);
    if (!saved || savedVersion !== APP_VERSION) {
      // Merge: keep custom exercises, add any new defaults
      const custom = (saved || []).filter(e => e.custom);
      const existingIds = new Set((saved || []).map(e => e.id));
      const newDefaults = DEFAULT_EXERCISES.filter(e => !existingIds.has(e.id));
      const merged = [...DEFAULT_EXERCISES, ...custom.filter(e => !DEFAULT_EXERCISES.find(d => d.id === e.id)), ...newDefaults.filter(e => !DEFAULT_EXERCISES.find(d => d.id === e.id))];
      save("wt:version", APP_VERSION);
      save("wt:exercises", DEFAULT_EXERCISES.concat(custom));
      return DEFAULT_EXERCISES.concat(custom);
    }
    return saved;
  });
  const [routines,  setRoutines]    = useState(() => load("wt:routines",  []));
  const [workouts,  setWorkouts]    = useState(() => load("wt:workouts",  {}));

  const saveExercises = (v) => { setExercises(v); save("wt:exercises", v); };
  const saveRoutines  = (v) => { setRoutines(v);  save("wt:routines",  v); };
  const saveWorkouts  = (v) => { setWorkouts(v);  save("wt:workouts",  v); };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div className="header-title">HE<span>FT</span></div>
          <div className="header-date">{fmtFull(selectedDate)}</div>
        </div>

        <nav className="nav">
          {[["log","📋 Log"],["routines","🔁 Routines"],["exercises","💪 Exercises"],["progress","📈 Progress"]].map(([k,l]) => (
            <button key={k} className={`nav-btn${tab === k ? " active" : ""}`} onClick={() => setTab(k)}>{l}</button>
          ))}
        </nav>

        <div className="content">
          {tab === "log"       && <LogTab       date={selectedDate} setDate={setSelectedDate} workouts={workouts} saveWorkouts={saveWorkouts} exercises={exercises} routines={routines} />}
          {tab === "routines"  && <RoutinesTab  routines={routines}  saveRoutines={saveRoutines}  exercises={exercises} />}
          {tab === "exercises" && <ExercisesTab exercises={exercises} saveExercises={saveExercises} />}
          {tab === "progress"  && <ProgressTab  workouts={workouts}  exercises={exercises} />}
        </div>
      </div>
    </>
  );
}

// ── LOG TAB ───────────────────────────────────────────────────
function LogTab({ date, setDate, workouts, saveWorkouts, exercises, routines }) {
  const [showRoutinePicker, setShowRoutinePicker] = useState(false);
  const [showExPicker,      setShowExPicker]      = useState(false);

  const workout = workouts[date] || { blocks: [] };

  const updateWorkout = (blocks) => saveWorkouts({ ...workouts, [date]: { blocks } });

  const addRoutine = (routine) => {
    const existing = new Set(workout.blocks.map(b => b.exerciseId));
    const newBlocks = routine.exerciseIds
      .filter(id => !existing.has(id))
      .map(id => ({ id: uid(), exerciseId: id, sets: [{ weight: "", reps: "" }] }));
    updateWorkout([...workout.blocks, ...newBlocks]);
    setShowRoutinePicker(false);
  };

  const addExercise = (exId) => {
    updateWorkout([...workout.blocks, { id: uid(), exerciseId: exId, sets: [{ weight: "", reps: "" }] }]);
    setShowExPicker(false);
  };

  const updateBlock = (blockId, sets) =>
    updateWorkout(workout.blocks.map(b => b.id === blockId ? { ...b, sets } : b));

  const removeBlock = (blockId) =>
    updateWorkout(workout.blocks.filter(b => b.id !== blockId));

  const getExName = (id) => exercises.find(e => e.id === id)?.name || "Unknown";

  const getPB = (exId, sets) => {
    const bestNow = maxWeight(sets);
    if (bestNow <= 0) return false;
    return !Object.entries(workouts).some(([d, w]) =>
      d !== date && w.blocks?.some(b => b.exerciseId === exId && maxWeight(b.sets) >= bestNow)
    );
  };

  return (
    <>
      <div className="date-nav">
        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setDate(addDays(date, -1))}>‹</button>
        <div className="date-label">{fmt(date)}{date === today() ? " · Today" : ""}</div>
        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setDate(addDays(date, 1))} disabled={date >= today()}>›</button>
      </div>

      <div className="flex-row" style={{marginBottom:16}}>
        {routines.length > 0 && (
          <button className="btn btn-ghost flex-1" onClick={() => setShowRoutinePicker(true)}>+ Load Routine</button>
        )}
        <button className="btn btn-primary flex-1" onClick={() => setShowExPicker(true)}>+ Add Exercise</button>
      </div>

      {workout.blocks.length === 0 && (
        <div className="empty">
          <div className="empty-icon">🏋️</div>
          No exercises logged yet.<br/>Add an exercise or load a routine.
        </div>
      )}

      {workout.blocks.map(block => {
        const isPB = getPB(block.exerciseId, block.sets);
        return (
          <div key={block.id} className="exercise-block">
            <div className="exercise-block-name">
              <span>{getExName(block.exerciseId)}</span>
              <div className="flex-row" style={{gap:6}}>
                {isPB && <span className="pb-badge">PB 🏆</span>}
                <button className="btn btn-danger btn-sm" onClick={() => removeBlock(block.id)}>✕</button>
              </div>
            </div>
            <SetsEditor sets={block.sets} onChange={(s) => updateBlock(block.id, s)} exId={block.exerciseId} workouts={workouts} date={date} />
          </div>
        );
      })}

      {showRoutinePicker && (
        <div className="modal-overlay" onClick={() => setShowRoutinePicker(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Load Routine</div>
            {routines.map(r => (
              <div key={r.id} className="routine-item" onClick={() => addRoutine(r)}>
                <div style={{flex:1}}>
                  <div className="routine-name" style={{marginBottom:8}}>{r.name}</div>
                  {r.exerciseIds.map(id => {
                    const ex = exercises.find(e => e.id === id);
                    if (!ex) return null;
                    const lastSets = (() => {
                      const dates = Object.keys(workouts).filter(d => d < date).sort().reverse();
                      for (const d of dates) {
                        const block = workouts[d]?.blocks?.find(b => b.exerciseId === id);
                        if (block?.sets?.some(s => s.weight)) return block.sets;
                      }
                      return null;
                    })();
                    const topSet = lastSets
                      ? [...lastSets].filter(s => s.weight).sort((a,b) => (parseFloat(b.weight)||0) - (parseFloat(a.weight)||0))[0]
                      : null;
                    return (
                      <div key={id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:13,color:"#888"}}>{ex.name}</span>
                        {topSet
                          ? <span style={{fontSize:13,fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,color:"#c8ff00"}}>{topSet.weight}kg × {topSet.reps}</span>
                          : <span style={{fontSize:11,color:"#333",letterSpacing:"0.5px"}}>no data</span>
                        }
                      </div>
                    );
                  })}
                </div>
                <span style={{color:"#c8ff00",fontSize:20,marginLeft:12}}>›</span>
              </div>
            ))}
            <button className="btn btn-ghost" style={{width:"100%",marginTop:8}} onClick={() => setShowRoutinePicker(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showExPicker && (
        <ExercisePicker exercises={exercises} onPick={addExercise} onClose={() => setShowExPicker(false)} />
      )}
    </>
  );
}

function SetsEditor({ sets, onChange, exId, workouts, date }) {
  const lastSession = (() => {
    const dates = Object.keys(workouts).filter(d => d < date).sort().reverse();
    for (const d of dates) {
      const block = workouts[d]?.blocks?.find(b => b.exerciseId === exId);
      if (block) return block.sets;
    }
    return null;
  })();

  const update = (i, field, val) => onChange(sets.map((s, j) => j === i ? { ...s, [field]: val } : s));
  const addSet = () => onChange([...sets, { weight: sets[sets.length-1]?.weight || "", reps: sets[sets.length-1]?.reps || "" }]);
  const removeSet = (i) => { if (sets.length > 1) onChange(sets.filter((_, j) => j !== i)); };

  return (
    <div>
      <div className="sets-header">
        <div className="card-label" style={{textAlign:"center"}}>SET</div>
        <div className="card-label" style={{textAlign:"center"}}>WEIGHT (kg)</div>
        <div className="card-label" style={{textAlign:"center"}}>REPS</div>
        <div />
      </div>
      {lastSession && (
        <div style={{fontSize:11,color:"#444",marginBottom:8,letterSpacing:"0.5px"}}>
          Last: {lastSession.map(s => `${s.weight}×${s.reps}`).join(" · ")}
        </div>
      )}
      {sets.map((s, i) => (
        <div key={i} className="sets-row">
          <div className="set-num">{i+1}</div>
          <input
            className="input"
            type="number"
            inputMode="decimal"
            placeholder={lastSession?.[i]?.weight || "0"}
            value={s.weight}
            onChange={e => update(i, "weight", e.target.value)}
            style={{textAlign:"center"}}
          />
          <input
            className="input"
            type="number"
            inputMode="numeric"
            placeholder={lastSession?.[i]?.reps || "0"}
            value={s.reps}
            onChange={e => update(i, "reps", e.target.value)}
            style={{textAlign:"center"}}
          />
          <button className="btn btn-ghost btn-sm btn-icon" onClick={() => removeSet(i)} style={{color:"#555"}}>−</button>
        </div>
      ))}
      <button className="btn btn-ghost btn-sm" style={{width:"100%",marginTop:4}} onClick={addSet}>+ Add Set</button>
    </div>
  );
}

// ── ROUTINES TAB ──────────────────────────────────────────────
function RoutinesTab({ routines, saveRoutines, exercises }) {
  const [creating, setCreating] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [name,     setName]     = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const openCreate = () => { setName(""); setSelectedIds([]); setEditing(null); setCreating(true); };
  const openEdit = (r) => { setName(r.name); setSelectedIds(r.exerciseIds); setEditing(r.id); setCreating(true); };

  const saveRoutine = () => {
    if (!name.trim() || selectedIds.length === 0) return;
    if (editing) {
      saveRoutines(routines.map(r => r.id === editing ? { ...r, name: name.trim(), exerciseIds: selectedIds } : r));
    } else {
      saveRoutines([...routines, { id: uid(), name: name.trim(), exerciseIds: selectedIds }]);
    }
    setCreating(false);
  };

  const del = (id) => saveRoutines(routines.filter(r => r.id !== id));

  return (
    <>
      <div className="flex-row" style={{marginBottom:16}}>
        <div style={{fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,fontSize:20,textTransform:"uppercase",letterSpacing:1,flex:1}}>My Routines</div>
        <button className="btn btn-primary" onClick={openCreate}>+ New</button>
      </div>

      {routines.length === 0 && (
        <div className="empty">
          <div className="empty-icon">📋</div>
          No routines yet.<br/>Create one to speed up logging.
        </div>
      )}

      {routines.map(r => (
        <div key={r.id} className="card">
          <div className="card-header">
            <span>{r.name}</span>
            <div className="flex-row" style={{gap:6}}>
              <button className="btn btn-ghost btn-sm" onClick={() => openEdit(r)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => del(r.id)}>✕</button>
            </div>
          </div>
          <div>
            {r.exerciseIds.map(id => {
              const ex = exercises.find(e => e.id === id);
              return ex ? <span key={id} className="tag">{ex.name}</span> : null;
            })}
          </div>
        </div>
      ))}

      {creating && (
        <div className="modal-overlay" onClick={() => setCreating(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{editing ? "Edit Routine" : "New Routine"}</div>
            <div className="card-label">Routine Name</div>
            <input className="input" placeholder="e.g. Push Day" value={name} onChange={e => setName(e.target.value)} style={{marginBottom:14}} />
            <div className="card-label" style={{marginBottom:8}}>Select Exercises ({selectedIds.length} selected)</div>
            <ExerciseCheckList exercises={exercises} selectedIds={selectedIds} onChange={setSelectedIds} />
            <div className="flex-row" style={{marginTop:14,gap:8}}>
              <button className="btn btn-ghost flex-1" onClick={() => setCreating(false)}>Cancel</button>
              <button className="btn btn-primary flex-1" onClick={saveRoutine} disabled={!name.trim() || selectedIds.length === 0}>
                {editing ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ExerciseCheckList({ exercises, selectedIds, onChange }) {
  const [search, setSearch] = useState("");
  const filtered = exercises.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  const toggle = (id) => onChange(selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id]);

  return (
    <>
      <input className="input search-input" placeholder="Search exercises..." value={search} onChange={e => setSearch(e.target.value)} />
      <div style={{maxHeight:300,overflowY:"auto"}}>
        {filtered.map(e => (
          <div key={e.id} className={`check-ex${selectedIds.includes(e.id) ? " selected" : ""}`} onClick={() => toggle(e.id)}>
            <div className="check-box">{selectedIds.includes(e.id) ? "✓" : ""}</div>
            <div className="flex-1">
              <div style={{fontWeight:600}}>{e.name}</div>
              <div style={{fontSize:11,color:"#555"}}>{e.muscle}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── EXERCISES TAB ─────────────────────────────────────────────
function ExercisesTab({ exercises, saveExercises }) {
  const [adding, setAdding] = useState(false);
  const [name,   setName]   = useState("");
  const [muscle, setMuscle] = useState("Other");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const groups   = ["All", ...MUSCLE_GROUPS];
  const filtered = exercises.filter(e =>
    (filter === "All" || e.muscle === filter) &&
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const add = () => {
    if (!name.trim()) return;
    saveExercises([...exercises, { id: uid(), name: name.trim(), muscle, custom: true }]);
    setName(""); setMuscle("Other"); setAdding(false);
  };

  const del = (id) => saveExercises(exercises.filter(e => e.id !== id));

  return (
    <>
      <div className="flex-row" style={{marginBottom:12}}>
        <div style={{fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,fontSize:20,textTransform:"uppercase",letterSpacing:1,flex:1}}>Exercise Library</div>
        <button className="btn btn-primary" onClick={() => setAdding(true)}>+ New</button>
      </div>

      <input className="input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{marginBottom:10}} />

      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:12}}>
        {groups.map(g => (
          <button key={g} className={`btn btn-sm${filter === g ? " btn-primary" : " btn-ghost"}`} style={{whiteSpace:"nowrap",flexShrink:0}} onClick={() => setFilter(g)}>{g}</button>
        ))}
      </div>

      {filtered.map(e => (
        <div key={e.id} className="ex-item">
          <div>
            <div className="ex-name">{e.name}</div>
            {e.custom && <div style={{fontSize:11,color:"#555",marginTop:2}}>Custom</div>}
          </div>
          <div className="flex-row" style={{gap:8}}>
            <span className="ex-muscle">{e.muscle}</span>
            {e.custom && <button className="btn btn-danger btn-sm" onClick={() => del(e.id)}>✕</button>}
          </div>
        </div>
      ))}

      {adding && (
        <div className="modal-overlay" onClick={() => setAdding(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">New Exercise</div>
            <div className="card-label">Name</div>
            <input className="input" placeholder="e.g. Cable Fly" value={name} onChange={e => setName(e.target.value)} style={{marginBottom:12}} />
            <div className="card-label">Muscle Group</div>
            <select className="input" value={muscle} onChange={e => setMuscle(e.target.value)} style={{marginBottom:14}}>
              {MUSCLE_GROUPS.map(m => <option key={m}>{m}</option>)}
            </select>
            <div className="flex-row" style={{gap:8}}>
              <button className="btn btn-ghost flex-1" onClick={() => setAdding(false)}>Cancel</button>
              <button className="btn btn-primary flex-1" onClick={add} disabled={!name.trim()}>Add</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── PROGRESS TAB ──────────────────────────────────────────────
function ProgressTab({ workouts, exercises }) {
  const [selectedEx, setSelectedEx] = useState(null);
  const [metric,     setMetric]     = useState("weight");

  const loggedExIds = new Set();
  Object.values(workouts).forEach(w => w.blocks?.forEach(b => loggedExIds.add(b.exerciseId)));
  const loggedExercises = exercises.filter(e => loggedExIds.has(e.id));

  useEffect(() => {
    if (loggedExercises.length > 0 && !selectedEx) setSelectedEx(loggedExercises[0].id);
  }, [loggedExercises.length]);

  if (loggedExercises.length === 0) return (
    <div className="empty" style={{marginTop:40}}>
      <div className="empty-icon">📈</div>
      No workout data yet.<br/>Log some workouts to see your progress!
    </div>
  );

  const cutoff = addDays(today(), -90);
  const chartData = [];
  Object.keys(workouts).filter(d => d >= cutoff && d <= today()).sort().forEach(d => {
    const block = workouts[d]?.blocks?.find(b => b.exerciseId === selectedEx);
    if (!block) return;
    const sets = block.sets.filter(s => s.weight || s.reps);
    if (!sets.length) return;
    const val = metric === "weight" ? maxWeight(sets)
              : metric === "volume" ? totalVol(sets)
              : Math.max(...sets.map(s => parseInt(s.reps)||0));
    chartData.push({ date: fmt(d), val });
  });

  const vals   = chartData.map(d => d.val);
  const best   = vals.length ? Math.max(...vals) : 0;
  const first  = vals.length ? vals[0] : 0;
  const last   = vals.length ? vals[vals.length-1] : 0;
  const change = first ? (((last - first) / first) * 100).toFixed(1) : 0;
  const metricLabel = metric === "weight" ? "kg" : metric === "volume" ? "vol" : "reps";

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="custom-tooltip">
        <div style={{color:"#888",fontSize:12}}>{label}</div>
        <div style={{color:"#c8ff00",fontWeight:700,fontSize:18}}>{payload[0].value} {metricLabel}</div>
      </div>
    );
  };

  return (
    <>
      <div style={{fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,fontSize:20,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Progress</div>

      <div className="card-label" style={{marginBottom:6}}>Exercise</div>
      <select className="input prog-select" value={selectedEx || ""} onChange={e => setSelectedEx(e.target.value)}>
        {loggedExercises.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
      </select>

      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {[["weight","Max Weight"],["volume","Volume"],["reps","Max Reps"]].map(([k,l]) => (
          <button key={k} className={`btn btn-sm flex-1${metric === k ? " btn-primary" : " btn-ghost"}`} onClick={() => setMetric(k)}>{l}</button>
        ))}
      </div>

      {chartData.length < 2 ? (
        <div className="empty" style={{padding:"30px 20px"}}>
          <div className="empty-icon">📊</div>
          Need at least 2 sessions to show a trend.
        </div>
      ) : (
        <>
          <div className="stat-row">
            <div className="stat-box">
              <div className="stat-val">{best}</div>
              <div className="stat-lbl">Peak {metricLabel}</div>
            </div>
            <div className="stat-box">
              <div className="stat-val">{last}</div>
              <div className="stat-lbl">Latest</div>
            </div>
            <div className="stat-box">
              <div className="stat-val" style={{color: +change >= 0 ? "#c8ff00" : "#ff4444"}}>{+change > 0 ? "+" : ""}{change}%</div>
              <div className="stat-lbl">90-day</div>
            </div>
          </div>

          <div className="card" style={{padding:"16px 8px"}}>
            <div className="card-label" style={{paddingLeft:8,marginBottom:12}}>
              {metric === "weight" ? "Max Weight (kg)" : metric === "volume" ? "Total Volume" : "Max Reps"} · Last 3 Months
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{left:-10,right:10,top:5,bottom:5}}>
                <CartesianGrid strokeDasharray="2 4" stroke="#1e1e1e" />
                <XAxis dataKey="date" tick={{fill:"#444",fontSize:10,fontFamily:"Barlow Condensed"}} tickLine={false} axisLine={false} />
                <YAxis tick={{fill:"#444",fontSize:10,fontFamily:"Barlow Condensed"}} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="val" stroke="#c8ff00" strokeWidth={2}
                  dot={{ r:4, fill:"#c8ff00", strokeWidth:0 }}
                  activeDot={{ r:6, fill:"#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-label" style={{marginBottom:10}}>Session History</div>
            {[...chartData].reverse().map((d, i) => (
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #1a1a1a"}}>
                <span style={{fontSize:14,color:"#888"}}>{d.date}</span>
                <span style={{fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,fontSize:17,color:"#e8e8e8"}}>
                  {d.val} <span style={{color:"#555",fontWeight:400,fontSize:13}}>{metricLabel}</span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

// ── Exercise Picker Modal ─────────────────────────────────────
function ExercisePicker({ exercises, onPick, onClose }) {
  const [search, setSearch] = useState("");
  const filtered = exercises.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">Add Exercise</div>
        <input className="input search-input" placeholder="Search exercises..." value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{maxHeight:400,overflowY:"auto"}}>
          {filtered.map(e => (
            <div key={e.id} className="ex-item" style={{cursor:"pointer"}} onClick={() => onPick(e.id)}>
              <div className="ex-name">{e.name}</div>
              <span className="ex-muscle">{e.muscle}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-ghost" style={{width:"100%",marginTop:10}} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
