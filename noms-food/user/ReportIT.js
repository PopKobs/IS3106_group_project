const firebase = require('firebase');
import firebase from "firebase/app";

const database = firebase.firestore();

const reportNewTicket = async () => {
    try{
    const username = prompt("Enter Full Name");
    const title = prompt("Enter a ticket title");
    const description = prompt("Enter Ticket Description");
    const status = "open";
    const reportedDate = new Date();
    const closingDate = null;
    const ticketId = 1;

    const collectionRef = collection(db, "ITTicket");
    const payload = (ticketId, username, title, description, status, reportedDate, closingDate);
    const docRef = addDoc(collectionRef, payload);
    console.log("Ticket reported Successfully. TicketID: ",docRef.ticketId);
    } catch (error) {
        console.error("Error in creating Ticket:", error)
    }
}