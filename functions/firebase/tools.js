const functions = require('firebase-functions/lib/index');


exports.whois = functions.https.onRequest((req,res)=> {
    const whois = require('whois');
    let query = req.path.length > 0 ? req.path : req.params.q;
    whois.lookup(query,(err,data) => {
        if (err) {
            res.send(err);
            return;
        }
        res.send(data);
    });
});