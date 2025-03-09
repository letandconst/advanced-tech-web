import { Avatar, useTheme } from '@mui/material';

interface User {
	uid: string;
	email: string | null;
	firstName: string | null;
	lastName: string | null;
	avatar: string | null;
	phone: string | null;
	address: string | null;
}

const ProfileAvatar = ({ user }: { user: User | null }) => {
	const theme = useTheme();

	const getInitials = (firstName: string = '', lastName: string = '') => {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	};

	return (
		<Avatar
			src={user?.avatar || undefined}
			sx={{
				bgcolor: user?.avatar ? 'transparent' : theme.palette.primary.main,
				width: 40,
				height: 40,
			}}
		>
			{!user?.avatar && getInitials(user?.firstName ?? '', user?.lastName ?? '')}
		</Avatar>
	);
};

export default ProfileAvatar;
