import { utils, writeFile, read, WorkSheet } from 'xlsx';

export type SheetData = {
  sheetName: string,
  data: (string | number)[][],
}

/**
  * 导出
  * @param {String} filename 导出文件名称
  * @param {Array} sheetData 到处的数据  [{data:[],sheetName:''}]
  * @returns
  */
export function exportExecel(filename: string, sheetData: SheetData[]) {
  const wb = utils.book_new();
  sheetData.forEach(item => {
    const ws = utils.aoa_to_sheet(item.data);
    autoWidth(ws, item.data);
    utils.book_append_sheet(wb, ws, item.sheetName);
  });
  writeFile(wb, filename + '.xlsx');
}
/**
 * 导入
 * @param {File} file 通过前端 input type="file" 给过来的file对象
 * @return
 */
export function importExcel(file: Blob, callback?: (data: SheetData[]) => void) {
  let reader = new FileReader();
  reader.onload = function (event) {
    const result: SheetData[] = [];
    const workbook = read(event.target?.result, { type: "binary" });
    workbook.SheetNames.map(item => {
      const data: {
        sheetName: string,
        data: (string | number)[][],
      } = { sheetName: item, data: [] },
        curSheet = workbook.Sheets[item],
        keyAry = _getMaxAndMin(curSheet['!ref']);
      if (keyAry.length) {
        data.data = keyAry.map(keyRow => keyRow.map(keyCol => curSheet[keyCol] ? curSheet[keyCol].v : ''));
      }
      result.push(data);
    });
    callback && callback(result);
  };
  reader.readAsBinaryString(file);
}

/**
  * 自动宽度
  * @param {sheet} ws XLSX.utils.aoa_to_sheet()对象
  * @param {Array} data 所有数据
  * @returns {void} 无返回
  */
function autoWidth(ws: WorkSheet, data: (string | number)[][]) {
  /*set worksheet max width per col*/
  const colWidth = data.map(row => row.map(val => {
    /*if null/undefined*/
    if (val == null) {
      return { 'wch': 10 };
    }
    /*if chinese*/
    else if (val.toString().charCodeAt(0) > 255) {
      return { 'wch': val.toString().length * 2 };
    } else {
      return { 'wch': val.toString().length };
    }
  }))
  /*start in the first row*/
  let result = colWidth[0];
  for (let i = 1; i < colWidth.length; i++) {
    for (let j = 0; j < colWidth[i].length; j++) {
      if (result[j]['wch'] < colWidth[i][j]['wch']) {
        result[j]['wch'] = colWidth[i][j]['wch'];
      }
    }
  }
  ws['!cols'] = result;
}

/**
 * 生成 A-Z 的数组
 */
function _getBaseAAndZ() {
  const arr: string[] = [];
  for (var i = 65; i < 91; i++) {
    arr.push(String.fromCharCode(i));
  }
  return arr;
}
/**
 * 获取范围所有的key
 * @param {String} ref 'A1:D3'
 * @return {Array} [['A1','B1'],['A1','B2']]
 */
function _getMaxAndMin(ref?: string) {
  let result: (string | number)[][] = [];
  if (ref) {
    let ary = ref.split(':'),
      AandZ = _getBaseAAndZ(),
      xMin = AandZ.indexOf(ary[0].replace(/[0-9]+/, '')),
      xMax = AandZ.indexOf(ary[1].replace(/[0-9]+/, '')),
      yMin = parseInt(ary[0].replace(/[A-Z|a-z]+/, '')),
      yMax = parseInt(ary[1].replace(/[A-Z|a-z]+/, ''));

    for (let y = yMin; y <= yMax; y++) {
      let row: string[] = [];
      for (let x = xMin; x <= xMax; x++) {
        if (AandZ[x]) {
          row.push(AandZ[x] + y);
        } else {
          break;
        }
      }
      result.push(row);
    }
  }
  return result;
}
