import React, { useEffect, useState } from 'react';
import {
    TableContainer, Table, TableHead, TableBody, TableRow,
    Checkbox, Grid, Paper, TextField, Button, TableCell
} from '@material-ui/core';
import MainCard from '../../../ui-component/cards/MainCard';
import axios from "axios";
import Skeleton from '@material-ui/core/Skeleton';
import { gridSpacing } from '../../../store/constant';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import configData from '../../../config';

const PermissionByRoleEdit = () => {
    const { id } = useParams();
    const location = useLocation();
    const { role } = location.state;
    const [data, setData] = useState([]);
    const [dataToSend, setdataToSend] = useState([]);
    const [permission, setPermission] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState({ color: '', msg: '' });
    useEffect(() => {
        getRole();
    }, [id]);

    useEffect(() => {
        applyFilters();
    }, [permission, searchTerm]);

    const getRole = () => {
        let Lantern = localStorage.getItem('Lantern-account')
        let tokenObj = JSON.parse(Lantern)
        let token = tokenObj.token

        axios.get(`http://localhost:3000/api/v1/roles/${id}`, {
            headers: {
                'Authorization': JSON.parse(token)
            }
        })
            .then((res) => {
                setData(res.data.permissions.map(e => e.perm_name));
            })
            .catch((err) => console.log(err.response));
    };
    const editRolePermission = () => {
        let Lantern = localStorage.getItem('Lantern-account')
        let tokenObj = JSON.parse(Lantern)
        let token = tokenObj.token
        console.log(dataToSend)
        axios.put(configData.API_SERVER + `roles/permissions/${id}`, {
            headers: {
                'Authorization': JSON.parse(token)
            }
        })
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => console.log(err.response));
    };
    const handleSuccess = (message) => {
        setSnackbarMessage({ color: "green", msg: message });
        setSnackbarOpen(true);
    };

    const applyFilters = () => {
        const filtered = permission.filter(user =>
            user.Action.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };
    const handleCheckboxChange = (action, index, checked) => {
        const updatedUsers = [...permission];
        updatedUsers[index][action] = checked;
        setPermission(updatedUsers);

        const actionMappings = {
            'Utilisateurs': [1, 2, 3, 4, 5],
            'Role': [6, 7, 8, 9, 10],
            'Permissions': [11, 12, 13, 14, 15],
            'Paths': [16, 17, 18, 19, 20],
            'Cours': [21, 22, 23, 24, 25]
        };

        const data = [];

        updatedUsers.forEach(user => {
            const mappings = actionMappings[user.Action];
            if (mappings) {
                if (user.Ajouter) data.push(mappings[0]);
                if (user.Modifier) data.push(mappings[1]);
                if (user.get) data.push(mappings[2]);
                if (user.getAll) data.push(mappings[3]);
                if (user.Supprimer) data.push(mappings[4]);
            }
        });

        setdataToSend(data);
    };




    useEffect(() => {
        setPermission([
            { id: 1, Action: 'Utilisateurs', ...getDefaultPermissions('user') },
            { id: 6, Action: 'Role', ...getDefaultPermissions('role') },
            { id: 2, Action: 'Permissions', ...getDefaultPermissions('permissions') },
            { id: 3, Action: 'Paths', ...getDefaultPermissions('path') },
            { id: 5, Action: 'Cours', ...getDefaultPermissions('lesson') },
        ]);
    }, [data]);

    const getDefaultPermissions = (prefix) => ({
        get: data.includes(`${prefix}_get`),
        getAll: data.includes(`${prefix}_get_all`),
        Supprimer: data.includes(`${prefix}_delete`),
        Modifier: data.includes(`${prefix}_update`),
        Ajouter: data.includes(`${prefix}_add`)
    });

    return (
        <MainCard title={`Edit Permission de rôle (${role})`} >
            <Grid container justifyContent="flex-end" item xs={12}>
                <Button variant="outlined" color="primary" onClick={editRolePermission}>
                    Edite Un Role
                </Button>
            </Grid>
            <TextField
                label="Recherche"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
                margin="normal"
            />
            {
                permission.length ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Action</TableCell>
                                    <TableCell>Obtenir</TableCell>
                                    <TableCell>Obtenir Tout</TableCell>
                                    <TableCell>Ajouter</TableCell>
                                    <TableCell>Modifier</TableCell>
                                    <TableCell>Supprimer</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, i) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.Action}</TableCell>
                                        <TableCell><Checkbox checked={row.get} onChange={(event) => handleCheckboxChange('get', i, event.target.checked)} /></TableCell>
                                        <TableCell><Checkbox checked={row.getAll} onChange={(event) => handleCheckboxChange('getAll', i, event.target.checked)} /></TableCell>
                                        <TableCell><Checkbox checked={row.Ajouter} onChange={(event) => handleCheckboxChange('Ajouter', i, event.target.checked)} /></TableCell>
                                        <TableCell><Checkbox checked={row.Modifier} onChange={(event) => handleCheckboxChange('Modifier', i, event.target.checked)} /></TableCell>
                                        <TableCell><Checkbox checked={row.Supprimer} onChange={(event) => handleCheckboxChange('Supprimer', i, event.target.checked)} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    [0, 1, 2, 3, 4].map((e) => (
                        <Grid item xs={12} margin={2} key={e}>
                            <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                                <Grid item xs zeroMinWidth>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Skeleton variant="text" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rect" height={20} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Skeleton variant="rect" height={50} width={80} />
                                </Grid>
                            </Grid>
                        </Grid>
                    ))
                )
            }
            <div>
                <Button onClick={() => handleChangePage(null, page - 1)} disabled={page === 1}>Précédent</Button>
                <Button onClick={() => handleChangePage(null, page + 1)} disabled={page >= Math.ceil(filteredUsers.length / rowsPerPage)}>Suivant</Button>
                <span>Page {page} of {Math.ceil(filteredUsers.length / rowsPerPage)}</span>
                <select value={rowsPerPage} onChange={handleChangeRowsPerPage}>
                    {[5, 10, 25].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </MainCard >
    );
};

export default PermissionByRoleEdit;
