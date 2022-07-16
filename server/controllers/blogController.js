require("../models/database");
const Category = require("../models/Category");
const Phone = require("../models/Phone");

/**
 * GET /
 * Homepage
 */

exports.homepage = async (req, res) => {
	try {
		const limitNumber = 5;
		const categories = await Category.find({}).limit(limitNumber);
		const latest = await Phone.find({}).sort({ _id: -1 }).limit(limitNumber);
		const samsung = await Phone.find({ category: "Samsung" }).limit(
			limitNumber
		);
		const mi = await Phone.find({ category: "Mi" }).limit(limitNumber);
		const apple = await Phone.find({ category: "Apple" }).limit(limitNumber);
		
		const phone = { latest, samsung , apple, mi  };

		res.render("index", { title: "Blog - Home", categories, phone });
	} catch (error) {
		res.satus(500).send({ message: error.message || "Error Occured" });
	}
};

/**
 * GET /categories
 * Categories
 */

exports.exploreCategories = async (req, res) => {
	try {
		const limitNumber = 20;
		const categories = await Category.find({}).limit(limitNumber);
		res.render("categories", { title: "Blog - Categories", categories });
	} catch (error) {
		res.satus(500).send({ message: error.message || "Error Occured" });
	}
};


/**
 * GET /categories/:id
 * Categories By Id
*/
exports.exploreCategoriesById = async (req, res) => {
	try {
	let categoryId = req.params.id;
	const limitNumber = 20;
	const categoryById = await Phone.find({ 'category': categoryId }).limit(limitNumber);
	res.render('categories', { title: 'Blog - Categories', categoryById });
	} catch (error) {
	res.satus(500).send({ message: error.message || "Error Occured" });
	}
}

/**
 * GET /phone/:id
 * Phone 
*/
exports.explorePhone = async (req, res) => {
	try {
	let phoneId = req.params.id;
	const phone = await Phone.findById(phoneId);
	res.render('phone', { title: 'Blog - Phone', phone });
} 
	catch (error) {
	res.satus(500).send({ message: error.message || "Error Occured" });
	}
}

/**
 * POST /search
 * Search 
*/
exports.searchPhone = async (req, res) => {
	try {
		let searchTerm = req.body.searchTerm;
		let phone = await Phone.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
		res.render('search', { title: 'Blog - Search', phone });
		} 
	catch (error) {
	res.satus(500).send({ message: error.message || "Error Occured" });
	}

}

/**
 * GET /explore-latest
 * Explore Latest 
*/
exports.exploreLatest = async (req, res) => {
	try {
	const limitNumber = 20;
	const phone = await Phone.find({}).sort({ _id: -1 }).limit(limitNumber);
	res.render('explore-latest', { title: 'Blog - Explore Latest', phone });
	} catch (error) {
	res.satus(500).send({ message: error.message || "Error Occured" });
	}
}

/**
 * GET /explore-about
 * Explore About 
*/
exports.exploreAbout = async (req, res) => {
	try {
	res.render('explore-about', { title: 'Blog - About'});
	} catch (error) {
	res.satus(500).send({ message: error.message || "Error Occured" });
	}
}

/**
 * GET /contact
 * Explore contact 
*/
exports.exploreContact = async (req, res) => {
	try {
	res.render('contact', { title: 'Blog - Contact'});
	} catch (error) {
	res.satus(500).send({ message: error.message || "Error Occured" });
	}
}

/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async (req, res) => {
	try {
		let count = await Phone.find().countDocuments();
		let random = Math.floor(Math.random() * count);
		let phone = await Phone.findOne().skip(random).exec();
		res.render('explore-random', { title: 'Blog - Explore Latest', phone });
	} catch (error) {
	res.satus(500).send({ message: error.message || "Error Occured" });
	}
}


/**
 * GET /submit-blog
 * Submit Blog
*/
exports.submitBlog = async (req, res) => {
	const infoErrorsObj = req.flash('infoErrors');
	const infoSubmitObj = req.flash('infoSubmit');
	res.render('submit-blog', { title: 'Blog - Submit', infoErrorsObj, infoSubmitObj });
}


/**
 * POST /submit-blog
 * Submit Blog
*/
exports.submitBlogOnPost = async (req, res) => {
	try {

	let imageUploadFile;
	let uploadPath;
	let newImageName;

	if (!req.files || Object.keys(req.files).length === 0) {
		console.log('No Files where uploaded.');
	} else {

		imageUploadFile = req.files.image;
		newImageName = Date.now() + imageUploadFile.name;

		uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

		imageUploadFile.mv(uploadPath, function (err) {
		if (err) return res.satus(500).send(err);
		})

	}

	
	const newBlog = new Phone({
		name: req.body.name,
		description: req.body.description,
		specification: req.body.specification,
		category: req.body.category,
		image: newImageName,
	});

	await newBlog.save();

	req.flash('infoSubmit', 'Phone Blog has been added.')
	res.redirect('/submit-blog');
	} catch (error) {
	// res.json(error);
	req.flash('infoErrors', error);
	res.redirect('/submit-blog');
	}
}


















/**
 * Dummy Data Example
 */

// async function insertDymmyCategoryData(){
// 	try {
//     await Category.insertMany([
// 			{
// 				name: "Samsung",
// 				image: "samsung.jpg",
// 			},
// 			{
// 				name: "Apple",
// 				image: "iphone.jpg",
// 			},
// 			{
// 				name: "Realme",
// 				image: "realme.jpg",
// 			},
// 			{
// 				name: "Oppo",
// 				image: "oppo.jpg",
// 			},
// 			{
// 				name: "Vivo",
// 				image: "vivo.jpg",
// 			},
// 			{
// 				name: "Xiaomi",
// 				image: "mi.jpg",
// 			},
// 		]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData();

// async function insertData() {
// 	try {
// 		console.log("inserting data");
// 		await Phone.insertMany([
// 			{
// 				name: "Realme 9",
// 				description:
// 					"The Realme 9 series this year has quite a few family members. We have a 4G and 5G version of the vanilla option, we have a 9i as well as two Pro flavors. Each represents a different price category except the Realme 9 4G and 5G iterations. Both seem to be priced quite similarly. And to our surprise, the 5G device undercuts the Realme 9 4G by around €30. Realme 9 review However, there's a pretty good reason why. The 4G variant has a better display, faster charging, and better main camera and the base memory variant offers twice the storage of the 5G. Right off the bat, we can say that the 4G version will probably be more popular than its 5G counterpart, mostly among people not interested in upgrading to the 5G network or in countries where the coverage is still scarce.",
// 				specification: [
// 					"Body: 160.2x73.3x8.0mm, 178g; Gorilla Glass 5 front, plastic back and frame.",
// 					'Display: 6.40" Super AMOLED, 90Hz, 430 nits (typ), 1000 nits (peak), 1080x2400px resolution, 20:9 aspect ratio, 411ppi.',
// 					"Chipset: Qualcomm SM6225 Snapdragon 680 4G (6 nm): Octa-core (4x2.4 GHz Kryo 265 Gold & 4x1.9 GHz Kryo 265 Silver); Adreno 610.",
// 					"Memory: 128GB 6GB RAM, 128GB 8GB RAM; UFS 2.2; microSDXC (dedicated slot).",
// 					"OS/Software: Android 12, Realme UI 3.0.",
// 					'Rear camera: Wide (main): 108 MP, f/1.8, 26mm, 1/1.67", 0.64µm, Dual Pixel PDAF; Ultra wide angle: 8 MP, f/2.2, 120˚, 1/4", 1.12µm; Macro: 2 MP, f/2.4.',
// 					'Front camera: 16 MP, f/2.5, 26mm (wide), 1/3.09", 1.0µm.',
// 					"Video capture: Rear camera: 1080p@30fps; Front camera: 1080p@30fps.",
// 					"Battery: 5000mAh; Fast charging 33W, 50% in 31 min, 100% in 75 min (advertised).",
// 					"Misc: Fingerprint reader (under display, optical); 3.5mm jack, No NFC.",
// 				],
// 				category: "Realme",
// 				image: "realme9.jpg",
// 			},
// 			{
// 				name: "Xiaomi 12 Lite",
// 				description:
// 					"The Xiaomi 12 Lite arrives a bit later than the rest of the 12 series. Aside from the completely revamped, boxy and trendy design, it brings an updated 120Hz OLED panel, a better 108MP main camera and faster charging. The phone is powered by the Snapdragon 778G, which is up to the task. The 12 Lite is also one of the first Xiaomi phones to offer Android 12 under the company's MIUI 13 interface.",
// 				specification: [
// 					"Body: 159.3x73.7x7.29mm, 173g; Gorilla Glass 5 front, plastic back, plastic frame.",
// 					'Display: 6.55" AMOLED, 68B colors, HDR10+, Dolby Vision, 120Hz, 500 nits (typ), 800 nits, 1080x2400px resolution, 20:9 aspect ratio, 402ppi.',
// 					"Chipset: Qualcomm SM7325 Snapdragon 778G 5G (6 nm): Octa-core (4x2.4 GHz Kryo 670 & 4x1.8 GHz Kryo 670); Adreno 642L.",
// 					"Memory: 128GB 6GB RAM, 128GB 8GB RAM, 256GB 8GB RAM; UFS 2.2.",
// 					"OS/Software: Android 12, MIUI 13.",
// 					'Rear camera: Wide (main): 108 MP, f/1.9, 26mm, 1/1.52", 0.7µm, PDAF; Ultra wide angle: 8 MP, f/2.2, 120˚, 1/4.0", 1.12µm; Macro: 2 MP, f/2.4, 1/5.0", 1.75µm.',
// 					'Front camera: 32 MP, f/2.45, 1/2.8", AF.',
// 					"Video capture: Rear camera: 4K@30fps, 1080p@30/60/120fps; gyro-EIS; Front camera: 1080p@30/60fps, 720p@120fps.",
// 					"Battery: 4500mAh; Fast charging 67W, Quick Charge 4+, Power Delivery 3.0.",
// 					"Misc: Fingerprint reader (under display, optical); Infrared port; dual speakers; Virtual proximity sensing.",
// 				],
// 				category: "Mi",
// 				image: "xiaomi12lite.jpg",
// 			},
// 			{
// 				name: "Samsung Galaxy M53 review",
// 				description:
// 					"Samsung's midrange M-series was upgraded earlier this year, and we got our hands on the Galaxy M53 after covering its A-series counterpart a couple of months ago. We did say 'upgrade' in the previous sentence, but is it really? Let's go over the specs to see where it stands on paper. For starters, the cameras are a 'neither here, nor there' type of situation - the main one has gotten a larger and higher-res sensor but that's at the expense of the ultrawide and the macro units which have both been downgraded. Then there's the chipset - nothing's wrong with the 5G-capable Dimensity 900 we have here, but the Snapdragon 778 of the predecessor is a more potent performer. The 6.7-inch OLED display with a 120Hz maximum refresh rate is still here; no complaints. The battery capacity, while far from the M51's class-leading 7,000mAh, remains at 5,000mAh as was on the M52, so this too can be filed under 'no change is a good thing'. The 25W charging rating remains too.",
// 				specification: [
// 					"Body: 164.7x77.0x7.4mm, 176g; plastic back, plastic frame.",
// 					'Display: 6.70" Super AMOLED Plus, 120Hz, 1080x2408px resolution, 20.07:9 aspect ratio, 394ppi.',
// 					"Chipset: MediaTek MT6877 Dimensity 900 (6 nm): Octa-core (2x2.4 GHz Cortex-A78 & 6x2.0 GHz Cortex-A55); Mali-G68 MC4.",
// 					"Memory: 128GB 6GB RAM, 128GB 8GB RAM, 256GB 8GB RAM; microSDXC (uses shared SIM slot).",
// 					"OS/Software: Android 12, One UI 4.1.",
// 					'Rear camera: Wide (main): 108 MP, f/1.8, PDAF; Ultra wide angle: 8 MP, f/2.2, 1/4", 1.12µm; Macro: 2 MP, f/2.4; Depth: 2 MP, f/2.4.',
// 					"Front camera: 32 MP, f/2.2, 26mm (wide).",
// 					"Video capture: Rear camera: 4K@30fps, 1080p@30/60fps; Front camera: 4K@30fps, 1080p@30fps.",
// 					"Battery: 5000mAh; Fast charging 25W.",
// 					"Misc: Fingerprint reader (side-mounted).",
// 				],
// 				category: "Samsung",
// 				image: "samsung-galaxy-M53.jpg",
// 			},
// 			{
// 				name: "IPHONE 13 PRO MAX",
// 				description:
// 					"The advancements in the camera system start with a new primary unit with a bigger sensor and a brighter lens. The ultrawide module also sports a brighter lens, but one that features autofocus - a first for an iPhone ultrawide. Then there's the telephoto which now offers improved reach up to 3x, albeit with a slightly dimmer lens. On the front, things have remained the same, and no, the 20% reduction in notch size doesn't count. Finally giving in to market trends, Apple's fitted the 13 Pro and Pro Max with 120Hz displays - or, rather, ProMotion. They're the adaptive kind, theoretically capable of variable refresh rates to reach all the way down to 10Hz to preserve battery. That's in addition to an already great screen feature set that includes DolbyVision support, plenty of brightness and excellent color rendition. Apple iPhone 13 Pro Max review 2021 iPhones all come with increased battery capacity, and in the 13 Pro Max' case, that's an 18% bump - 2.5 hours more than last year's Pro Max in Apple's metrics, or 'longest battery life ever on an iPhone', and all that. As usual, a new year means an upgraded chipset, and alongside freshly named CPU cores and higher clock rate, the A15 in the 13 Pros also comes with an extra GPU core on top of the non-Pros. Somewhat related, the 13 Pro Max can be specced with up to a full 1TB of storage - that should be useful for iPhone filmmakers if no one else.",
// 				specification: [
// 					"Body: 160.8x78.1x7.7mm, 240g; Glass front (Gorilla Glass), glass back (Gorilla Glass), stainless steel frame; IP68 dust/water resistant (up to 6m for 30 mins), Apple Pay (Visa, MasterCard, AMEX certified).",
// 					'Display: 6.70" Super Retina XDR OLED, 120Hz, HDR10, Dolby Vision, 1000 nits (typ), 1200 nits (peak), 1284x2778px resolution, 19.47:9 aspect ratio, 458ppi; Wide color gamut, True-tone.',
// 					"Chipset: Apple A15 Bionic (5 nm): Hexa-core (2x3.22 GHz Avalanche + 4xX.X GHz Blizzard); Apple GPU (5-core graphics).",
// 					"Memory: 128GB 6GB RAM, 256GB 6GB RAM, 512GB 6GB RAM, 1TB; NVMe.",
// 					"OS/Software: iOS 15.",
// 					"Rear camera: Wide (main): 12 MP, f/1.5, 26mm, 1.9µm, dual pixel PDAF, sensor-shift OIS; Telephoto: 12 MP, f/2.8, 77mm, PDAF, OIS, 3x optical zoom; Ultra wide angle: 12 MP, f/1.8, 13mm, 120˚, PDAF; Depth: TOF 3D LiDAR scanner.",
// 					'Front camera: Wide (main): 12 MP, f/2.2, 23mm, 1/3.6"; Depth: SL 3D.',
// 					"Video capture: Rear camera: 4K@24/30/60fps, 1080p@30/60/120/240fps, 10‑bit HDR, Dolby Vision HDR (up to 60fps), ProRes, Cinematic mode, stereo sound rec; Front camera: 4K@24/25/30/60fps, 1080p@30/60/120fps, gyro-EIS.",
// 					"Battery: 4352mAh; Fast charging 27W, 50% in 30 min (advertised), USB Power Delivery 2.0, MagSafe wireless charging 15W, Qi magnetic fast wireless charging 7.5W.",
// 					"Misc: Face ID, accelerometer, gyro, proximity, compass, barometer; NFC; Siri natural language commands and dictation, Ultra Wideband (UWB) support.",
// 				],
// 				category: "Apple",
// 				image: "iphone-13-pro-max.jpg",
// 			},
// 			{
// 				name: "Oppo Reno7 Lite 5G/ F21 Pro 5G review",
// 				description:
// 					"Oppo really went all in on the confusing naming scheme with thеir Reno7 series. We currently have the Oppo Reno7 Lite 5G in for review, which is known as the Oppo Reno7 Z 5G in Asia, the Oppo F21 Pro 5G in India, and is probably headed to some European countries soon as the Oppo Reno8 Lite. It should not be confused with the Oppo Reno7, also known as the Oppo F21 Pro 4G in some markets, which despite the lack of --Lite-- in its name actually has a few worse specs than the Reno 7 Lite 5G and is already available in Europe. Another similar yet distinctly different phone is the Oppo Reno7 5G, which isn't even based on a Qualcomm chipset, but a MediaTek instead and appears to be only available in India. Got all of that? Well, don't feel bad. We're pretty lost as well.Putting all of that aside, we have a truly gorgeous phone in for review. Our Reno7 Lite 5G unit is the Rainbow-colored version which changes and shifts colors massively depending on ambient lighting. It's a bit like an oil slick, only smoother and silkier. We love the look.",
// 				specification: [
// 					"Body: 159.9x73.2x7.5mm, 173g; glass front and back, plastic frame; IPX4, dust and water resistant, RGB ring lights around the cameras (notifications, charging progress).",
// 					'Display: 6.43" AMOLED, 430 nits (typ), 600 nits (HBM), 1080x2400px resolution, 20:9 aspect ratio, 409ppi.',
// 					"Chipset: Qualcomm SM6375 Snapdragon 695 5G (6 nm): Octa-core (2x2.2 GHz Kryo 660 Gold & 6x1.7 GHz Kryo 660 Silver); Adreno 619.",
// 					"Memory: 128GB 8GB RAM; UFS 2.2; microSDXC.",
// 					"OS/Software: Android 11, ColorOS 12.",
// 					"Rear camera: Wide (main): 64 MP, f/1.7, 26mm, PDAF; Macro: 2 MP, f/2.4; Depth: 2 MP, f/2.4.",
// 					"Front camera: 16 MP, f/2.4, 27mm (wide), 1.0µm.",
// 					"Video capture: Rear camera: 1080p@30fps; Front camera: 1080p@30fps.",
// 					"Battery: 4500mAh; Fast charging 33W, 31% in 15 min, 100% in 63 min (advertised), Reverse charging, USB Power Delivery.",
// 					"Misc: Fingerprint reader (under display); NFC; 3.5mm jack.",
// 				],
// 				category: "Oppo",
// 				image: "oppo-reno-7-lite.jpg",
// 			},
// 			{
// 				name: "iQOO Neo 6",
// 				description:
// 					"The global rollout of the iQOO Neo 6 has recently begun, and it's only fair we give the spotlight to one of the hottest midrangers India has gotten so far. It's an affordable smartphone with a great AMOLED screen, powerful hardware, a capable camera, and speedy charging. As it happens quite often lately, the global model of the iQOO Neo 6 is not the same as the Chinese version. It is not a brand-new device either - the international Neo 6 is actually the Neo 6 SE that is still exclusively sold in China. Go figure! And with that confusion sorted out, let's explore this iQOO Neo 6. If we had to describe the iQOO Neo 6 with as few words as possible, it will go like this - imagine the Poco F3 with a better main camera and faster charging. And it runs on Funtouch instead of MIUI, of course. Indeed, we can't shake the feeling we are getting a refreshed version of one of the best-selling smartphones in the recent years - the Poco F3. The iQOO Neo 6 has arguably a more appealing design but relies on a similar AMOLED screen with 120Hz refresh, 360Hz touch response, and HDR10+ certification. Then there is the Snapdragon 870 5G chipset, which is still considered one of the best choices as it delivers flagship speed and sustained performance within the upper midrange bracket. iQOO advertises the Neo 6 as having a sophisticated multilayer cooling system, and we will surely see how it holds its own under pressure.The iQOO Neo 6 features a triple-camera setup on the back with a 64MP OIS primary, an 8MP ultrawide, and a 2MP macro cameras. There is a 16MP selfie shooter on the other side. Finally, the iQOO Neo 6 utilizes a 4,700mAh battery that supports up to 80W fast charging. You bet that power adapter arrives bundled with the phone. Let's scroll though the iQOO Neo 6 specs now.",
// 				specification: [
// 					"Body: 163.0x76.2x8.5mm, 190g; Glass front, plastic frame, plastic back;",
// 					'Display: 6.62" AMOLED, 120Hz, HDR10+, 500 nits (typ), 800 nits (HBM), 1300 nits (peak), 1080x2400px resolution, 20:9 aspect ratio, 398ppi.',
// 					"Chipset: Qualcomm SM8250-AC Snapdragon 870 5G (7 nm): Octa-core (1x3.2 GHz Kryo 585 & 3x2.42 GHz Kryo 585 & 4x1.80 GHz Kryo 585); Adreno 650.",
// 					"Memory: 128GB 8GB RAM, 256GB 12GB RAM; UFS 3.1.",
// 					"OS/Software: Android 12, Funtouch 12.",
// 					'Rear camera: Wide (main): 64 MP, f/1.9, 1/1.72", 0.8µm, PDAF, OIS; Ultra wide angle: 8 MP, f/2.2, 116˚, 1/4.0", 1.12µm; Macro: 2 MP, f/2.4.',
// 					'Front camera: 16 MP, f/2.0, (wide), 1/3.1", 1.0µm.',
// 					"Video capture: Rear camera: 4K@30fps, 1080p@30fps; Front camera: 1080p@30fps.",
// 					"Battery: 4700mAh; Fast charging 80W, 50% in 12 min, 100% in 32 min (advertised).",
// 					"Misc: Fingerprint reader (under display, optical); Infrared port; stereo speakers.",
// 				],
// 				category: "Vivo",
// 				image: "vivo-iqoo-neo-6.jpg",
// 			},
// 		])
// 			.then((e) => {
// 				console.log("scuccess", e);
// 			})
// 			.catch((e) => {
// 				console.log("error", e);
// 			});
// 	} catch (error) {
// 		console.log("err", +error);
// 	}
// }

// insertData();
