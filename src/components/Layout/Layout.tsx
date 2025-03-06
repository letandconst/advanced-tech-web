'use client';

import * as React from 'react';
import Link from 'next/link';
import { styled, useTheme } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';
import { useThemeContext } from '@/theme/theme';

// MUI Components
import { Box, Drawer, CssBaseline, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Menu, MenuItem, Avatar, Tooltip } from '@mui/material';

import MuiAppBar, { type AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

// MUI Icons
import {
	Menu as MenuIcon,
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon,
	Dashboard as DashboardIcon,
	People as PeopleIcon,
	BarChart as BarChartIcon,
	Layers as LayersIcon,
	Settings as SettingsIcon,
	Logout as LogoutIcon,
	ExpandLess,
	ExpandMore,
	LightMode as LightModeIcon,
	DarkMode as DarkModeIcon,
	Build as BuildIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
	transition: theme.transitions.create(['margin', 'width'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: `${drawerWidth}px`,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	...theme.mixins.toolbar,
	justifyContent: 'flex-end',
}));

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
	const theme = useTheme();
	const { mode, toggleTheme } = useThemeContext();
	const [open, setOpen] = React.useState(true);

	const handleDrawerOpen = () => setOpen(true);
	const handleDrawerClose = () => setOpen(false);

	const [menuItems, setMenuItems] = React.useState([
		{ text: 'Dashboard', icon: <DashboardIcon />, path: '/', active: true },
		{ text: 'Job Orders', icon: <BuildIcon />, path: '/job-orders', active: false },
		{ text: 'Invoices', icon: <BarChartIcon />, path: '/invoices', active: false },
		{ text: 'Services', icon: <LayersIcon />, path: '/services', active: false },
		{
			text: 'Management',
			icon: <PeopleIcon />,
			active: false,
			subItems: [
				{ text: 'Mechanics', path: '/management/mechanics', active: false },
				{ text: 'Users', path: '/management/users', active: false },
			],
			open: false,
		},
	]);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const userMenuOpen = Boolean(anchorEl);

	const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
	const handleUserMenuClose = () => setAnchorEl(null);

	const handleMenuItemClick = (text: string, index: number) => {
		const newMenuItems = [...menuItems];

		// Reset all active states
		newMenuItems.forEach((item) => {
			item.active = false;
			if (item.subItems) {
				item.subItems.forEach((subItem) => {
					subItem.active = false;
				});
			}

			if (item.open) {
				item.open = false;
			}
		});

		// Set the clicked item as active
		newMenuItems[index].active = true;

		setMenuItems(newMenuItems);
	};

	const handleSubMenuItemClick = (parentIndex: number, subIndex: number) => {
		const newMenuItems = [...menuItems];

		// Reset all active states
		newMenuItems.forEach((item) => {
			item.active = false;
			item.subItems?.forEach((subItem) => {
				subItem.active = false;
			});
		});

		if (newMenuItems[parentIndex]?.subItems) {
			newMenuItems[parentIndex].subItems[subIndex].active = true;

			setMenuItems(newMenuItems);
		}
	};

	const toggleSubMenu = (index: number) => {
		const newMenuItems = [...menuItems];
		newMenuItems[index].open = !newMenuItems[index].open;
		setMenuItems(newMenuItems);
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar
				position='fixed'
				open={open}
			>
				<Toolbar>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						onClick={handleDrawerOpen}
						edge='start'
						sx={{ mr: 2, ...(open && { display: 'none' }) }}
					>
						<MenuIcon />
					</IconButton>

					<Box sx={{ ml: 'auto' }}>
						<Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
							<IconButton
								color='inherit'
								onClick={toggleTheme}
							>
								{mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
							</IconButton>
						</Tooltip>
						<IconButton
							onClick={handleUserMenuClick}
							size='small'
							sx={{ ml: 1 }}
							aria-controls={userMenuOpen ? 'account-menu' : undefined}
							aria-haspopup='true'
							aria-expanded={userMenuOpen ? 'true' : undefined}
						>
							<Avatar sx={{ bgcolor: deepPurple[500] }}>JD</Avatar>
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							id='account-menu'
							open={userMenuOpen}
							onClose={handleUserMenuClose}
							onClick={handleUserMenuClose}
							PaperProps={{
								elevation: 0,
								sx: {
									overflow: 'visible',
									filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
									mt: 1.5,
									'& .MuiAvatar-root': {
										width: 32,
										height: 32,
										ml: -0.5,
										mr: 1,
									},
									'&:before': {
										content: '""',
										display: 'block',
										position: 'absolute',
										top: 0,
										right: 14,
										width: 10,
										height: 10,
										bgcolor: 'background.paper',
										transform: 'translateY(-50%) rotate(45deg)',
										zIndex: 0,
									},
								},
							}}
							transformOrigin={{ horizontal: 'right', vertical: 'top' }}
							anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
						>
							<MenuItem
								onClick={handleUserMenuClose}
								disabled
							>
								<Avatar sx={{ bgcolor: deepPurple[500] }} /> John Doe
							</MenuItem>
							<MenuItem
								onClick={handleUserMenuClose}
								disabled
								sx={{ typography: 'body2', pl: 7, pt: 0, color: 'text.secondary' }}
							>
								john.doe@example.com
							</MenuItem>
							<Divider />
							<MenuItem onClick={handleUserMenuClose}>
								<ListItemIcon>
									<SettingsIcon fontSize='small' />
								</ListItemIcon>
								Settings
							</MenuItem>
							<MenuItem onClick={handleUserMenuClose}>
								<ListItemIcon>
									<LogoutIcon fontSize='small' />
								</ListItemIcon>
								Logout
							</MenuItem>
						</Menu>
					</Box>
				</Toolbar>
			</AppBar>
			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
					},
				}}
				variant='persistent'
				anchor='left'
				open={open}
			>
				<DrawerHeader>
					<Typography
						variant='h6'
						sx={{ flexGrow: 1, ml: 2 }}
					>
						Advanced Tech
					</Typography>
					<IconButton onClick={handleDrawerClose}>{theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
				</DrawerHeader>
				<Divider />
				<List>
					{menuItems.map((item, index) => (
						<React.Fragment key={item.text}>
							{!item.subItems ? (
								<ListItem disablePadding>
									<Link
										href={item.path!}
										passHref
										legacyBehavior
									>
										<ListItemButton
											selected={item.active}
											onClick={() => handleMenuItemClick(item.text, index)}
										>
											<ListItemIcon>{item.icon}</ListItemIcon>
											<ListItemText primary={item.text} />
										</ListItemButton>
									</Link>
								</ListItem>
							) : (
								<>
									<ListItem disablePadding>
										<ListItemButton onClick={() => toggleSubMenu(index)}>
											<ListItemIcon>{item.icon}</ListItemIcon>
											<ListItemText primary={item.text} />
											{item.open ? <ExpandLess /> : <ExpandMore />}
										</ListItemButton>
									</ListItem>
									<Collapse
										in={item.open}
										timeout='auto'
										unmountOnExit
									>
										<List
											component='div'
											disablePadding
										>
											{item.subItems.map((subItem, subIndex) => (
												<ListItem
													key={subItem.text}
													disablePadding
												>
													<Link
														href={subItem.path!}
														passHref
														legacyBehavior
													>
														<ListItemButton
															sx={{ pl: 4 }}
															selected={subItem.active}
															onClick={() => handleSubMenuItemClick(index, subIndex)}
														>
															<ListItemText primary={subItem.text} />
														</ListItemButton>
													</Link>
												</ListItem>
											))}
										</List>
									</Collapse>
								</>
							)}
						</React.Fragment>
					))}
				</List>

				<Box sx={{ flexGrow: 1 }} />
				<Divider />
				<List>
					<ListItem disablePadding>
						<ListItemButton>
							<ListItemIcon>
								<SettingsIcon />
							</ListItemIcon>
							<ListItemText primary='Settings' />
						</ListItemButton>
					</ListItem>
				</List>
			</Drawer>
			<Box
				component='main'
				sx={{
					p: 3,
					transition: theme.transitions.create('margin', {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.leavingScreen,
					}),
					flexGrow: 1,
					marginLeft: `-${drawerWidth}px`,
					...(open && {
						transition: theme.transitions.create('margin', {
							easing: theme.transitions.easing.easeOut,
							duration: theme.transitions.duration.enteringScreen,
						}),
						marginLeft: 0,

						width: `calc(100% - ${drawerWidth}px)`,
					}),
				}}
			>
				<DrawerHeader />

				{children}
			</Box>
		</Box>
	);
}
