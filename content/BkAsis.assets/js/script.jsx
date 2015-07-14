var docs = app.documents;
var tplFileNames = {
	'深色模板.psd': 'baseTag',
	'浅色模板.psd': 'baseTag2'
};
var curTplKind;
var doc = app.activeDocument;
var curFolder; // 当前目录
var inputFolderName = 'input';
var inputFolder;
var outputFolder;
var outputFolderName = 'output';
var curPicName; // 当前图片名


function init() {
	if (doc) {
		curFolder = getDocFileFolder(docs);

		if (!curFolder) {
			alert('未识别到模板路径');
			return false;
		}

		var isTpl = checkIsTpl();

		if (isTpl) {
			// alert(File.decode(doc.fullName));
			inputFolder = new Folder(curFolder.absoluteURI + '/' + inputFolderName);

			clearOtherLayers(doc.layers);

			if (!inputFolder.exists) {
				alert('不存在图片输入目录, 自动创建目录!');
				inputFolder.create();
			}

			var file = getAPic(inputFolder);
		
			var artLayer;

			if (file) {
				curPicName = File.decode(file.name);

				var custom = new ActionDescriptor();
				custom.putString(0, curPicName);

				app.putCustomOptions('BKASSIST', custom); // 存储信息

				artLayer = createImgLayer(doc);

				app.load(file);
				var backFile = app.activeDocument; //prepare your image layer as active document
   				
   				backFile.selection.selectAll();
   				backFile.selection.copy(); //copy image into clipboard
   				backFile.close(SaveOptions.DONOTSAVECHANGES); //close image without saving changes
				
				app.activeDocument = doc; // 激活当前
				doc.activeLayer = artLayer; // 激活创建的图层
				doc.paste(); // 粘贴图片

				if (curTplKind === 'baseTag2') {
					artLayer.move(doc.artLayers.getByName(curTplKind), ElementPlacement.PLACEBEFORE);
				}
			} else {
				alert('没有图片罗~');
			}
			

		} else {
			alert('当前不是模板文件!');
		}
		
			
		
	}
}
 
function clearOtherLayers(layers) {
	for (var i = 0; i < layers.length; i++) {
		if (!layers[i].allLocked) {
			layers[i].remove();
		}
	}
}

/**
 * [getDocFileFolder 获取模板文件所在目录]
 * @param  {[type]} doc [description]
 * @return {[type]}     [description]
 */
function getDocFileFolder(docs) {
	var result, file;

	for (var i = 0; i < docs.length; i++) {
		
		file = docs[i].fullName;

		if (file && file) {
			// 读取文件名
			if (tplFileNames[File.decode(file.displayName)]) {
				return file.parent;
			}
		}
	}
}

/**
 * [checkIsTpl 判断当前是否为模板文件]
 * @return {[type]} [description]
 */
function checkIsTpl() {
	var result = false,
		file = doc.fullName,
		layers = doc.layers;

	if (file && File.decode(file.displayName).indexOf('.psb') !== -1) {
		for (var i = 0; i < layers.length; i++) {
			if (layers[i].name.indexOf('baseTag') === 0) {
				result = true;

				curTplKind = layers[i].name;

				break;
			}
		}
	}

	return result;
}

/**
 * [createImgLayer 创建图片的图层]
 * @param  {[type]} doc [description]
 * @return {[type]}     [description]
 */
function createImgLayer(doc) {
	var artLayers = doc.artLayers,
		layer = artLayers.add();

	layer.move(doc.artLayers.getByName(curTplKind), ElementPlacement.PLACEAFTER);
	return layer;
}

/**
 * [picFilter 图片文件过滤器]
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
function picFilter(file) {
	var imgReg = /\.jpe?g|png|gif|bmp$/;

	if (file instanceof File && imgReg.test(File.decode(file.displayName))) {
		return true;
	}

	return false;
}

/**
 * [getAPic 从文件夹获取一张图片]
 * @return {[type]} [description]
 */
function getAPic(folder) {
	var files = folder.getFiles(picFilter);
		
	return files.length ? files[0] : null;
}

function getMyFolder() {
	
}

function load() {
	alert('load');
}

function save() {
	alert('save');
}

// ------------
init();