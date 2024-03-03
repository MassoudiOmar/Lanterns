import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Paper } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import MainCard from '../../ui-component/cards/MainCard';
import axios from "axios"

const SamplePage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        axios.get('http://localhost:3000/api/v1/users', {
            headers: {
                'Authorization': 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZV9pZCI6MSwiZW1haWwiOiJhZG1pbkBsYW50ZXJucy5hY2FkZW15IiwicGFzc3dvcmQiOiIkMmEkMTAkNWFRazNjUXNXM0xkaDltMHpoRlgyZS9pTC40dTBuY0FQLlM3Lkx4d2c0bEJXMnZlNVh3RC4iLCJmdWxsbmFtZSI6IkFkbWluIiwicGhvbmUiOiIwMDAwMDAwMDAiLCJjcmVhdGVkQXQiOiIyMDIzLTA4LTI4VDEyOjA2OjI4LjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA4LTI4VDEyOjA2OjI4LjAwMFoiLCJpYXQiOjE3MDk0NzUyNDUsImV4cCI6MTcxMjA2NzI0NX0.HA4STEOzTQvgCpDzvFCIlXtJSI9IttZbjXnG-eZmAW8'
            }
        })
        .then((res) => setUsers(res.data))
        .catch((err) => console.log(err))
    }

    return (
        <MainCard title="Sample Page">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.fullname}</TableCell>
                                <TableCell>{row.phone}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>
                                    <IconButton aria-label="edit">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
};

export default SamplePage;
