import React from 'react'
import { useAuth } from '../contexts/authContext'
import { db } from '../firebase/firebase';
import { collection, addDoc } from "firebase/firestore";

const reportNewTicket = async (ticketData) => {
    
    try{
    const collectionRef = collection(db, "ITTicket");
    const docRef = addDoc(collectionRef, ticketData);
    console.log("Ticket reported Successfully. TicketID: ",docRef.ticketId);
    } catch (error) {
        console.error("Error in creating Ticket:", error)
    }
}

function TicketForm() {
    const { currentUser } = useAuth();
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const username = prompt("Enter Full Name");
        const title = prompt("Enter a ticket title");
        const description = prompt("Enter Ticket Description");
        const status = "open";
        const reportedDate = new Date();
        const closingDate = null;
        const ticketId = 1;
        const reportedUser = currentUser;
  
        await reportNewTicket({ // Call the reportNewTicket function with ticket details
          ticketId,
          username,
          title,
          description,
          status,
          reportedDate,
          closingDate,
          reportedUser
        });
        
        alert("Ticket reported Successfully."); // Display success message
      } catch (error) {
        console.error("Error in creating Ticket:", error);
        alert("Error in creating Ticket. Please try again."); // Display error message
      }
    };
  
    return (
      <div>
        <h2>Report a New IT Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Full Name:</label>
            <input type="text" disabled />
            {/* The input is disabled to prevent users from changing their name */}
          </div>
          <div>
            <label>Ticket Title:</label>
            <input type="text" required />
          </div>
          <div>
            <label>Ticket Description:</label>
            <textarea required />
          </div>
          <button type="submit">Submit Ticket</button>
        </form>
      </div>
    );
  }
  
  export default TicketForm;