import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { DarkToColorGradientBtn } from '~Components/GradientBtn/GradientBtn';
import { useResponsive, useUser } from '~Store/hooks'
import { APIFetcher } from '~Utils/APIFetcher';
import styles from "./MainHeader.module.scss"

type MainHeaderProps = {}

export default function MainHeader({ }: MainHeaderProps) {
	const user = useUser();
	const navigate = useNavigate();
	const mobile = useResponsive("mobile");

	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleLogoutClick = () => {
		setIsLoggingOut(true);
		APIFetcher.LogoutUser({}).finally(() => {
			setIsLoggingOut(false);
			localStorage.removeItem("authTokens");
			navigate("/Auth");
		})
	}

	return (
		<div className={styles.header}>
			<h1 className={styles.title}>Welcome {!mobile && user.username}</h1>
			<DarkToColorGradientBtn classes={{ root: styles.logoutBtn }} isLoading={isLoggingOut} onClick={handleLogoutClick}>Logout</DarkToColorGradientBtn>
		</div>
	)
}