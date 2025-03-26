import { FiBookOpen, FiCheckCircle, FiHome, FiList, FiLock, FiUsers, FiFile, FiDollarSign } from 'react-icons/fi';

const navConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <FiHome />,
  },
  {
    title: 'Courts',
    path: '/courts',
    icon: <FiBookOpen />,
  },
  // {
  //   title: 'Authors',
  //   path: '/authors',
  //   icon: <FiUsers />,
  // },
 

  // {
  //   title: 'Fines',
  //   path: '/manage-fines',
  //   icon: <FiDollarSign />,
  // },
  // {
  //   title: 'Users',
  //   path: '/users',
  //   icon: <FiLock />,
  // },
  // {
  //   title: 'Rules',
  //   path: '/rules',
  //   icon: <FiFile />,
  // },
];

export default navConfig;
