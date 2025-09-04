// Utility function to clear invalid school data from localStorage
export const clearInvalidSchoolData = () => {
  const schoolStr = localStorage.getItem('school');
  if (schoolStr) {
    try {
      const school = JSON.parse(schoolStr);
      if (school && school.id === 'default') {
        localStorage.removeItem('school');
        console.log('Cleared invalid default school data from localStorage');
      }
    } catch (error) {
      console.error('Error parsing school data:', error);
      localStorage.removeItem('school');
    }
  }
};

// Call this function on app startup to clear any invalid data
clearInvalidSchoolData();
