import React, { useState } from 'react';
import axios from 'axios';

const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    phoneNumber: '',
    department: 'HR',
    dateOfJoining: '',
    role: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const departments = ['HR', 'Engineering', 'Marketing', 'Sales'];

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.employeeId) errors.employeeId = 'Employee ID is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';
    if (!formData.dateOfJoining) errors.dateOfJoining = 'Date of Joining is required';
    if (!formData.role) errors.role = 'Role is required';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/employees', formData);
      setSuccessMessage('Employee added successfully');
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data || 'Error adding employee');
      setSuccessMessage('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block">Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="border rounded p-2 w-full" />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="employeeId" className="block">Employee ID</label>
        <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} className="border rounded p-2 w-full" />
        {errors.employeeId && <p className="text-red-500">{errors.employeeId}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="border rounded p-2 w-full" />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="phoneNumber" className="block">Phone Number</label>
        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="border rounded p-2 w-full" />
        {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}
      </div>
      <div>
        <label htmlFor="department" className="block">Department</label>
        <select name="department" value={formData.department} onChange={handleChange} className="border rounded p-2 w-full">
          {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="dateOfJoining" className="block">Date of Joining</label>
        <input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} className="border rounded p-2 w-full" />
        {errors.dateOfJoining && <p className="text-red-500">{errors.dateOfJoining}</p>}
      </div>
      <div>
        <label htmlFor="role" className="block">Role</label>
        <input type="text" name="role" value={formData.role} onChange={handleChange} className="border rounded p-2 w-full" />
        {errors.role && <p className="text-red-500">{errors.role}</p>}
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
      <button type="reset" onClick={() => setFormData({
        name: '',
        employeeId: '',
        email: '',
        phoneNumber: '',
        department: 'HR',
        dateOfJoining: '',
        role: ''
      })} className="bg-gray-500 text-white p-2 rounded">Reset</button>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </form>
  );
};

export default AddEmployeeForm;
