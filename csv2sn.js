import * as fs from "node:fs";
import {parse} from "csv-parse";

const DELIMITER = ',';

function convertCsvFile(filePath) {
	// Replace any file extension with '.json' for the output file.
	const outputFile = filePath.replace(/\.[^.]+$/, '') + '.json';

	// Open the output file for writing.
	const fd = fs.openSync(outputFile, 'w');

	// Create a CSV parser.
	const parser = parse({
		delimiter: DELIMITER
	});

	// Write the opening for the spreadsheet JSON structure.
	fs.writeSync(fd, '{"activeSheet":"Sheet1","sheets":[{"name":"Sheet1","rows":[');

	// Count rows/columns.
	let columnCount = 0;
	let rowCount = 0;

	// Read the CSV content, line by line.
	parser.on('readable', (line) => {
		let columns = [];

		while ((columns = parser.read()) !== null) {
			for (let i = 0; i < columns.length; i++) {
				// Wrap the column value in an object with additional properties.
				columns[i] = {"format": '0', value: columns[i], index: i};
			}

			// TODO: Each Row: {"index":0,"cells":[{"format":"0","value":1,"index":0},{"format":"0","value":2,"index":1}]}
			// Write this CSV line to the output file.
			fs.writeSync(fd, (rowCount ? ',' : '')+JSON.stringify({
				index: rowCount,
				cells: columns
			}));
			rowCount++;

			// Update the column count if necessary
			if (columns.length > columnCount) {
				columnCount = columns.length - 1;
			}
		}
	});

	// When we are finished reading the CSV data, close the output file.
	parser.on('close', () => {
		// Write the closing spreadsheet JSON structure.
		fs.writeSync(fd, '],"columns":[],"selection":"A1:A1","activeCell":"A1:A1","frozenRows":0,"frozenColumns":0,"showGridLines":true,"gridLinesColor":null,"mergedCells":[],"hyperlinks":[],"defaultCellStyle":{"fontFamily":"Arial","fontSize":12},"drawings":[]}],"names":[],"columnWidth":64,"rowHeight":20,"rows":'+(rowCount + 75)+',"columns":'+(/* TODO */ columnCount < 26 ? 26 : columnCount + 10)+'}');
		console.log('Finished!');
	});

	// On error, warn the user.
	parser.on('error', (err) => {
		console.error(`Error reading the file: ${err.message}`);
		// TODO: Should we close the spreadsheet JSON structure? Or delete/rename/cleanup?
	});

	// Read the file and send it to the parser.
	const inputStream = fs.createReadStream(filePath);

	inputStream.on('data', (chunk) => {
		parser.write(chunk);
	});

	inputStream.on('end', () => {
		parser.end();
	});

	inputStream.on('error', (err) => {
		console.error(`Error reading the file: ${err.message}`);
		// TODO: Should we close the spreadsheet JSON structure? Or delete/rename/cleanup?
	});
}

// Example usage: Pass the CSV file path as the first command-line argument
const filePath = process.argv[2];
if (filePath && fs.existsSync(filePath)) {
	convertCsvFile(filePath);
} else {
	console.error('Usage: node csv2sn.js <file-path>');
}
