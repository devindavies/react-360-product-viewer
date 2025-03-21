function Icon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
		>
			<title>Rotate Icon</title>
			<path d="M12 6C6.3 6 2 8.15 2 11c0 2.45 3.19 4.38 7.71 4.88l-.42.41a1 1 0 000 1.42 1 1 0 001.42 0l2-2a1 1 0 00.21-.33 1 1 0 000-.76 1 1 0 00-.21-.33l-2-2a1 1 0 00-1.42 1.42l.12.11C6 13.34 4 12 4 11c0-1.22 3.12-3 8-3s8 1.78 8 3c0 .83-1.45 2-4.21 2.6a1 1 0 00-.79 1.19 1 1 0 001.19.77c3.65-.8 5.81-2.5 5.81-4.56 0-2.85-4.3-5-10-5z" />
		</svg>
	);
}

export default Icon;
