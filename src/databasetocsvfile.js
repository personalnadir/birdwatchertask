import {getData} from './database/db';
import Papa from 'papaparse';
import FileSaver from 'file-saver';

function downloadDataSet(user) {
	getData(user, (err, data) => {
		const csv = Papa.unparse(data);

		const blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
		FileSaver.saveAs(blob, `Data_${user}.csv`);
	});

};

export {
	downloadDataSet
};
