const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
	name: {
		type: String,
		required: "This field is required.",
	},
	description: {
		type: String,
		required: "This field is required.",
	},
	specification: {
		type: Array,
		required: "This field is required.",
	},
	category: {
		type: String,
		enum: ["Mi", "Samsung", "Apple", "Oppo", "Vivo", "Realme"],
		required: "This field is required.",
	},
	image: {
		type: String,
		required: "This field is required.",
	},
});

phoneSchema.index({ name: 'text', description: 'text' });
// WildCard Indexing
//phoneSchema.index({ "$**" : 'text' });


module.exports = mongoose.model("Phone", phoneSchema);

