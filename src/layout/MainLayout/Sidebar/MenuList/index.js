import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import NavGroup from './NavGroup';
import menuItem from './../../../../menu-items';
import { useDispatch, useSelector } from 'react-redux';

const MenuList = () => {
    const customization = useSelector((state) => state.customization);
    const [loading, setLoading] = useState(true);
    const [menuItems, setMenuItems] = useState([]);
    useEffect(() => {
        filterMenuItems();
    }, [customization.variable]);

    const filterMenuItems = () => {
        try {
            // Retrieve data from localStorage
            const storedVariable = localStorage.getItem('Lantern-account');

            // Parse the retrieved data as JSON
            const data = JSON.parse(storedVariable);

            let permissions;
            // Check if permissions are available in the data, otherwise use a fallback value
            if (customization.variable.length > 0) {
                permissions = customization.variable;
            } else {
                permissions = data.perm; // It seems like customization is a global variable
            }


            // Filter the second array of menu items based on permissions
            const filteredSecondArray = menuItem.items[1]?.children?.filter(child => {
                const permissionNeeded = `${child.id}_get_all`;
                return permissions.includes(permissionNeeded);
            });


            // Update menu items state with the filtered second array
            setMenuItems([
                menuItem.items[0],
                { ...menuItem.items[1], children: filteredSecondArray || [] },
                menuItem.items[2],
            ]);
        } catch (error) {
            console.error('Error filtering menu items:', error);
        } finally {
            setLoading(false); // Set loading state to false regardless of try/catch outcome
        }
    };


    const renderMenuItems = () => {
        if (loading) {
            return (
                <Typography variant="h6" color="error" align="center">
                    Loading...
                </Typography>
            );
        } else {
            return menuItems.map(item => {
                switch (item.type) {
                    case 'group':
                        return <NavGroup key={item.id} item={item} />;
                    default:
                        return (
                            <Typography key={item.id} variant="h6" color="error" align="center">
                                Menu Items Error
                            </Typography>
                        );
                }
            });
        }
    };

    return renderMenuItems();
};

export default MenuList;
