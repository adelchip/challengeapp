'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Profile, Skill } from '@/types';
import { PageLoader } from '@/components/LoadingSpinner';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline, XMarkIcon } from '@heroicons/react/24/outline';
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export default function EditProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { toasts, showToast, removeToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    country: '',
    role: '',
    business_unit: '',
    description: '',
    interests: '',
  });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: '', rating: 3 });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      
      setFormData({
        name: data.name,
        photo: data.photo || '',
        country: data.country,
        role: data.role,
        business_unit: data.business_unit,
        description: data.description || '',
        interests: data.interests || '',
      });
      setSkills(data.skills || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast('Profile not found', 'error');
      router.push('/profiles');
    } finally {
      setLoading(false);
    }
  }

  function addSkill() {
    if (newSkill.name.trim()) {
      setSkills([...skills, { name: newSkill.name.trim(), rating: newSkill.rating }]);
      setNewSkill({ name: '', rating: 3 });
    }
  }

  function removeSkill(index: number) {
    setSkills(skills.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          photo: formData.photo || null,
          country: formData.country,
          role: formData.role,
          business_unit: formData.business_unit,
          description: formData.description || null,
          interests: formData.interests || null,
          skills: skills,
        })
        .eq('id', params.id);

      if (error) throw error;
      
      router.push('/profiles');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Photo URL (Unsplash)</span>
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                className="input input-bordered"
                value={formData.photo}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
              />
              <label className="label">
                <span className="label-text-alt">Optional: Profile photo from Unsplash</span>
              </label>
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Country</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Business Unit</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={formData.business_unit}
                onChange={(e) => setFormData({ ...formData, business_unit: e.target.value })}
                required
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                placeholder="Brief description about yourself..."
                className="textarea textarea-bordered h-24"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Interests</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Web development, Open source, Tech conferences"
                className="input input-bordered"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Skills</span>
              </label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill, idx) => (
                  <div key={idx} className="badge badge-primary gap-2">
                    <span className="flex items-center gap-1">
                      {skill.name}
                      <span className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          star <= skill.rating ? (
                            <StarIcon key={star} className="w-3 h-3 text-warning" />
                          ) : (
                            <StarIconOutline key={star} className="w-3 h-3 text-warning" />
                          )
                        ))}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSkill(idx)}
                      className="hover:text-error"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Skill name"
                  className="input input-bordered flex-1"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setNewSkill({ ...newSkill, rating })}
                      className="focus:outline-none"
                    >
                      {newSkill.rating >= rating ? (
                        <StarIcon className="w-6 h-6 text-warning cursor-pointer hover:scale-110 transition-transform" />
                      ) : (
                        <StarIconOutline className="w-6 h-6 text-warning cursor-pointer hover:scale-110 transition-transform" />
                      )}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addSkill}
                  className="btn btn-sm btn-secondary"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="form-control mt-6 flex flex-row gap-4">
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={saving || skills.length === 0}
              >
                {saving ? <span className="loading loading-spinner"></span> : 'Save Changes'}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => router.back()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
