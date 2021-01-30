const mongoose = require('mongoose')

const SubscriptionSchema = mongoose.Schema({
    endpoint: String,
    expirationTime: Number,
    keys: {
        p256dh: String,
        auth: String
    }
})

module.exports = mongoose.model('Subscriptions', SubscriptionSchema)