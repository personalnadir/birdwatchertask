import PouchDB from 'pouchdb';

const db = new PouchDB('data');
const storeData = (id, entry) => {
  entry.participantID = id;
	upsert(db, id, (doc) => {
		let dataArr = doc.data? doc.data: [];
		dataArr.push(entry);
    return {
			data: dataArr,
			_id: String(id)
		};
	});
};

function upsert(db, docId, diffFun) {
  return db.get(docId)
    .catch(function (err) {
      /* istanbul ignore next */
      if (err.status !== 404) {
        throw err;
      }
      return {};
    })
    .then(function (doc) {
      // the user might change the _rev, so save it for posterity
      var docRev = doc._rev;
      var newDoc = diffFun(doc);

      if (!newDoc) {
        // if the diffFun returns falsy, we short-circuit as
        // an optimization
        return {updated: false, rev: docRev};
      }

      // users aren't allowed to modify these values,
      // so reset them here
      newDoc._id = docId;
      newDoc._rev = docRev;
      return tryAndPut(db, newDoc, diffFun);
    });
}

function tryAndPut(db, doc, diffFun) {
  return db.put(doc).then(function (res) {
    return {
      updated: true,
      rev: res.rev
    };
  }, function (err) {
    /* istanbul ignore next */
    if (err.status !== 409) {
      throw err;
    }
    return upsert(db, doc._id, diffFun);
  });
}

const getData = (id, callback) => {
  db.get(id, callback)
    .catch(function (err) {
      console.log(err);
      /* istanbul ignore next */
      if (err.status !== 404) {
        throw err;
      }
      return {};
    }).then(function(doc) {
      return doc.data;
    });
};

export {
	storeData,
  getData
};