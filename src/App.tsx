import { useState, useEffect } from 'react'

export default function App() {
  const [form, setForm] = useState({
    emotions: "",
    intensity: 5,
    trigger: "",
    bodyFeeling: "",
    thoughts: "",
    actionTaken: "",
    whatHelped: "",
    intensityAfter: 5
  });

  const [history, setHistory] = useState<any[]>([]);

  // Function to fetch logs from the backend
  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/logs');
      const data = await response.json();
      setHistory(data.reverse()); // Reverse so the newest is at the top
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  // This runs once as soon as the app loads
  useEffect(() => {
    fetchHistory();
  }, []);

  // --- STEP 3: THE SAVE FUNCTION ---
  const saveEntry = async () => {
    const fullEntry = {
      ...form,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
    };

    try {
      // Send the data to your server.js running on port 3001
      const response = await fetch('http://localhost:3001/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullEntry),
      });

      if (response.ok) {
        alert("Mood saved successfully to db.json!");
        // Optional: Reset the form here if you want a clean slate
      }

      // ... your fetch('.../api/save') logic ...
      if (response.ok) {
        alert("Saved!");
        fetchHistory(); // <--- Add this line here!
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Failed to save. Make sure your server is running (node server.js)");
    }
  };
  // ---------------------------------

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans text-slate-900">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-3xl p-8 border border-slate-100">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">My Mood Tracker</h1>
          <p className="text-slate-500 font-medium">{new Date().toLocaleString()}</p>
        </header>

        <div className="space-y-8">
          {/* 2) Emotion & Intensity */}
          <section>
            <label className="block text-sm font-bold uppercase tracking-widest text-slate-400 mb-2"> Emotion & Intensity ({form.intensity}/10)</label>
            <input type="text" placeholder="Anxious, sad, calm..." className="w-full bg-slate-50 border-none rounded-xl p-3 mb-3 focus:ring-2 focus:ring-indigo-500" 
              onChange={(e) => setForm({...form, emotions: e.target.value})} />
            <input type="range" min="1" max="10" value={form.intensity} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              onChange={(e) => setForm({...form, intensity: parseInt(e.target.value)})} />
          </section>

          {/* 3 & 4) Trigger & Body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section>
              <label className="block text-sm font-bold uppercase tracking-widest text-slate-400 mb-2"> Trigger</label>
              <input placeholder="What happened?" className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setForm({...form, trigger: e.target.value})} />
            </section>
            <section>
              <label className="block text-sm font-bold uppercase tracking-widest text-slate-400 mb-2"> Body Feeling</label>
              <input placeholder="Headache, tired..." className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setForm({...form, bodyFeeling: e.target.value})} />
            </section>
          </div>

          {/* 5 & 6) Thoughts & Actions */}
          <section>
            <label className="block text-sm font-bold uppercase tracking-widest text-slate-400 mb-2"> Thoughts & Actions</label>
            <textarea placeholder="Mind talk & what you did next..." className="w-full bg-slate-50 border-none rounded-xl p-3 h-24 focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setForm({...form, thoughts: e.target.value})} />
          </section>

          {/* 7 & 8) Help & After */}
          <section className="bg-indigo-50 p-6 rounded-2xl">
            <label className="block text-sm font-bold uppercase tracking-widest text-indigo-400 mb-2"> What Helped? &  After Intensity</label>
            <input placeholder="Music, walking, breathing..." className="w-full bg-white border-none rounded-xl p-3 mb-4 focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setForm({...form, whatHelped: e.target.value})} />
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-indigo-400">After: {form.intensityAfter}/10</span>
              <input type="range" min="1" max="10" value={form.intensityAfter} className="flex-1 h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                onChange={(e) => setForm({...form, intensityAfter: parseInt(e.target.value)})} />
            </div>
          </section>

          {/* Updated button to call saveEntry */}
          <button onClick={saveEntry} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
            Save Entry
          </button>
        </div>
      </div>
    </div>
  )
}