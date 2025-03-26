import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box } from '@mui/material';

export default function LibraryRulesPage() {
  return (
    <>
      <Helmet>
        <title>Library Rules | Library</title>
      </Helmet>

      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography variant="h3" gutterBottom>
          Library Rules
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            General Conduct
          </Typography>
          <Typography paragraph>
            - Maintain silence inside the library.
            <br />
            - Eating and drinking are not allowed inside the library.
            <br />
            - Mobile phones must be on silent mode.
            <br />
            - Respect library property and handle books with care.
            <br />
            - Do not disturb other patrons during library hours.
            <br />
            - Do not share personal belongings with other patrons.
            <br />
            - Do not use the library's Wi-Fi during library hours.
            <br />
            - Do not share personal information with other patrons.
            <br />
            - Do not give away personal belongings.
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Borrowing Books
          </Typography>
          <Typography paragraph>
            - Library cards must be presented when borrowing books.
            <br />
            - A maximum of 5 books can be borrowed at a time.
            <br />
            - Books must be returned within the due date to avoid fines.
            <br />
            - Reference books and periodicals cannot be borrowed.
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Returning Books
          </Typography>
          <Typography paragraph>
            - Books should be returned on or before the due date.
            <br />
            - Overdue books will attract a fine of 1.000đ per day.
            <br />
            - Damaged or lost books must be replaced or paid for.
            <br />
            - Books must be returned in their original condition.
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Computer and Internet Use
          </Typography>
          <Typography paragraph>
            - Computers are available for educational and research purposes.
            <br />
            - Internet usage is restricted to academic-related activities.
            <br />
            - Do not install or download unauthorized software.
            <br />
            - Do not share personal information with unauthorized parties.
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Reviewing Books
          </Typography>
          <Typography paragraph>
            - When writing reviews must be honest.
            <br />
            - Do not use lashes and insults an individual or organization.
            <br />
            - No spam when evaluating books.
            <br />
            - Be respectful of the book's author's opinion.
            <br />
            - All reviews must be strictly controlled.
          </Typography>
        </Box>
      </Container>
    </>
  );
}
