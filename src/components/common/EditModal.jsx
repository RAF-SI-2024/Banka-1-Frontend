import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

const EditModal = ({ open, onClose, data, formFields, onSave, title }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        birthDate: data.birthDate ? formatLogDate(data.birthDate) : "" // Format the birthDate correctly
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    const newErrors = {};
    formFields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Transform the birthDate before saving
    if (formData.birthDate) {
      formData.birthDate = transformDateForApi(formData.birthDate);
    }


    onSave(formData); // Call onSave with the transformed data
  };

  const formatLogDate = (log) => {
    // Check if it's a valid date string or timestamp
    if (typeof log === "string" || typeof log === "number") {
      let strLog = String(log);

      // If the date is in 'DDMMYYYY' format (e.g., 01011970)
      if (strLog.length === 8) {
        const year = strLog.slice(4, 8);
        const month = strLog.slice(2, 4);
        const day = strLog.slice(0, 2);

        return `${year}-${month}-${day}`; // Format as 'YYYY-MM-DD'
      }

      // If it's a timestamp or date in any other valid format, ensure it's in 'YYYY-MM-DD'
      const date = new Date(strLog);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
      }
    }

    return log; // Return as-is if it's not in a recognized format
  };


  const transformDateForApi = (dateString) => {
    if (!dateString) return null;

    if (typeof dateString !== 'string') {
      if (typeof dateString === 'number') {
        // If it's a timestamp, convert it to a string and format
        dateString = new Date(dateString).toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
      } else {
        console.error('Expected a string or number for dateString, but got:', typeof dateString);
        return null;
      }
    }

    try {
      // Expecting "DD-MM-YYYY" => split by '-'
      const [day, month, year] = dateString.split('-');

      if (!day || !month || !year) return null;

      return `${year}-${month}-${day}`; // "YYYY-MM-DD"
    } catch (error) {
      console.error('Error converting date:', error);
      return null;
    }
  };


  return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {formFields.map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      type={field.type || 'text'}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      error={!!errors[field.name]}
                      helperText={errors[field.name]}
                  />
                </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default EditModal;
