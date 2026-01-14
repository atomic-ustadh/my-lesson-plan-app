import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { TEMPLATES } from '../templates';

export default function LessonForm({ userId, onSave, initialData = null, mode = 'create', onClose }) {
  const [formData, setFormData] = useState({
    title: '', subject: '', grade: '',
    objectives: '', activities: '', assessment: ''
  });

  // Sync form with initialData if editing/viewing/duplicating
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: mode === 'duplicate' ? `${initialData.title} (Copy)` : initialData.title,
        subject: initialData.subject || '',
        grade: initialData.grade_level || '',
        objectives: initialData.content?.objectives || '',
        activities: initialData.content?.activities || '',
        assessment: initialData.content?.assessment || ''
      });
    }
  }, [initialData, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'view') return;

    const payload = {
      user_id: userId,
      title: formData.title,
      subject: formData.subject,
      grade_level: formData.grade,
      content: { 
        objectives: formData.objectives, 
        activities: formData.activities, 
        assessment: formData.assessment 
      }
    };

    let result;
    if (mode === 'edit') {
      result = await supabase.from('lesson_plans').update(payload).eq('id', initialData.id);
    } else {
      // 'create' or 'duplicate' both use INSERT
      result = await supabase.from('lesson_plans').insert([payload]);
    }

    if (result.error) alert(result.error.message);
    else onSave();
  };

  const isReadOnly = mode === 'view';

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {!isReadOnly && mode !== 'edit' && (
        <select onChange={(e) => {
          const t = TEMPLATES[e.target.value];
          if(t) setFormData({...formData, objectives: t.objectives, activities: t.activities, assessment: t.assessment});
        }}>
          <option value="">-- Apply a Template --</option>
          {Object.entries(TEMPLATES).map(([key, t]) => <option key={key} value={key}>{t.name}</option>)}
        </select>
      )}

      <input 
        disabled={isReadOnly}
        placeholder="Lesson Title" 
        value={formData.title} 
        onChange={e => setFormData({...formData, title: e.target.value})} 
        required 
      />
      
      <textarea 
        disabled={isReadOnly}
        placeholder="Activities" 
        rows="5"
        value={formData.activities} 
        onChange={e => setFormData({...formData, activities: e.target.value})} 
      />

      <div style={{ display: 'flex', gap: '10px' }}>
        {!isReadOnly && <button type="submit" style={{ backgroundColor: 'green', color: 'white' }}>
          {mode === 'edit' ? 'Update Plan' : 'Save Plan'}
        </button>}
        <button type="button" onClick={onClose}>Close</button>
      </div>
    </form>
  );
}