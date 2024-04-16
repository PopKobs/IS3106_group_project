import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Button, Typography, Container, List, ListItem, ListItemText, Divider, TextField, Paper } from '@mui/material';

const getAllTickets = async () => {
  try {
    const ticketsCollection = collection(db, "ITTicket");
    const ticketSnapshot = await getDocs(ticketsCollection);
    return ticketSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};

const AdminTicketView = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      const fetchedTickets = await getAllTickets();
      setTickets(fetchedTickets);
    };

    fetchTickets();
  }, []);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setReply('');
  };

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleResolve = async () => {
    if (selectedTicket && reply) {
      try {
        const ticketRef = doc(db, "ITTicket", selectedTicket.id);
        await updateDoc(ticketRef, {
          status: 'closed',
          reply,
          closingDate: new Date()
        });
        alert("Ticket resolved and reply sent.");
        setSelectedTicket(null);
        setReply('');
        // Optionally refresh the tickets list
      } catch (error) {
        console.error("Error updating ticket:", error);
        alert("Failed to resolve ticket. Please try again.");
      }
    } else {
      alert("Please enter a reply before resolving.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2, backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Admin IT Ticket Management
        </Typography>
        <List>
          {tickets.map((ticket) => (
            <ListItem button onClick={() => handleSelectTicket(ticket)} key={ticket.id}>
              <ListItemText primary={`Ticket ID: ${ticket.id} - ${ticket.title}`} secondary={`Status: ${ticket.status}`} />
            </ListItem>
          ))}
        </List>
        {selectedTicket && (
          <Container>
            <Typography variant="h5" sx={{ mt: 2 }}>Selected Ticket Details</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography><b>Title:</b> {selectedTicket.title}</Typography>
            <Typography><b>Description:</b> {selectedTicket.description}</Typography>
            <Typography><b>User ID:</b> {selectedTicket.reportedUser.uid}</Typography>
            <Typography><b>Username:</b> {selectedTicket.reportedUser.displayName}</Typography>
            <Typography><b>Reported Date:</b> {selectedTicket.reportedDate.toLocaleString()}</Typography>
            <TextField
              label="Reply"
              multiline
              rows={4}
              fullWidth
              value={reply}
              onChange={e => setReply(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleResolve} sx={{ mt: 2 }}>
              Resolve and Send Reply
            </Button>
          </Container>
        )}
      </Paper>
    </Container>
  );
};

export default AdminTicketView;