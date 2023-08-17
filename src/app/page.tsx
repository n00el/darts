import styles from './page.module.css';

export default function Home() {
	return (
		<main className={styles.main}>
			<h1
				className={styles.title}
				style={{
					display: 'flex',
					justifyContent: 'center'
				}}
			>
				Placeholder míg Martin meg nem csinálja
			</h1>
		</main>
	);
}
