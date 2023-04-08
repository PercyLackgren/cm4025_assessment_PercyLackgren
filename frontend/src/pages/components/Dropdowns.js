import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';

const Dropdowns = ({ field }) => {
  const [dropdowns, setDropdowns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/dropdowns/field/preset_rate");
        setDropdowns(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [field]);

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedDropdowns = [...dropdowns];
    updatedDropdowns[index] = { ...updatedDropdowns[index], [name]: value };
    setDropdowns(updatedDropdowns);
  };

  const handleSaveClick = async (id) => {
    const dropdownToUpdate = dropdowns.find((dropdown) => dropdown._id === id);
    try {
      const response = await axiosInstance.put(`/dropdowns/${id}`, dropdownToUpdate);
      alert(response.data.msg);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <br/>
        <h2 className="heading--border">Manage Employee Preset Rates</h2>
        <table>
            <thead>
            <tr className='tr-quote'>
                <th>Name</th>
                <th>Value</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {dropdowns.map((dropdown, index) => (
                <tr key={dropdown._id} className='tr-quote'>
                <td>
                    <input
                    type="text"
                    name="name"
                    value={dropdown.name}
                    onChange={(event) => handleInputChange(event, index)}
                    />
                </td>
                <td>
                    <input
                    type="text"
                    name="value"
                    value={dropdown.value}
                    onChange={(event) => handleInputChange(event, index)}
                    />
                </td>
                <td>
                    <button onClick={() => handleSaveClick(dropdown._id)}>Save</button>
                    {/* <button onClick={() => handleDeleteClick(dropdown._id)}>Delete</button> */}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
  );
};

export default Dropdowns;
