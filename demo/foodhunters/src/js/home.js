/**
 * Created by bsy on 15/11/18.
 */
var data = [
    {
        src: 'IMG_1823.jpg'
    },
    {
        src: 'IMG_1839.jpg'
    },
    {
        src: 'IMG_1844.jpg'
    },
    {
        src: 'IMG_1845.jpg'
    },
    {
        src: 'IMG_1840.jpg'
    },
    {
        src: 'IMG_1861.jpg'
    },
    {
        src: 'IMG_1862.jpg'
    },
    {
        src: 'IMG_1863.jpg'
    },
    {
        src: 'IMG_1841.jpg'
    },
    {
        src: 'IMG_1824.jpg'
    },
    {
        src: 'IMG_1825.jpg'
    },
    {
        src: 'IMG_1826.jpg'
    },
    {
        src: 'IMG_1827.jpg'
    },
    {
        src: 'IMG_1828.jpg'
    },
    {
        src: 'IMG_1829.jpg'
    },
    {
        src: 'IMG_1830.jpg'
    },
    {
        src: 'IMG_1831.jpg'
    },
    {
        src: 'IMG_1832.jpg'
    },
    {
        src: 'IMG_1833.jpg'
    },
    {
        src: 'IMG_1834.jpg'
    },
    {
        src: 'IMG_1835.jpg'
    },
    {
        src: 'IMG_1836.jpg'
    },
    {
        src: 'IMG_1837.jpg'
    },
    {
        src: 'IMG_1838.jpg'
    },
    {
        src: 'IMG_1842.jpg'
    },
    {
        src: 'IMG_1843.jpg'
    },
    {
        src: 'IMG_1846.jpg'
    },
    {
        src: 'IMG_1847.jpg'
    },
    {
        src: 'IMG_1848.jpg'
    },
    {
        src: 'IMG_1849.jpg'
    },
    {
        src: 'IMG_1850.jpg'
    },
    {
        src: 'IMG_1851.jpg'
    },
    {
        src: 'IMG_1852.jpg'
    },
    {
        src: 'IMG_1853.jpg'
    },
    {
        src: 'IMG_1854.jpg'
    },
    {
        src: 'IMG_1855.jpg'
    },
    {
        src: 'IMG_1856.jpg'
    },
    {
        src: 'IMG_1857.jpg'
    },
    {
        src: 'IMG_1858.jpg'
    },
    {
        src: 'IMG_1859.jpg'
    },
    {
        src: 'IMG_1860.jpg'
    },
    {
        src: 'IMG_1864.jpg'
    },
    {
        src: 'IMG_1865.jpg'
    },
    {
        src: 'IMG_1866.jpg'
    },
    {
        src: 'IMG_1867.jpg'
    },
    {
        src: 'IMG_1868.jpg'
    },
    {
        src: 'IMG_1869.jpg'
    },
    {
        src: 'IMG_1870.jpg'
    },
    {
        src: 'IMG_1871.jpg'
    },
    {
        src: 'IMG_1872.jpg'
    },
    {
        src: 'IMG_1873.jpg'
    },
    {
        src: 'IMG_1874.jpg'
    },
    {
        src: 'IMG_1875.jpg'
    },
    {
        src: 'IMG_1876.jpg'
    },
    {
        src: 'IMG_1877.jpg'
    },
    {
        src: 'IMG_1878.jpg'
    },
    {
        src: 'IMG_1879.jpg'
    },
    {
        src: 'IMG_1880.jpg'
    },
    {
        src: 'IMG_1881.jpg'
    },
    {
        src: 'IMG_1882.jpg'
    },
    {
        src: 'IMG_1883.jpg'
    },
    {
        src: 'IMG_1884.jpg'
    },
    {
        src: 'IMG_1885.jpg'
    },
    {
        src: 'IMG_1886.jpg'
    },
    {
        src: 'IMG_1887.jpg'
    },
    {
        src: 'IMG_1888.jpg'
    },
    {
        src: 'IMG_1889.jpg'
    },
    {
        src: 'IMG_1890.jpg'
    },
    {
        src: 'IMG_1891.jpg'
    },
    {
        src: 'IMG_1892.jpg'
    },
    {
        src: 'IMG_1893.jpg'
    },
    {
        src: 'IMG_1894.jpg'
    },
    {
        src: 'IMG_1895.jpg'
    }
];

var CONFIG = {
    WIDTH: 170,
    MARGIN: 5
};

var win = window,
    doc = document;

var getWinSize = function () {
    if (win.innerWidth) {
        return {
            w: win.innerWidth,
            h: win.innerHeight
        }
    }

    if (doc.compatMode == 'CSS1compat') {
        return {
            w: doc.documentElement.clientWidth,
            h: doc.documentElement.clientHeight
        }
    }

    return {
        w: doc.body.clientWidth,
        h: doc.body.clientHeight
    }
}

var win_size = getWinSize(),
    column_num = win_size.width > 414 ? 3 : 2;

var pins = [],
    columns = [],
    columns_height = [];

var current = 0;
var len = 0;

var docFrag = null,
    elWrapper = doc.getElementsByClassName('wrapper')[0],
    elContainer = doc.createElement('div');

elContainer.className = 'list';
elContainer.style.width = column_num * (CONFIG.WIDTH + CONFIG.MARGIN * 2) + 'px';

//insert cell
var init_cell = function () {
    elContainer.innerHTML = '';
    docFrag = doc.createDocumentFragment();
    var user_num = document.getElementById('user_num').value;
    len = user_num < data.length ? user_num : data.length;
    for (var i = 0; i < len; i++) {
        var d = data[i];

        var elPin = doc.createElement('div');
        elPin.className = 'event';
        elPin.style.position = 'absolute';
        elPin.style.width = CONFIG.WIDTH + 'px';
        elPin.style.top = -9999 + 'px';
        elPin.style.left = -9999 + 'px';

        var elThumb = new Image();
        elThumb.onload = (function(item, current) {
            return function() {
                item.width = this.width;
                item.height = this.height;
                pins.push(item);
                if (current == len - 1) {
                    console.log('###### reflow ######');
                    setTimeout(reflow, 300);
                }
            }
        })(d, i);

        elThumb.src = 'images/' + d.src;
        elThumb.width = CONFIG.WIDTH;

        elPin.appendChild(elThumb);

        elContainer.appendChild(elPin);
    }

    docFrag.appendChild(elContainer);

    elWrapper.appendChild(docFrag);
}

//get column height
var getMinHeightColumn = function (c) {
    for (var i = 0; i < column_num; i++) {
        var height = 0,
            column = columns[i];
        console.log('##### columns :' + i);
        for(var j = 0, l = column.length; j < l; j++) {
            console.log('##### item :' + j);
            console.log(column[j]);
            console.log('#######################');
            if(column[j]) {
                height += column[j].height + 5;
            }
        }
        columns_height[i] = height;
    }

    var min = Math.min.apply(null, columns_height);
    return columns_height.indexOf(min);
}

//reflow
var reflow = function() {
    var elItems = doc.getElementsByClassName('event');
    for (var i = current; i < column_num; i++, current++) {
        var item = elItems[i];
        var column = [];
        column.push(pins[i]);
        columns[i] = column;
        var top = 0,
            left =  i * (CONFIG.WIDTH + CONFIG.MARGIN * 2);
        item.style.top = 0 + 'px';
        item.style.left = left + 'px';

        console.log('##### current: ' + current);
        console.log('##### top: ' + top)
        console.log('##### left: ' + left)
        console.log('#######################');
    }

    for (var j = current; j < len; j++, current++) {
        var item = elItems[j];
        var c = getMinHeightColumn(),
            top = columns_height[c],
            left = c * (CONFIG.WIDTH + CONFIG.MARGIN * 2);
        columns[c].push(pins[j]);
        item.style.top = top + 'px';
        item.style.left = left + 'px';

        console.log('##### current: ' + current);
        console.log('##### top: ' + top)
        console.log('##### left: ' + left)
        console.log('#######################');
    }
}

init_cell();


var btn_set = document.getElementById('btn_set');
btn_set.addEventListener('click', function () {
    init_cell();
});
