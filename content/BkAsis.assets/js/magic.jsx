var docs = app.documents;
var tplFileNames = {
	'深色模板.psd': 'baseTag',
	'浅色模板.psd': 'baseTag2'
};
var curTplKind;
var doc = app.activeDocument;
var curFolder; // 当前目录
var dWidth = 705;
var dHeight = 705;

app.preferences.rulerUnits = Units.PIXELS; // 设置全局的单位为像素
app.preferences.typeUnits = TypeUnits.PIXELS;

/**
 * [checkLayer 检查图层是否规范]
 * @param  {[type]} layer [description]
 * @return {[type]}       [description]
 */
function checkLayer(layer) {
	if (!layer) {
		return "没有选中图层哟~";
	}

	if (!(layer instanceof ArtLayer)) {
		return "只能选中一个图层~";
	}

	var tag = ['baseTag', 'targerTag'];

	for (var i = 0; i < tag.length; i++) {
		if (layer.name.indexOf(tag[i]) === 0) {
			return "不能选中特殊图层~";			
		}
	}
	
	return "";
}

/**
 * [getDocFileFolder 获取模板文件所在目录]
 * @param  {[type]} doc [description]
 * @return {[type]}     [description]
 */
function getDocFileFolder(docs) {
	var file;

	for (var i = 0; i < docs.length; i++) {
		
		file = docs[i].fullName;

		if (file && file) {
			// 读取文件名
			if (tplFileNames[File.decode(file.displayName)]) {
				return file.parent;
			}
		}
	}

	return null;
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
 * [createNewDoc 创建新窗口文件]
 * @return {[type]} [description]
 */
function createNewDoc() {
	return app.documents.add(dWidth, dHeight, 72, "Magic Layers", NewDocumentMode.RGB, DocumentFill.TRANSPARENT, 1);
}

/**
 * [getTagLayerInfo 获取图层的基本信息]
 * @return {[type]} [description]
 */
function getTagLayerInfo(doc) {
	var pixelLoc = [UnitValue(0, 'px') , UnitValue(0, 'px')],
		myColorSampler,
		x, y, myColor,
		width = doc.width.value,
		height = doc.height.value;

	doc.colorSamplers.removeAll(); // 先清空
	
	myColorSampler = app.activeDocument.colorSamplers.add(pixelLoc);

	for (x = 0; x < width; x++) {
		for (y = 0; y < height; y++) {
			pixelLoc[0].value = x;
			pixelLoc[1].value = y;
			myColorSampler.move(pixelLoc);

			myColor = myColorSampler.color;
			alert(myColor.red + '@' + myColor.green + '@' + myColor.blue);
		}
	}
}


function makeCircle(left, top, right, bottom, antiAlias){
	var circleSelection = charIDToTypeID( "setd" );
    var descriptor = new ActionDescriptor();
    var id71 = charIDToTypeID( "null" );
    var ref5 = new ActionReference();
    var id72 = charIDToTypeID( "Chnl" );
    var id73 = charIDToTypeID( "fsel" );
    ref5.putProperty( id72, id73 );
    descriptor.putReference( id71, ref5 );
    var id74 = charIDToTypeID( "T   " );
    var desc12 = new ActionDescriptor();

    var top1 = charIDToTypeID( "Top " );
    var top2 = charIDToTypeID( "#Pxl" );
    desc12.putUnitDouble( top1, top2, top );

    var left1 = charIDToTypeID( "Left" );
    var left2 = charIDToTypeID( "#Pxl" );
    desc12.putUnitDouble( left1, left2, left );

    var bottom1 = charIDToTypeID( "Btom" );
    var bottom2 = charIDToTypeID( "#Pxl" );
    desc12.putUnitDouble( bottom1, bottom2, bottom );

    var right1 = charIDToTypeID( "Rght" );
    var right2 = charIDToTypeID( "#Pxl" );
    desc12.putUnitDouble( right1, right2, right );

    var id83 = charIDToTypeID( "Elps" );
    descriptor.putObject( id74, id83, desc12 );
    var id84 = charIDToTypeID( "AntA" );
    descriptor.putBoolean( id84, antiAlias );
	executeAction( circleSelection, descriptor, DialogModes.NO );
}

function init() {
	if (doc) {
		curFolder = getDocFileFolder(docs);

		if (!curFolder) {
			alert('未识别到模板路径');
			return false;
		}

		var isTpl = checkIsTpl();

		if (isTpl) {
			var curLayer = doc.activeLayer;
			var msg = checkLayer(curLayer);
			var newDoc;
			var newTag;
			var tmpLayer;
			var fColor = new SolidColor();
			var rgbColor = app.foregroundColor.rgb;

			if (curTplKind === 'baseTag') {
				rgbColor.red = 0;
				rgbColor.green = 0;
				rgbColor.blue = 0;
			} else {
				rgbColor.red = 251;
				rgbColor.green = 251;
				rgbColor.blue = 251;
			}

			if (!msg) {
				// 没有错误信息
				curLayer.copy(); // 拷贝图层到剪贴板
				newDoc = createNewDoc();

				app.activeDocument = newDoc;
				newDoc.paste();

				newTag = newDoc.activeLayer;

				// getTagLayerInfo(newDoc);

				tmpLayer = newDoc.artLayers.add(); // 创建新的图层
				tmpLayer.name = '背景';
				tmpLayer.move(newTag, ElementPlacement.PLACEAFTER);
				
				// newDoc.activeLayer = tmpLayer;
				// newDoc.selection.selectAll();
				// newDoc.selection.fill(app.foregroundColor);
				// newDoc.selection.deselect(); // 取消选择

				tmpLayer = newDoc.artLayers.add();
				tmpLayer.name = '羽化层';
				tmpLayer.move(newTag, ElementPlacement.PLACEAFTER);

				newDoc.activeLayer = tmpLayer;
				// makeCircleSelection(newDoc);

				// makeCircle(70, 70, 70, 70, true);
			} else {
				alert(msg);
			}
		} else {
			alert('当前不是模板文件!');
		}
		
	}
}

// ------------
init();