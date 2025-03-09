'use client';

import React, { useState, useEffect, MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { styled, useTheme } from '@mui/material/styles';
import { useThemeContext } from '@/theme/theme';
import { useUser } from '@/context/UserContext';
import ProfileAvatar from '@/components/Avatar/Avatar';
// MUI Components
import { Box, Drawer, CssBaseline, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Tooltip, Menu, MenuItem, useMediaQuery, Badge, Paper } from '@mui/material';

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
	Logout as LogoutIcon,
	ExpandLess,
	ExpandMore,
	LightMode as LightModeIcon,
	DarkMode as DarkModeIcon,
	Build as BuildIcon,
	Notifications as NotificationsIcon,
	Person as PersonIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

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
	boxShadow: theme.shadows[3],
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
	justifyContent: 'space-between',
}));

const menuItems = [
	{ text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
	{ text: 'Job Orders', icon: <BuildIcon />, path: '/job-orders' },
	{ text: 'Invoices', icon: <BarChartIcon />, path: '/invoices' },
	{ text: 'Services', icon: <LayersIcon />, path: '/services' },
	{
		text: 'Management',
		icon: <PeopleIcon />,
		subItems: [
			{ text: 'Mechanics', path: '/management/mechanics' },
			{ text: 'Users', path: '/management/users' },
		],
	},
];

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
	const theme = useTheme();
	const { mode, toggleTheme } = useThemeContext();
	const pathname = usePathname();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const [open, setOpen] = useState(!isMobile);
	const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});
	const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
	const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

	const { user, logout } = useUser();

	// Set initial submenu state based on active path
	useEffect(() => {
		menuItems.forEach((item) => {
			if (item.subItems) {
				const isSubItemActive = item.subItems.some((subItem) => pathname === subItem.path);
				if (isSubItemActive) {
					setOpenSubMenus((prev) => ({ ...prev, [item.text]: true }));
				}
			}
		});
	}, [pathname]);

	// Handle responsive drawer
	useEffect(() => {
		setOpen(!isMobile);
	}, [isMobile]);

	const handleDrawerOpen = () => setOpen(true);
	const handleDrawerClose = () => setOpen(false);

	const handleSubMenuToggle = (text: string) => {
		setOpenSubMenus((prev) => ({
			...prev,
			[text]: !prev[text],
		}));
	};

	const handleUserMenuOpen = (event: MouseEvent<HTMLElement>) => {
		setUserMenuAnchor(event.currentTarget);
	};

	const handleUserMenuClose = () => {
		setUserMenuAnchor(null);
	};

	const handleLogout = async () => {
		handleUserMenuClose(); // Close menu
		await logout(); // Call logout function
	};

	const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
		setNotificationAnchor(event.currentTarget);
	};

	const handleNotificationClose = () => {
		setNotificationAnchor(null);
	};

	const isActive = (path: string) => {
		if (path === '/') {
			return pathname === path;
		}
		return pathname.startsWith(path);
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar
				position='fixed'
				open={open}
				color='default'
				elevation={1}
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

					<Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
						<Tooltip title='Notifications'>
							<IconButton
								color='inherit'
								onClick={handleNotificationOpen}
							>
								<Badge
									badgeContent={3}
									color='error'
								>
									<NotificationsIcon />
								</Badge>
							</IconButton>
						</Tooltip>

						<Menu
							anchorEl={notificationAnchor}
							open={Boolean(notificationAnchor)}
							onClose={handleNotificationClose}
							PaperProps={{
								elevation: 3,
								sx: { width: 320, maxHeight: 400, mt: 1.5 },
							}}
							transformOrigin={{ horizontal: 'right', vertical: 'top' }}
							anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
						>
							<Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
								<Typography
									variant='subtitle1'
									fontWeight='bold'
								>
									Notifications
								</Typography>
							</Box>
							{[1, 2, 3].map((item) => (
								<MenuItem
									key={item}
									onClick={handleNotificationClose}
									sx={{ py: 1.5 }}
								>
									<Box sx={{ display: 'flex', flexDirection: 'column' }}>
										<Typography
											variant='body2'
											fontWeight='medium'
										>
											New job order #{item} has been created
										</Typography>
										<Typography
											variant='caption'
											color='text.secondary'
										>
											{item} hour{item > 1 ? 's' : ''} ago
										</Typography>
									</Box>
								</MenuItem>
							))}
							<Box sx={{ p: 1, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
								<Typography
									variant='body2'
									color='primary'
									sx={{ cursor: 'pointer' }}
								>
									View all notifications
								</Typography>
							</Box>
						</Menu>

						<Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
							<IconButton
								color='inherit'
								onClick={toggleTheme}
							>
								{mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
							</IconButton>
						</Tooltip>
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
						borderRight: `1px solid ${theme.palette.divider}`,
						boxShadow: theme.shadows[1],
					},
				}}
				variant={isMobile ? 'temporary' : 'persistent'}
				anchor='left'
				open={open}
				onClose={handleDrawerClose}
			>
				<DrawerHeader>
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 1 }}>
						<Typography
							variant='h6'
							sx={{ fontWeight: 600 }}
						>
							Advanced Tech
						</Typography>
					</Box>
					<IconButton onClick={handleDrawerClose}>{theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
				</DrawerHeader>

				<Divider />

				<Box sx={{ overflow: 'auto', flexGrow: 1, py: 1 }}>
					<List
						component='nav'
						sx={{ px: 1 }}
					>
						{menuItems.map((item) => (
							<React.Fragment key={item.text}>
								{!item.subItems ? (
									<ListItem
										disablePadding
										sx={{ mb: 0.5 }}
									>
										<Link
											href={item.path}
											passHref
											style={{ width: '100%', textDecoration: 'none', color: 'inherit' }}
										>
											<ListItemButton
												sx={{
													borderRadius: 1,
													mb: 0.5,
													backgroundColor: isActive(item.path) ? theme.palette.action.selected : 'transparent',
													'&:hover': {
														backgroundColor: isActive(item.path) ? theme.palette.action.selected : theme.palette.action.hover,
													},
													position: 'relative',
													'&::before': isActive(item.path)
														? {
																content: '""',
																position: 'absolute',
																left: 0,
																top: '20%',
																height: '60%',
																width: 4,
																backgroundColor: theme.palette.primary.main,
																borderRadius: '0 4px 4px 0',
														  }
														: {},
													pl: isActive(item.path) ? 2.5 : 2,
													transition: 'all 0.2s',
												}}
											>
												<ListItemIcon
													sx={{
														color: isActive(item.path) ? theme.palette.primary.main : 'inherit',
														minWidth: 40,
													}}
												>
													{item.icon}
												</ListItemIcon>
												<ListItemText
													primary={item.text}
													primaryTypographyProps={{
														fontWeight: isActive(item.path) ? 600 : 400,
														color: isActive(item.path) ? theme.palette.primary.main : 'inherit',
													}}
												/>
											</ListItemButton>
										</Link>
									</ListItem>
								) : (
									<>
										<ListItem
											disablePadding
											sx={{ mb: 0.5 }}
										>
											<ListItemButton
												onClick={() => handleSubMenuToggle(item.text)}
												sx={{
													borderRadius: 1,
													backgroundColor: item.subItems.some((subItem) => isActive(subItem.path)) ? theme.palette.action.selected : 'transparent',
													'&:hover': {
														backgroundColor: theme.palette.action.hover,
													},
													position: 'relative',
													'&::before': item.subItems.some((subItem) => isActive(subItem.path))
														? {
																content: '""',
																position: 'absolute',
																left: 0,
																top: '20%',
																height: '60%',
																width: 4,
																backgroundColor: theme.palette.primary.main,
																borderRadius: '0 4px 4px 0',
														  }
														: {},
													pl: item.subItems.some((subItem) => isActive(subItem.path)) ? 2.5 : 2,
												}}
											>
												<ListItemIcon
													sx={{
														color: item.subItems.some((subItem) => isActive(subItem.path)) ? theme.palette.primary.main : 'inherit',
														minWidth: 40,
													}}
												>
													{item.icon}
												</ListItemIcon>
												<ListItemText
													primary={item.text}
													primaryTypographyProps={{
														fontWeight: item.subItems.some((subItem) => isActive(subItem.path)) ? 600 : 400,
														color: item.subItems.some((subItem) => isActive(subItem.path)) ? theme.palette.primary.main : 'inherit',
													}}
												/>
												{openSubMenus[item.text] ? <ExpandLess sx={{ transition: 'transform 0.3s' }} /> : <ExpandMore sx={{ transition: 'transform 0.3s' }} />}
											</ListItemButton>
										</ListItem>
										<Collapse
											in={openSubMenus[item.text]}
											timeout='auto'
											unmountOnExit
										>
											<List
												component='div'
												disablePadding
												sx={{ pl: 2, pr: 1 }}
											>
												{item.subItems.map((subItem) => (
													<ListItem
														key={subItem.text}
														disablePadding
														sx={{ mb: 0.5 }}
													>
														<Link
															href={subItem.path}
															passHref
															style={{ width: '100%', textDecoration: 'none', color: 'inherit' }}
														>
															<ListItemButton
																sx={{
																	borderRadius: 1,
																	pl: 2,
																	backgroundColor: isActive(subItem.path) ? theme.palette.action.selected : 'transparent',
																	'&:hover': {
																		backgroundColor: isActive(subItem.path) ? theme.palette.action.selected : theme.palette.action.hover,
																	},
																	position: 'relative',
																	'&::before': isActive(subItem.path)
																		? {
																				content: '""',
																				position: 'absolute',
																				left: 0,
																				top: '20%',
																				height: '60%',
																				width: 4,
																				backgroundColor: theme.palette.primary.main,
																				borderRadius: '0 4px 4px 0',
																		  }
																		: {},
																}}
															>
																<ListItemText
																	primary={subItem.text}
																	primaryTypographyProps={{
																		fontWeight: isActive(subItem.path) ? 600 : 400,
																		fontSize: '0.875rem',
																		color: isActive(subItem.path) ? theme.palette.primary.main : 'inherit',
																	}}
																/>
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
				</Box>

				<Divider />
				<Box sx={{ p: 2 }}>
					<Paper
						elevation={0}
						sx={{
							p: 2,
							borderRadius: 2,
							backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
							cursor: 'pointer',
							'&:hover': {
								backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
							},
							transition: 'background-color 0.2s',
						}}
						onClick={handleUserMenuOpen}
					>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
							{user && <ProfileAvatar user={user} />}
							<Box sx={{ minWidth: 0 }}>
								<Typography
									variant='subtitle2'
									noWrap
									fontWeight={600}
								>
									{user?.firstName} {user?.lastName}
								</Typography>
								<Typography
									variant='caption'
									color='text.secondary'
									noWrap
								>
									Administrator
								</Typography>
							</Box>
							<ExpandMore sx={{ ml: 'auto' }} />
						</Box>
					</Paper>
				</Box>

				<Menu
					anchorEl={userMenuAnchor}
					open={Boolean(userMenuAnchor)}
					onClose={handleUserMenuClose}
					PaperProps={{
						elevation: 3,
						sx: { width: 200 },
					}}
					transformOrigin={{ horizontal: 'center', vertical: 'top' }}
					anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
					sx={{ mb: 5 }}
				>
					<MenuItem
						onClick={handleUserMenuClose}
						sx={{ gap: 1.5 }}
					>
						<PersonIcon fontSize='small' />
						<Typography variant='body2'>Profile</Typography>
					</MenuItem>
					<Divider />
					<MenuItem
						onClick={handleLogout}
						sx={{ gap: 1.5 }}
					>
						<LogoutIcon fontSize='small' />
						<Typography variant='body2'>Logout</Typography>
					</MenuItem>
				</Menu>
			</Drawer>

			<Box
				component='main'
				sx={{
					flexGrow: 1,
					p: 3,
					transition: theme.transitions.create('margin', {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.leavingScreen,
					}),
					marginLeft: `-${drawerWidth}px`,
					...(open && {
						transition: theme.transitions.create('margin', {
							easing: theme.transitions.easing.easeOut,
							duration: theme.transitions.duration.enteringScreen,
						}),
						marginLeft: 0,
					}),
					width: '100%',
				}}
			>
				<DrawerHeader />
				{children}
			</Box>
		</Box>
	);
}
