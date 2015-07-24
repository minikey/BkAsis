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
var fileNameReg = /^[^\.]+/;

var options = new ExportOptionsSaveForWeb();
options.format = SaveDocumentType.PNG;
options.PNG8 = false;
options.transparency = true;
options.optimized = true;

app.preferences.rulerUnits = Units.PIXELS; // 设置全局的单位为像素
app.preferences.typeUnits = TypeUnits.PIXELS;

function init() {
	if (doc) {
		curFolder = getDocFileFolder(docs);

		if (!curFolder) {
			alert('未识别到模板路径');
			return false;
		}

		var isTpl = checkIsTpl();

		if (isTpl) {
			outputFolder = new Folder(curFolder.absoluteURI + '/' + outputFolderName);
			inputFolder = new Folder(curFolder.absoluteURI + '/' + inputFolderName);

			if (!outputFolder.exists) {
				outputFolder.create();
				alert('不存在输出目录，自动创建!');
			}

			if (!inputFolder.exists) {
				inputFolder.create();
				alert('不存在图片输入目录, 自动创建!');
			}
			var custom = app.getCustomOptions('BKASSIST');
			var fileName;
			var options = new ExportOptionsSaveForWeb();
			
			options.format = SaveDocumentType.PNG;
			options.PNG8 = false;
			options.transparency = true;
			options.optimized = true;

			if (custom) {
				fileName = custom.getString(0);
			}

			if (fileName) {
				var file = new File(outputFolder.absoluteURI + '/' + fileName.match(fileNameReg)[0] + '.png');
				if (file.exists) {
					confirm('文件已经存在是否覆盖') && doc.exportDocument(file, ExportType.SAVEFORWEB, options);
				} else {
					doc.exportDocument(file, ExportType.SAVEFORWEB, options);
				}
				

				file = new File(inputFolder.absoluteURI + '/' + fileName);

				if (file.exists) {
					file.rename(fileName + '.bak');
				} else {
					alert('源文件不存在，无法重命名!');
				}

			} else {
				alert("操作有误~");
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