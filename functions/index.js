const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

let db = admin.firestore();

exports.picpay = functions.https.onRequest((request, response) => {
    let body = request.body;

    switch (body.event_type) {
        case 'new_subscription':
            db.collection('subscribers').doc(body.event.subscriber.id).set({
                id: body.event.subscriber.id,
                name: body.event.subscriber.name,
                email: body.event.subscriber.email,
                image_url_small: body.event.subscriber.image_url_small,
                plan_name: body.event.plan.name,
                plan_value: body.event.plan.value,
                status: 'active'
            }).then(ref => {
                response.status(200).send("New subscription inserted with success.");
            });
            break;

        case 'subscription_cancelled':
            db.collection('subscribers').doc(body.event.subscriber_id).update({
                status: 'inactive'
            }).then(ref => {
                response.status(200).send("Subscription canceled with success.");
            }).catch(error => {
                response.status(500).send("Subscriber doesn't exist.");
            });
            
            break;
    
        default:
            response.status(501).send("Not implemented");
            break;
    }
    
});
