onmessage = (e) => {
	const data = e.data;
	console.log(`Worker: Got message of type "${data.type}"`);
	switch (data.type) {
		case 'filter':
			postMessage({
				type: 'result',
				imageData: filter(data.imageData, data.options),
				options: data.options,
			});
			break;
		default:
			console.error('Worker: Did not recognise message type');
	}
};

const CHANNEL_RED = 0;
const CHANNEL_GREEN = 1;
const CHANNEL_BLUE = 2;
const CHANNEL_ALPHA = 3;

const filter = (imageData, options) => {
	const amount = options.amount;
	const amountAbs = Math.abs(amount);
	const original = imageData.data;
	const width = imageData.width;
	const height = imageData.height;
	const copy = [...original];
	const getIndex = (x, y) => 4 * (y * width + x);
	for (let x = amountAbs; x < width - amountAbs; x++) {
		for (let y = 0; y < height; y++) {
			const i = getIndex(x, y);
			original[i + CHANNEL_RED] = copy[getIndex(x - amount, y) + CHANNEL_RED];
			original[i + CHANNEL_GREEN] = copy[i + CHANNEL_GREEN];
			original[i + CHANNEL_BLUE] = copy[getIndex(x + amount, y) + CHANNEL_BLUE];
			original[i + CHANNEL_ALPHA] = copy[i + CHANNEL_ALPHA];
		}
	}
	return imageData;
};
