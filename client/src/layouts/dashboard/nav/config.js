import { FiBookOpen, FiCheckCircle, FiHome, FiList, FiLock, FiUsers, FiFile, FiDollarSign, FiLayout, FiCalendar } from 'react-icons/fi';

const navConfig = [
  {
    title: 'User Management',
    path: '/usermanagement',
    icon: <FiUsers />,
    adminOnly: true, // Add this flag to indicate this route is for admins only
  },
  {
    title: 'Courts',
    path: '/courts',
    icon: <FiLayout  />,
  },
  {
    title: 'Booking',
    path: '/booking-history',
    icon: <FiCalendar />,
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