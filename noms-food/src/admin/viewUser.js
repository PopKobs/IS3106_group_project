import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import SearchIcon from '@mui/icons-material/Search';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore();
      const usersRef = collection(db, "Users");
      const q = filter === 'all' ? usersRef : query(usersRef, where("type", "==", filter));
      const querySnapshot = await getDocs(q);
      const userList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    };

    fetchUsers();
  }, [filter]);

  return (
    <Paper sx={{ margin: 'auto', overflow: 'hidden', marginTop: '64px' }}>
      <FormControl  sx={{ margin: 2, width: '20%' }}>
        <InputLabel id="role-filter-label">Filter by role</InputLabel>
        <Select
            labelId="role-filter-label"
            id="role-filter"
            value={filter}
            label="Filter by role"
            onChange={(event) => setFilter(event.target.value)}
        >
            <MenuItem value="all">All Users</MenuItem>
            <MenuItem value="Customer">Customer</MenuItem>
            <MenuItem value="Vendor">Vendor</MenuItem>
        </Select>
        </FormControl>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.contact}</TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell sx={{ color: user.status === 'Disabled' ? 'red' : 'green' }}>
                  {user.status}
                </TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary">
                    <BlockIcon />
                  </IconButton>
                  <IconButton>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AdminUsersPage;
