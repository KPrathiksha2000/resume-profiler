import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function ResumeBuilder() {
  const [user, setUser] = useState({ name: '', email: '' });
const [formData, setFormData] = useState({
  photo: '',
  socialLinks: {
    linkedin: '',
    github: '',
    leetcode: '',
    hackerrank: '',
    youtube: '',
    codeschef: '',
    twitter: '',
    instagram: '',
  },
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

  const navigate = useNavigate();

const token = localStorage.getItem('token');

useEffect(() => {
  if (!token) {
    navigate('/login');
    return;
  }

  // Decode user from token
  const payload = JSON.parse(atob(token.split('.')[1]));
  setUser({ name: payload.name, email: payload.email });
  fetchUser();
  fetchResume();
}, [token]);


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

      <div>
        <h3>Social Links</h3>
        {['linkedin', 'github', 'leetcode', 'hackerrank', 'youtube', 'codeschef', 'twitter', 'instagram'].map(link => (
          <input
            key={link}
            placeholder={link}
            value={formData.socialLinks[link] || ''}
            onChange={e =>
              setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, [link]: e.target.value },
              })
            }
          />
        ))}
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
          <input key={i} value={skill} onChange={e => handleArrayChange('skills', i, e.target.value)} />
        ))}
        <button onClick={() => addField('skills')}> Add Skill</button>
      </div>

      <div>
        <h3>Languages</h3>
        {formData.languages.map((lang, i) => (
          <input key={i} value={lang} onChange={e => handleArrayChange('languages', i, e.target.value)} />
        ))}
        <button onClick={() => addField('languages')}> Add Language</button>
      </div>

      <div>
        <h3>About Me</h3>
        <textarea value={formData.aboutMe} onChange={e => setFormData({ ...formData, aboutMe: e.target.value })} />
      </div>

      <div>
        <h3>Experience</h3>
        {formData.experience.map((exp, i) => (
          <input key={i} value={exp} onChange={e => handleArrayChange('experience', i, e.target.value)} />
        ))}
        <button onClick={() => addField('experience')}> Add Experience</button>
      </div>

      <div>
        <h3>Projects</h3>
        {formData.projects.map((proj, i) => (
          <input key={i} value={proj} onChange={e => handleArrayChange('projects', i, e.target.value)} />
        ))}
        <button onClick={() => addField('projects')}> Add Project</button>
      </div>

      <div>
        <h3>Certifications</h3>
        {formData.certifications.map((cert, i) => (
          <input key={i} value={cert} onChange={e => handleArrayChange('certifications', i, e.target.value)} />
        ))}
        <button onClick={() => addField('certifications')}> Add Certification</button>
      </div>

      <div>
        <h3>Education</h3>
        {formData.education.map((edu, i) => (
          <div key={i}>
            <input placeholder="From - To" onChange={e => {
              const updated = [...formData.education];
              updated[i] = { ...updated[i], duration: e.target.value };
              setFormData({ ...formData, education: updated });
            }} value={edu?.duration || ''} />
            <input placeholder="University" onChange={e => {
              const updated = [...formData.education];
              updated[i] = { ...updated[i], university: e.target.value };
              setFormData({ ...formData, education: updated });
            }} value={edu?.university || ''} />
            <input placeholder="Branch" onChange={e => {
              const updated = [...formData.education];
              updated[i] = { ...updated[i], branch: e.target.value };
              setFormData({ ...formData, education: updated });
            }} value={edu?.branch || ''} />
            <input placeholder="CGPA" onChange={e => {
              const updated = [...formData.education];
              updated[i] = { ...updated[i], cgpa: e.target.value };
              setFormData({ ...formData, education: updated });
            }} value={edu?.cgpa || ''} />
          </div>
        ))}
        <button onClick={() => setFormData({ ...formData, education: [...formData.education, {}] })}> Add Education</button>
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
