export const getDayDiff = (date1: moment.Moment, date2: moment.Moment) => {
	const diff = date1.diff(date2, 'days');
	return diff;
};

export const getDayDiffText = (date1: moment.Moment, date2: moment.Moment) => {
	const diff = getDayDiff(date1, date2);

	if (diff === 0) {
		return 'ma';
	} else if (diff === 1) {
		return 'holnap';
	} else if (diff === -1) {
		return 'tegnap';
	} else if (diff > 1) {
		return `${diff} nap múlva`;
	} else if (diff < -1) {
		return `${Math.abs(diff)} napja`;
	}
};
