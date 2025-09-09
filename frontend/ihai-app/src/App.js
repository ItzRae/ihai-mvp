import React, { useStat, useEffect } from 'react';
import api from './api';

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'volunteer',
    password: ''
  });

  const fetchUsers = async () => {
    const response = await api.get('/users/');
    setUsers(response.data);
  };

  useEffect(() => { // when app loads, fetch users data from fastapi backend
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/users/', formData);
    fetchUsers(); // fetch user db, refresh user list so always updated on frontend side
    setFormData({ 
      name: '', 
      email: '', 
      role: 'volunteer', 
      password: '' }); // reset form
  };


}


export default App;
