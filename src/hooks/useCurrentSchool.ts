import { useSelector } from 'react-redux';
import { RootState } from '../features/store';

export const useCurrentSchool = () => {
  const school = useSelector((state: RootState) => state.auth.school);
  const user = useSelector((state: RootState) => state.auth.user);
  
  return {
    schoolId: school?.id,
    school,
    isSchoolStaff: user?.user_type === 'school_staff' || user?.user_type === 'admin',
  };
};
