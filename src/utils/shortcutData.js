// 默认快捷键数据
const defaultShortcuts = [
  {
    title: "常规操作",
    data: [
      {
        name: "移动",
        hasMultiple: true,
        readonly: true,
        items: [
          {
            name: "左移动",
            id: "base3",
            complexKey: [],
            keys: {
              name: "←",
              key: 37,
            },
          },
          {
            name: "上移动",
            id: "base1",
            complexKey: [],
            keys: {
              name: "↑",
              key: 38,
            },
          },
          {
            name: "下移动",
            id: "base2",
            complexKey: [],
            keys: {
              name: "↓",
              key: 40,
            },
          },
          {
            name: "右移动",
            id: "base4",
            complexKey: [],
            keys: {
              name: "→",
              key: 39,
            },
          },
        ],
      },
      {
        name: "快速移动",
        hasMultiple: true,
        readonly: true,
        items: [
          {
            name: "快速左移动",
            id: "base7",
            complexKey: ["Shift"],
            keys: {
              name: "←",
              key: 37,
            },
          },
          {
            name: "快速上移动",
            id: "base5",
            complexKey: ["Shift"],
            keys: {
              name: "↑",
              key: 38,
            },
          },
          {
            name: "快速下移动",
            id: "base6",
            complexKey: ["Shift"],
            keys: {
              name: "↓",
              key: 40,
            },
          },
          {
            name: "快速右移动",
            id: "base8",
            complexKey: ["Shift"],
            keys: {
              name: "→",
              key: 39,
            },
          },
        ],
      },
      {
        name: "对齐",
        hasMultiple: true,
        readonly: true,
        items: [
          {
            name: "左对齐",
            id: "base11",
            complexKey: ["Ctrl", "Shift"],
            keys: {
              name: "←",
              key: 37,
            },
          },
          {
            name: "上对齐",
            id: "base9",
            complexKey: ["Ctrl", "Shift"],
            keys: {
              name: "↑",
              key: 38,
            },
          },
          {
            name: "下对齐",
            id: "base10",
            complexKey: ["Ctrl", "Shift"],
            keys: {
              name: "↓",
              key: 40,
            },
          },
          {
            name: "右对齐",
            id: "base12",
            complexKey: ["Ctrl", "Shift"],
            keys: {
              name: "→",
              key: 39,
            },
          },
        ],
      },
      {
        name: "放大",
        id: "base13",
        complexKey: [],
        keys: {
          name: "+",
          key: [187, 107],
        },
      },
      {
        name: "缩小",
        id: "base14",
        complexKey: [],
        keys: {
          name: "-",
          key: [189, 109],
        },
      },
      {
        name: "复制",
        id: "base15",
        complexKey: ["Ctrl"],
        keys: {
          name: "C",
          key: 67,
        },
      },
      {
        name: "创建副本",
        id: "base16",
        complexKey: ["Ctrl"],
        keys: {
          name: "D",
          key: 68,
        },
      },
      {
        name: "粘贴",
        id: "base17",
        complexKey: ["Ctrl"],
        keys: {
          name: "V",
          key: 86,
        },
      },
      {
        name: "剪切",
        id: "base18",
        complexKey: ["Ctrl"],
        keys: {
          name: "X",
          key: 88,
        },
      },
      {
        name: "全选",
        id: "base19",
        complexKey: ["Ctrl"],
        keys: {
          name: "A",
          key: 65,
        },
        disabled: true,
      },
      {
        name: "撤销",
        id: "base20",
        complexKey: ["Ctrl"],
        keys: {
          name: "Z",
          key: 90,
        },
      },
      {
        name: "重做",
        id: "base21",
        complexKey: ["Ctrl", "Shift"],
        keys: {
          name: "Z",
          key: 90,
        },
      },
      {
        name: "删除",
        id: "base26",
        complexKey: [],
        keys: {
          name: "Delete / Backspace",
          key: [46, 8],
        },
      },
      {
        name: "编组",
        id: "base22",
        complexKey: ["Ctrl"],
        keys: {
          name: "G",
          key: 71,
        },
        disabled: true,
      },
      {
        name: "保存",
        id: "base24",
        complexKey: ["Ctrl"],
        keys: {
          name: "S",
          key: 83,
        },
      },
      {
        name: "拾色器",
        id: "base25",
        complexKey: [],
        keys: {
          name: "I",
          key: 73,
        },
      },
    ],
  },
  {
    title: "元素编辑",
    hasGroup: true,
    data: [
      {
        title: "通用",
        data: [
          {
            name: "置于顶层",
            id: "element1",
            complexKey: ["Ctrl", "Shift"],
            keys: {
              name: "]",
              key: 221,
            },
          },
          {
            name: "上移一层",
            id: "element3",
            complexKey: ["Ctrl"],
            keys: {
              name: "]",
              key: 221,
            },
          },
          {
            name: "下移一层",
            id: "element4",
            complexKey: ["Ctrl"],
            keys: {
              name: "[",
              key: 219,
            },
          },
          {
            name: "置于底层",
            id: "element2",
            complexKey: ["Ctrl", "Shift"],
            keys: {
              name: "[",
              key: 219,
            },
          },
          {
            name: "顺时针旋转45°",
            id: "element22",
            complexKey: ["Alt"],
            keys: {
              name: "G",
              key: 71,
            },
          },
          {
            name: "逆时针旋转45°",
            id: "element23",
            complexKey: ["Alt"],
            keys: {
              name: "F",
              key: 70,
            },
          },
          {
            name: "水平翻转",
            id: "element5",
            complexKey: ["Ctrl"],
            keys: {
              name: ",",
              key: 188,
            },
          },
          {
            name: "垂直翻转",
            id: "element6",
            complexKey: ["Ctrl"],
            keys: {
              name: ".",
              key: 190,
            },
          },
          {
            name: "透明度",
            hasMultiple: true,
            readonly: true,
            disabled: true,
            items: [
              {
                name: "透明度0",
                id: "element7",
                complexKey: [],
                keys: {
                  name: "0",
                  key: [48, 96],
                },
              },
              {
                name: "透明度0.1",
                id: "element8",
                complexKey: [],
                keys: {
                  name: "1",
                  key: [49, 97],
                },
              },
              {
                name: "透明度0.2",
                id: "element9",
                complexKey: [],
                keys: {
                  name: "2",
                  key: [50, 98],
                },
              },
              {
                name: "透明度0.3",
                id: "element10",
                complexKey: [],
                keys: {
                  name: "3",
                  key: [51, 99],
                },
              },
              {
                name: "透明度0.4",
                id: "element11",
                complexKey: [],
                keys: {
                  name: "4",
                  key: [52, 100],
                },
              },
              {
                name: "透明度0.5",
                id: "element12",
                complexKey: [],
                keys: {
                  name: "5",
                  key: [53, 101],
                },
              },
              {
                name: "透明度0.6",
                id: "element13",
                complexKey: [],
                keys: {
                  name: "6",
                  key: [54, 102],
                },
              },
              {
                name: "透明度0.7",
                id: "element14",
                complexKey: [],
                keys: {
                  name: "7",
                  key: [55, 103],
                },
              },
              {
                name: "透明度0.8",
                id: "element15",
                complexKey: [],
                keys: {
                  name: "8",
                  key: [56, 104],
                },
              },
              {
                name: "透明度0.9",
                id: "element16",
                complexKey: [],
                keys: {
                  name: "9",
                  key: [57, 105],
                },
              },
            ],
          },
          {
            name: "锁定/解锁",
            id: "element17",
            complexKey: ["Ctrl"],
            keys: {
              name: "L",
              key: 76,
            },
          },
          {
            name: "宽度最大化",
            id: "element18",
            complexKey: ["Alt"],
            keys: {
              name: "W",
              key: 87,
            },
          },
          {
            name: "高度最大化",
            id: "element19",
            complexKey: ["Alt"],
            keys: {
              name: "E",
              key: 69,
            },
          },
          {
            name: "最大化设计",
            id: "element20",
            complexKey: ["Alt"],
            keys: {
              name: "R",
              key: 82,
            },
          },
          {
            name: "铺满设计区域",
            id: "element21",
            complexKey: ["Alt"],
            keys: {
              name: "T",
              key: 84,
            },
          },
        ],
      },
      {
        title: "图片编辑",
        data: [
          {
            name: "裁切",
            id: "gallery1",
            complexKey: [],
            keys: {
              name: "C",
              key: 67,
            },
            disabled: false,
          },
          {
            name: "抠图",
            id: "gallery2",
            complexKey: [],
            keys: {
              name: "M",
              key: 77,
            },
            disabled: true,
          },
          {
            name: "清晰度",
            id: "gallery3",
            complexKey: [],
            keys: {
              name: "Q",
              key: 81,
            },
            disabled: true,
          },
          {
            name: "滤镜",
            id: "gallery4",
            complexKey: [],
            keys: {
              name: "L",
              key: 76,
            },
            disabled: false,
          },
          {
            name: "平铺",
            id: "gallery5",
            complexKey: [],
            keys: {
              name: "P",
              key: 80,
            },
          },
          {
            name: "设为背景",
            id: "gallery7",
            complexKey: ["Alt"],
            keys: {
              name: "B",
              key: 66,
            },
            disabled: true,
          },
          {
            name: "作为背景应用所有面",
            id: "gallery6",
            complexKey: ["Alt"],
            keys: {
              name: "A",
              key: 65,
            },
            disabled: true,
          },
        ],
      },
      {
        title: "文字编辑",
        data: [
          {
            name: "加粗",
            id: "text1",
            complexKey: ["Ctrl"],
            keys: {
              name: "B",
              key: 66,
            },
          },
          {
            name: "斜体",
            id: "text2",
            complexKey: ["Ctrl"],
            keys: {
              name: "I",
              key: 73,
            },
          },
          {
            name: "删除线",
            id: "text3",
            complexKey: ["Ctrl", "Shift"],
            keys: {
              name: "X",
              key: 88,
            },
          },
          {
            name: "下划线",
            id: "text4",
            complexKey: ["Ctrl"],
            keys: {
              name: "U",
              key: 85,
            },
          },
          {
            name: "左对齐",
            id: "text5",
            complexKey: ["Ctrl", "Shift"],
            keys: {
              name: "L",
              key: 76,
            },
          },
          {
            name: "居中对齐",
            id: "text6",
            complexKey: ["Ctrl", "Shift"],
            keys: {
              name: "C",
              key: 77,
            },
          },
          {
            name: "右对齐",
            id: "text7",
            complexKey: ["Ctrl", "Shift"],
            keys: {
              name: "R",
              key: 82,
            },
          },
          {
            name: "两端对齐",
            id: "text8",
            complexKey: ["Ctrl", "Shift"],
            keys: {
              name: "J",
              key: 74,
            },
          },
          {
            name: "编辑/确认文本",
            id: "text11",
            complexKey: [],
            keys: {
              name: "回车/Enter",
              key: 13,
            },
          },
        ],
      },
    ],
  },
  {
    title: "画板操作",
    data: [
      {
        name: "移动面板",
        id: "canvas33",
        // readonly: true,
        skipCheck: true, //特殊处理，不检查冲突
        complexKey: [],
        keys: {
          name: "空格/Space",
          key: 32,
        },
      },
      {
        name: "设置背景色",
        id: "canvas32",
        complexKey: [],
        keys: {
          name: "I",
          key: 73,
        },
      },
      {
        name: "缩小画板",
        id: "canvas1",
        complexKey: ["Ctrl"],
        keys: {
          name: "-",
          key: [189, 109],
        },
      },
      {
        name: "放大画板",
        id: "canvas2",
        complexKey: ["Ctrl"],
        keys: {
          name: "+",
          key: [187, 107],
        },
      },
      {
        name: "复位画板",
        id: "canvas3",
        complexKey: [],
        keys: {
          name: "R",
          key: 82,
        },
      },
      {
        name: "清空画板",
        id: "canvas4",
        complexKey: ["Ctrl"],
        keys: {
          name: "\\",
          key: 220,
        },
      },
      {
        name: "切换印刷区域",
        hasMultiple: true,
        readonly: true,
        items: [
          {
            name: "切换印刷区域1",
            id: "canvas5",
            complexKey: ["Ctrl"],
            keys: {
              name: "1",
              key: [49, 97],
            },
          },
          {
            name: "切换印刷区域2",
            id: "canvas6",
            complexKey: ["Ctrl"],
            keys: {
              name: "2",
              key: [50, 98],
            },
          },
          {
            name: "切换印刷区域3",
            id: "canvas7",
            complexKey: ["Ctrl"],
            keys: {
              name: "3",
              key: [51, 99],
            },
          },
          {
            name: "切换印刷区域4",
            id: "canvas8",
            complexKey: ["Ctrl"],
            keys: {
              name: "4",
              key: [52, 100],
            },
          },
          {
            name: "切换印刷区域5",
            id: "canvas9",
            complexKey: ["Ctrl"],
            keys: {
              name: "5",
              key: [53, 101],
            },
          },
          {
            name: "切换印刷区域6",
            id: "canvas10",
            complexKey: ["Ctrl"],
            keys: {
              name: "6",
              key: [54, 102],
            },
          },
          {
            name: "切换印刷区域7",
            id: "canvas11",
            complexKey: ["Ctrl"],
            keys: {
              name: "7",
              key: [55, 103],
            },
          },
          {
            name: "切换印刷区域8",
            id: "canvas12",
            complexKey: ["Ctrl"],
            keys: {
              name: "8",
              key: [56, 104],
            },
          },
          {
            name: "切换印刷区域9",
            id: "canvas13",
            complexKey: ["Ctrl"],
            keys: {
              name: "9",
              key: [57, 105],
            },
          },
        ],
      },
      {
        name: "首个印刷区域",
        id: "canvas14",
        complexKey: [],
        keys: {
          name: "Home",
          key: 36,
        },
      },
      {
        name: "上一个印刷区域",
        id: "canvas15",
        complexKey: [],
        keys: {
          name: "Page Up",
          key: 33,
        },
      },
      {
        name: "下一个印刷区域",
        id: "canvas16",
        complexKey: [],
        keys: {
          name: "Page Down",
          key: 34,
        },
      },
      {
        name: "末个印刷区域",
        id: "canvas17",
        complexKey: [],
        keys: {
          name: "End",
          key: 35,
        },
      },
      {
        name: "复制到...",
        hasMultiple: true,
        readonly: true,
        items: [
          {
            name: "复制到所有印刷区域",
            id: "canvas18",
            complexKey: ["Alt"],
            keys: {
              name: "0",
              key: [48, 96],
            },
          },
          {
            name: "复制到第1个印刷区域",
            id: "canvas19",
            complexKey: ["Alt"],
            keys: {
              name: "1",
              key: [49, 97],
            },
          },
          {
            name: "复制到第2个印刷区域",
            id: "canvas20",
            complexKey: ["Alt"],
            keys: {
              name: "2",
              key: [50, 98],
            },
          },
          {
            name: "复制到第3个印刷区域",
            id: "canvas21",
            complexKey: ["Alt"],
            keys: {
              name: "3",
              key: [51, 99],
            },
          },
          {
            name: "复制到第4个印刷区域",
            id: "canvas22",
            complexKey: ["Alt"],
            keys: {
              name: "4",
              key: [52, 100],
            },
          },
          {
            name: "复制到第5个印刷区域",
            id: "canvas23",
            complexKey: ["Alt"],
            keys: {
              name: "5",
              key: [53, 101],
            },
          },
          {
            name: "复制到第6个印刷区域",
            id: "canvas24",
            complexKey: ["Alt"],
            keys: {
              name: "6",
              key: [54, 102],
            },
          },
          {
            name: "复制到第7个印刷区域",
            id: "canvas25",
            complexKey: ["Alt"],
            keys: {
              name: "7",
              key: [55, 103],
            },
          },
          {
            name: "复制到第8个印刷区域",
            id: "canvas26",
            complexKey: ["Alt"],
            keys: {
              name: "8",
              key: [56, 104],
            },
          },
          {
            name: "复制到第9个印刷区域",
            id: "canvas27",
            complexKey: ["Alt"],
            keys: {
              name: "9",
              key: [57, 105],
            },
          },
        ],
      },
      {
        name: "显示/隐藏网格线",
        id: "canvas28",
        complexKey: ["Ctrl"],
        keys: {
          name: "'",
          key: 222,
        },
      },
      {
        name: "显示/隐藏标尺",
        id: "canvas29",
        complexKey: ["Ctrl"],
        keys: {
          name: "R",
          key: 82,
        },
      },
      {
        name: "显示/隐藏标尺线",
        id: "canvas30",
        complexKey: ["Ctrl"],
        keys: {
          name: ";",
          key: 186,
        },
      },
      {
        name: "显示/隐藏辅助线",
        id: "canvas31",
        complexKey: ["Ctrl"],
        keys: {
          name: "/",
          key: 191,
        },
      },
    ],
  },
  {
    title: "界面布局",
    data: [
      {
        name: "页面全屏",
        id: "system1",
        complexKey: [],
        keys: {
          name: "F11",
          key: 122,
        },
      },
      {
        name: "左侧折叠切换",
        id: "system2",
        complexKey: ["Ctrl", "Shift"],
        keys: {
          name: "1",
          key: [49, 97],
        },
      },
      {
        name: "右侧折叠切换",
        id: "system3",
        complexKey: ["Ctrl", "Shift"],
        keys: {
          name: "2",
          key: [50, 98],
        },
      },
      {
        name: "左右同时折叠",
        id: "system4",
        complexKey: [],
        keys: {
          name: "F",
          key: 70,
        },
      },
      {
        name: "产品面板",
        id: "system5",
        complexKey: [],
        keys: {
          name: "F1",
          key: 112,
        },
      },
      {
        name: "图库面板",
        id: "system6",
        complexKey: [],
        keys: {
          name: "F2",
          key: 113,
        },
      },
      {
        name: "文字面板",
        id: "system7",
        complexKey: [],
        keys: {
          name: "F3",
          key: 114,
        },
      },
      {
        name: "上传面板",
        id: "system8",
        complexKey: [],
        keys: {
          name: "F4",
          key: 115,
        },
      },
      {
        name: "图层面板",
        id: "system11",
        complexKey: [],
        keys: {
          name: "F7",
          key: 118,
        },
      },
      {
        name: "快捷键面板",
        id: "system13",
        complexKey: ["Ctrl", "Shift"],
        keys: {
          name: "K",
          key: 75,
        },
      },
      {
        name: "最大化效果图",
        id: "system14",
        complexKey: ["Ctrl"],
        keys: {
          name: "K",
          key: 75,
        },
      },
      {
        name: "产品说明",
        id: "system15",
        complexKey: ["Ctrl", "Shift"],
        keys: {
          name: "I",
          key: 73,
        },
      },
    ],
  },
  {
    title: "其他",
    data: [
      {
        name: "搜索",
        id: "other1",
        complexKey: ["Ctrl"],
        keys: {
          name: "F",
          key: 70,
        },
      },
      {
        name: "加入购物车面板",
        id: "other2",
        complexKey: ["Ctrl", "Shift"],
        keys: {
          name: "B",
          key: 66,
        },
      },
      {
        name: "帮助说明",
        id: "other3",
        complexKey: ["Ctrl", "Shift"],
        keys: {
          name: "/",
          key: 191,
        },
      },
    ],
  },
];

// 键值与名称对应表, 用于windows和mac键盘显示差异
const keycodeNameMap = {
  65: "A",
  66: "B",
  67: "C",
  68: "D",
  69: "E",
  70: "F",
  71: "G",
  72: "H",
  73: "I",
  74: "J",
  75: "K",
  76: "L",
  77: "M",
  78: "N",
  79: "O",
  80: "P",
  81: "Q",
  82: "R",
  83: "S",
  84: "T",
  85: "U",
  86: "V",
  87: "W",
  88: "X",
  89: "Y",
  90: "Z",
  48: "0",
  49: "1",
  50: "2",
  51: "3",
  52: "4",
  53: "5",
  54: "6",
  55: "7",
  56: "8",
  57: "9",
  96: "0",
  97: "1",
  98: "2",
  99: "3",
  100: "4",
  101: "5",
  102: "6",
  103: "7",
  104: "8",
  105: "9",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  37: "←",
  38: "↑",
  39: "→",
  40: "↓",
  32: "空格/Space",
  46: "Delete",
  8: "Backspace",
  13: "回车/Enter",
  187: "+",
  189: "-",
  107: "+",
  109: "-",
  219: "[",
  221: "]",
  220: "\\",
  186: ";",
  222: "'",
  188: ",",
  190: ".",
  192: "`",
  36: "Home",
  33: "Page Up",
  34: "Page Down",
  35: "End",
  9: "Tab",
  20: "CapsLock",
  173: "静音",
  174: "音量↓",
  175: "音量↑",
};

// 新旧版本映射, 用于旧版本还原
const restoreMap = {
  5: "element5", //水平镜像
  6: "element6", //垂直镜像
  7: "element22", //顺时针45°旋转
  9: "base13", //放大
  10: "base14", //缩小
  11: "base26", //删除
  12: "base24", //保存产品
  13: "system5", //选择产品
  14: "system6", //选择图片
  15: "canvas32", //背景设计
  16: "element20", //图案最大化设计
  17: "base15", //图案复制
  18: "element18", //图案宽度最大化
  19: "element19", //图案高度最大化
  20: "canvas4", //重新设计
  21: "gallery5", //图案平铺-基础
  23: "element21", //铺满
  24: "base25", //背景取色器
};

export { defaultShortcuts, restoreMap, keycodeNameMap };
