import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { AppCurrentVisits, AppWebsiteVisits, AppWidgetSummary } from './index';
import { useAuth } from '../../../hooks/useAuth';
import CountUp from 'react-countup';

export default function DashboardAppPage() {
  const { user } = useAuth();
  const theme = useTheme();
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [returnedBooks, setReturnedBooks] = useState(0);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total books count
        const totalBooksResponse = await axios.get('http://localhost:8080/api/auth/totalBooks');
        if (totalBooksResponse.data.totalBooks !== undefined) {
          setTotalBooks(totalBooksResponse.data.totalBooks);
        }

        // Fetch total users count
        const totalUsersResponse = await axios.get('http://localhost:8080/api/auth/totalUsers');
        if (totalUsersResponse.data.totalUsers !== undefined) {
          setTotalUsers(totalUsersResponse.data.totalUsers);
        }

        // Fetch returned books count for today
        const returnedBooksResponse = await axios.get('http://localhost:8080/api/auth/returnedBooks');
        if (returnedBooksResponse.data.returnedBooks !== undefined) {
          setReturnedBooks(returnedBooksResponse.data.returnedBooks);
        }

        // Fetch borrowed books count for today
        const totalBorrowedBooksResponse = await axios.get('http://localhost:8080/api/auth/totalBorrowedBooks');
        if (totalBorrowedBooksResponse.data.totalBorrowedBooks !== undefined) {
          setTotalBorrowedBooks(totalBorrowedBooksResponse.data.totalBorrowedBooks);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title> Library | Dashboard </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi {user.name}, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Books"
              total={<CountUp start={0} end={totalBooks} duration={2.5} />}
              icon={'solar:book-bold'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Users"
              total={<CountUp start={0} end={totalUsers} duration={2.5} />}
              color="info"
              icon={'mdi:user'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Book Returned"
              total={<CountUp start={0} end={returnedBooks} duration={2.5} />}
              color="warning"
              icon={'carbon:return'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Borrowed"
              total={<CountUp start={0} end={totalBorrowedBooks} duration={2.5} />}
              color="error"
              icon={'ph:hand-fill'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2024',
                '02/02/2024',
                '03/03/2024',
                '04/04/2024',
                '05/05/2024',
                '06/06/2024',
                '07/07/2024',
                '08/08/2024',
                '09/09/2024',
                '10/10/2024',
                '11/11/2024',
              ]}
              chartData={[
                {
                  name: 'K16',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'K17',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'K18',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'Ha Noi', value: 4344 },
                { label: 'TP HCM', value: 5435 },
                { label: 'Da Nang', value: 1954 },
                { label: 'Can Tho', value: 2349 },
                { label: 'Quy Nhon', value: 3836 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
                theme.palette.success.main,
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
