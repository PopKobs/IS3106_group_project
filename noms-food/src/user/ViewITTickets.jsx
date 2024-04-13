import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  Typography,
  Container,
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  ListItemSecondaryAction
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';


function ViewITTickets() {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      if (currentUser) {
        setLoading(true);
        const ticketsCollection = collection(db, 'ITTicket');
        const q = query(ticketsCollection, where('reportedUser.uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const fetchedTickets = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert the reportedDate to a Date object if it's a Firestore Timestamp
          reportedDate: doc.data().reportedDate?.toDate()
        }));
        setTickets(fetchedTickets);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [currentUser]);

  const handleOpenDetails = (ticket) => {
    setSelectedTicket(ticket);
    setDetailDialogOpen(true); // Open the dialog
  };

  const handleCloseDetails = () => {
    setDetailDialogOpen(false); // Close the dialog
  };

  if (loading) {
    return <Typography>Loading tickets...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box width="100%" bgcolor="background.paper" borderRadius={2} boxShadow={3}>
        <Box p={3} textAlign="center">
          <Typography variant="h4" component="h1" gutterBottom>
            My IT Tickets
          </Typography>
        </Box>
        <Divider />
        <List>
          {tickets.length > 0 ? (
            tickets.map((ticket, index) => (
              <React.Fragment key={ticket.id}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleOpenDetails(ticket)}>
                      <VisibilityIcon />
                    </IconButton>
                  }
                >
                  <CardContent>
                    <Typography variant="h6">{ticket.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Reported on: {ticket.reportedDate?.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">{ticket.description}</Typography>
                  </CardContent>
                </ListItem>
                {index < tickets.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <CardContent>
              <Typography>No tickets reported.</Typography>
            </CardContent>
          )}
        </List>
      </Box>


      {/* Dialog for ticket details */}
      <Dialog open={detailDialogOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        <DialogTitle>IT Ticket Details</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{selectedTicket?.title}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Reported on: {selectedTicket?.reportedDate?.toLocaleString()} 
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {selectedTicket?.description}
          </Typography>
          {/* You can add more details here */}
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default ViewITTickets;
