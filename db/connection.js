const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://gustavo:senhabanco@cluster0.mdmil.mongodb.net/Cluster0?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});