const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

let db = admin.firestore();

exports.picpay = functions.https.onRequest((request, response) => {
    let body = request.body;
    let headers = request.headers;

    console.log('>>>> Headers: ' + JSON.stringify(headers));
    console.log('>>>> Body: ' + JSON.stringify(body));

    switch (body.event_type) {
        case 'new_subscription':
            db.collection('subscribers').doc(body.event.subscriber.id).set({
                id: body.event.subscriber.id,
                name: body.event.subscriber.name,
                email: body.event.subscriber.email,
                username: body.event.subscriber.username,
                plan_name: body.event.plan.name,
                plan_value: body.event.plan.value,
                inserted_date: body.date,
                subscription_id: body.event.subscription_id,
                status: 'active'
            }).then(ref => {
                response.status(200).send("New subscription inserted with success.");
            });
            break;

        case 'subscription_cancelled':
            db.collection('subscribers').doc(body.event.subscriber_id).update({
                status: 'inactive',
                cancelled_date: body.date
            }).then(ref => {
                response.status(200).send("Subscription cancelled with success.");
            }).catch(error => {
                response.status(500).send("Subscriber doesn't exist.");
            });

            break;

        default:
            response.status(501).send("Not implemented");
            break;
    }

});

exports.picpayActiveList = functions.https.onRequest((request, response) => {
    db.collection('subscribers').where('status', '=', 'active')
    .get()
    .then(function(query) {
        let data = {};
        query.forEach(function(doc) {
            data[doc.id] = doc.data();
        });
        response.send(data);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

});

exports.robotsList = functions.https.onRequest((request, response) => {
    db.collection('robots')
    .get()
    .then(function(query) {
        let data = {};
        query.forEach(function(doc) {
            data[doc.id] = doc.data();
        });
        response.send(data);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

});


