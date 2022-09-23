import classNames from 'classnames';
import React, { useEffect } from 'react'
import LoadingSpinner from '~Components/LoadingSpinner/LoadingSpinner';
import { usePageLoading } from '~Store/hooks';
import { WindowUtils } from '~Utils/WindowUtils';
import styles from "./LoadingWrapper.module.scss";

type LoadingWrapperProps = {}

/**
 * Loading Spinner that covers entire page, locking scroll when visible.  
 * Relies on status of 'pageLoading' redux slice to toggle visibility
 */
export default function LoadingWrapper(props: LoadingWrapperProps) {
	const isLoading = usePageLoading();

	useEffect(() => {
		isLoading ? WindowUtils.lockScroll() : WindowUtils.unlockScroll();
	}, [isLoading])

	return (
		<div className={classNames(styles.loadingWrapper, isLoading && styles.show)}>
			<LoadingSpinner show/>
		</div>
	)
}