import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function ResumeBuilder() {
  const [user, setUser] = useState({ name: '', email: '' });
const [formData, setFormData] = useState({
  photo: '',
  socialLinks: [],
  contactInfo: {
    contact: '',
    email: '',
    address: '',
  },
  skills: [],
  languages: [],
  education: [],
  aboutMe: '',
  experience: [],
  projects: [],
  certifications: [],
});

const SOCIAL_MEDIA_OPTIONS = [
  "LinkedIn", "GitHub", "LeetCode", "HackerRank", "YouTube",
  "CodeChef", "Twitter", "Instagram", "Facebook", "Reddit",
  "StackOverflow", "Dribbble", "Behance", "Medium", "Dev.to"
];
const [newSocialPlatform, setNewSocialPlatform] = useState('');
const [newSocialUrl, setNewSocialUrl] = useState('');


  const navigate = useNavigate();

const token = localStorage.getItem('token');

useEffect(() => {
  if (!token) {
    navigate('/login');
    return;
  }

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/resume/me", {
        headers: { Authorization: token }
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const fetchResume = async () => {
    try {
      const res = await axios.get('http://localhost:5000/resume/get', {
        headers: { Authorization: token },
      });
      if (res.data) setFormData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const payload = JSON.parse(atob(token.split('.')[1]));
  setUser({ name: payload.name, email: payload.email });

  fetchUser();
  fetchResume();
}, [token, navigate]);

const addSocialLink = () => {
  if (!newSocialPlatform || !newSocialUrl) return;

  setFormData({
    ...formData,
    socialLinks: [...formData.socialLinks, { platform: newSocialPlatform, url: newSocialUrl }]
  });

  setNewSocialPlatform('');
  setNewSocialUrl('');
};

  
  const handleFileUpload = async (e) => {
    const form = new FormData();
    form.append('photo', e.target.files[0]);
    const res = await axios.post('http://localhost:5000/resume/upload-photo', form, {
      headers: { Authorization: token },
    });
    setFormData(prev => ({ ...prev, photo: res.data.filename }));
  };

const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("Saving data:", formData); // ✅ log what you're sending

    const res = await axios.post("http://localhost:5000/resume/save", formData, {
      headers: { Authorization: token }
    });

    console.log("Saved response:", res.data); // ✅ log result
    alert("Resume saved!");
  } catch (err) {
    console.error("Save error:", err.response?.data || err.message); // ✅ more precise
    alert("Failed to save");
  }
};


  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

const downloadPdf = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("No token found, please log in again");
    return;
  }

  axios
    .get("http://localhost:5000/resume/download", {
      headers: {
        Authorization: token, // ✅ No "Bearer " prefix
      },
      responseType: "blob", // Important for downloading binary
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch((error) => {
      console.error(error);
      alert(
        "Failed to download PDF: " +
          (error.response?.data || error.message)
      );
    });
};

const deleteItem = (field, index) => {
  const updated = [...formData[field]];
  updated.splice(index, 1);
  setFormData({ ...formData, [field]: updated });
};

const updateField = (section, index, key, value) => {
  const updated = [...formData[section]];
  updated[index] = { ...updated[index], [key]: value };
  setFormData({ ...formData, [section]: updated });
};


  return (
    <div className="resumebuilder">
    <div style={{ padding: '20px' }}>
      <h2>
        {user.name && user.email
        ? `Hi, ${user.name} | Email: ${user.email}`
        : 'Loading user...'}
      </h2>

      <button className="logout" onClick={logout}>Logout</button>

      <div>
        <h3>Upload Photo</h3>
        <input type="file" onChange={handleFileUpload} />
        {formData.photo && (
          <img
          src={`http://localhost:5000/uploads/${formData.photo}`}
          alt="Profile"
          width="100"
          />
          )}
      </div>

<div className='sociallink'>
  <h3>Social Links</h3>
  
  {formData.socialLinks.map((link, i) => (
    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ cursor: 'pointer' }} onClick={() => deleteItem('socialLinks', i)}>🗑️</span>
      <strong>{link.platform}:</strong>
      <input
        type="text"
        value={link.url}
        onChange={(e) => {
          const updated = [...formData.socialLinks];
          updated[i].url = e.target.value;
          setFormData({ ...formData, socialLinks: updated });
        }}
        style={{ flex: 1 }}
      />
    </div>
  ))}

  <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
    <select
      value={newSocialPlatform}
      onChange={(e) => setNewSocialPlatform(e.target.value)}
    >
      <option value="">Select Platform</option>
      {SOCIAL_MEDIA_OPTIONS.map((platform) => (
        <option key={platform} value={platform}>{platform}</option>
      ))}
    </select>

    {newSocialPlatform && (
      <input
        type="text"
        placeholder={`Enter ${newSocialPlatform} URL`}
        value={newSocialUrl}
        onChange={(e) => setNewSocialUrl(e.target.value)}
      />
    )}
    
    <button onClick={addSocialLink}>Add link</button>
  </div>
</div>


      <div>
        <h3>Contact Info</h3>
        <input placeholder="Contact No." onChange={e => setFormData({ ...formData, contactInfo: { ...formData.contactInfo, contact: e.target.value } })} value={formData.contactInfo.contact || ''} />
        <input placeholder="Email" onChange={e => setFormData({ ...formData, contactInfo: { ...formData.contactInfo, email: e.target.value } })} value={formData.contactInfo.email || ''} />
        <input placeholder="Address" onChange={e => setFormData({ ...formData, contactInfo: { ...formData.contactInfo, address: e.target.value } })} value={formData.contactInfo.address || ''} />
      </div>

<div>
  <h3>Skills</h3>
  {formData.skills.map((skill, i) => (
    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ cursor: 'pointer' }} onClick={() => deleteItem('skills', i)}>🗑️</span>
      <input
        value={skill}
        onChange={e => handleArrayChange('skills', i, e.target.value)}
        style={{ flex: 1 }}
      />
    </div>
  ))}
  <button onClick={() => addField('skills')}>Add Skill</button>
</div>

<div>
  <h3>Languages</h3>
  {formData.languages.map((lang, i) => (
    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ cursor: 'pointer' }} onClick={() => deleteItem('languages', i)}>🗑️</span>
      <input
        value={lang}
        onChange={e => handleArrayChange('languages', i, e.target.value)}
        style={{ flex: 1 }}
      />
    </div>
  ))}
  <button onClick={() => addField('languages')}>Add Language</button>
</div>


      <div>
        <h3>About Me</h3>
        <textarea value={formData.aboutMe} onChange={e => setFormData({ ...formData, aboutMe: e.target.value })} />
      </div>

<div>
  <h3>Experience</h3>
  {formData.experience.map((exp, i) => (
    <div key={i} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      <div style={{ textAlign: 'right' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => deleteItem('experience', i)}>🗑️</span>
      </div>
      <input
        placeholder="From - To"
        value={exp.duration || ''}
        onChange={e => updateField('experience', i, 'duration', e.target.value)}
      />
      <input
        placeholder="Company Name"
        value={exp.company || ''}
        onChange={e => updateField('experience', i, 'company', e.target.value)}
      />
      <input
        placeholder="Job Role"
        value={exp.role || ''}
        onChange={e => updateField('experience', i, 'role', e.target.value)}
      />
      <select
        value={exp.type || ''}
        onChange={e => updateField('experience', i, 'type', e.target.value)}
      >
        <option value="">Select Type</option>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Intern">Intern</option>
      </select>
      <input
        placeholder="Skills Used"
        value={exp.skills || ''}
        onChange={e => updateField('experience', i, 'skills', e.target.value)}
      />
      <input
        placeholder="Location"
        value={exp.location || ''}
        onChange={e => updateField('experience', i, 'location', e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={exp.description || ''}
        onChange={e => updateField('experience', i, 'description', e.target.value)}
      />
    </div>
  ))}
  <button onClick={() => setFormData({ ...formData, experience: [...formData.experience, {}] })}>Add Experience</button>
</div>


<div>
  <h3>Projects</h3>
  {formData.projects.map((proj, i) => (
    <div key={i} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      <div style={{ textAlign: 'right' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => deleteItem('projects', i)}>🗑️</span>
      </div>
      <input
        placeholder="From - To"
        value={proj.duration || ''}
        onChange={e => updateField('projects', i, 'duration', e.target.value)}
      />
      <input
        placeholder="Project Name"
        value={proj.name || ''}
        onChange={e => updateField('projects', i, 'name', e.target.value)}
      />
      <select
        value={proj.type || ''}
        onChange={e => updateField('projects', i, 'type', e.target.value)}
      >
        <option value="">Select Type</option>
        <option value="Major">Major</option>
        <option value="Minor">Minor</option>
        <option value="Mini">Mini</option>
      </select>
      <input
        placeholder="Skills Used"
        value={proj.skills || ''}
        onChange={e => updateField('projects', i, 'skills', e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={proj.description || ''}
        onChange={e => updateField('projects', i, 'description', e.target.value)}
      />
    </div>
  ))}
  <button onClick={() => setFormData({ ...formData, projects: [...formData.projects, {}] })}>Add Project</button>
</div>



<div>
  <h3>Certifications</h3>
  {formData.certifications.map((cert, i) => (
    <div key={i} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      <div style={{ textAlign: 'right' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => deleteItem('certifications', i)}>🗑️</span>
      </div>
      <input
        placeholder="From - To"
        value={cert.duration || ''}
        onChange={e => updateField('certifications', i, 'duration', e.target.value)}
      />
      <input
        placeholder="Certificate Name"
        value={cert.name || ''}
        onChange={e => updateField('certifications', i, 'name', e.target.value)}
      />
    </div>
  ))}
  <button onClick={() => setFormData({ ...formData, certifications: [...formData.certifications, {}] })}>Add Certification</button>
</div>



<div>
  <h3>Education</h3>
  {formData.education.map((edu, i) => (
    <div key={i} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      <div style={{ textAlign: 'right' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => deleteItem('education', i)}>🗑️</span>
      </div>
      <input
        placeholder="From - To"
        onChange={e => {
          const updated = [...formData.education];
          updated[i] = { ...updated[i], duration: e.target.value };
          setFormData({ ...formData, education: updated });
        }}
        value={edu?.duration || ''}
      />
      <input
        placeholder="University"
        onChange={e => {
          const updated = [...formData.education];
          updated[i] = { ...updated[i], university: e.target.value };
          setFormData({ ...formData, education: updated });
        }}
        value={edu?.university || ''}
      />
      <input
        placeholder="Branch"
        onChange={e => {
          const updated = [...formData.education];
          updated[i] = { ...updated[i], branch: e.target.value };
          setFormData({ ...formData, education: updated });
        }}
        value={edu?.branch || ''}
      />
      <input
        placeholder="CGPA"
        onChange={e => {
          const updated = [...formData.education];
          updated[i] = { ...updated[i], cgpa: e.target.value };
          setFormData({ ...formData, education: updated });
        }}
        value={edu?.cgpa || ''}
      />
    </div>
  ))}
  <button onClick={() => setFormData({ ...formData, education: [...formData.education, {}] })}>Add Education</button>
</div>


      <div>
        <button className="save" onClick={handleSave}>Save</button>
        <button className="download" onClick={downloadPdf}>Download PDF</button>
      </div>
    </div>
    </div>
  );
}

export default ResumeBuilder;
